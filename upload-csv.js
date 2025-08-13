const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');

// DBsasa
const client = new Client({
    user: 'root',
    host: '168.119.183.3',
    database: 'jero_rpo',
    password: 's7cq453mt2jnicTaQXKT',
    port: 5432,
});

async function loadCustomersCSV() {
    try {
        await client.connect();

        const customers = [];
        fs.createReadStream('./back-end/data/customers.csv')
        .pipe(csv())
        .on('data', (data) => {
            customers.push(data);
        })
        .on('end', async () => {
            for (const customer of customers) {
                const query = `
                    INSERT INTO customers (identification_number, name, email, phone, address)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                const values = [
                    customer.identificationNumber,
                    customer.name,
                    customer.email,
                    customer.phone,
                    customer.address,
                ];
                await client.query(query, values);
            }
            console.log('success customers');
            await client.end();
        })
        .on('error', async (err) => {
            console.error('Error leyendo el CSV:', err);
            await client.end();
        });

    } catch (err) {
        console.error('Error loading customers:', err);
        await client.end();
    }
}

loadCustomersCSV();