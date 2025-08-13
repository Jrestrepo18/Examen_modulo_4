const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secretito-cambia-esto'; // cambia en prod
const JWT_EXPIRES_IN = '7d';

const app = express();
app.use(express.json());
app.use(cors())

// Configura tu conexión a PostgreSQL
const pool = new Pool({
    user: 'root',
    host: '168.119.183.3',
    database: 'diego_z',
    password: 's7cq453mt2jnicTaQXKT',
    port: 5432
});


app.get("/customers", async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM customers order by id desc");
        return res.json(result);
    } catch (error) {
        res.status(500).json({error : 'error'})
    }
});

app.get("/customers/:id", async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM customers WHERE id = $1", [req.params.id]);
        return res.json(result.rows);
    } catch (error) {
        res.status(500).json({error : 'error'})
    }
});

app.post('/customers', async (req, res) => {
    const { identification_number, name, email, phone, address } = req.body;
    try {
        const result = await pool.query(
        'INSERT INTO customers (identification_number, name, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [identification_number,name, email, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el paciente' });
    }
});

app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { identification_number, name, email, phone, address } = req.body;
    try {
        const result = await pool.query(
            'UPDATE patients SET identification_number = 1$, name = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *',
            [identification_number, name, email, phone, address, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el Cliente' });
    }
});

app.delete('/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json({ mensaje: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el Cliente' });
    }
});

