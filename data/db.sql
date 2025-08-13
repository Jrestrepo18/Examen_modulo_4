CREATE TYPE status_appointment AS ENUM ('Completada', 'Cancelada', 'Programada', 'Reprogramada');
CREATE TYPE method_pay AS ENUM ('Efectivo', 'Tarjeta', 'Transferencia', 'Seguro');

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone   VARCHAR(20)  NOT NULL,
    city VARCHAR(255) NOT NULL
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    appointment_datetime timestamp  NOT NULL,
    status status_appointment NOT NULL,
    payment_method method_pay NOT NULL,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

create table diagnosis (
	id SERIAL primary key,
	diagnosis TEXT not null,
	treatment TEXT not null,
	appointment_id INT not null,
	
	foreign key (appointment_id) references appointments(id) on delete CASCADE
)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);