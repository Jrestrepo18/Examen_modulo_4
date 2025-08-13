# DB Project – Customer and Transaction Management

## Description
This project is a full-stack application for customer and transaction management, with database storage and support for data uploads via CSV.

Includes:
- Node.js back-end with Express and PostgreSQL.
- Front-end with HTML, CSS, and pure JavaScript.
- Scripts for importing data from CSV.
- Database with SQL script and ER diagram.

---

## Project Structure

  proyecto_db/
  │── back-end/                
  │   ├── app.js              
  │   ├── package.json         
  │   └── data/               
  │       ├── invoices.csv
  │       ├── customers.csv
  │       └── transactions.csv
  │
  │── front-end/              
  │   ├── home.html
  │   ├── createCustomer.html
  │   ├── css/style.css
  │   └── js/
  │       ├── config.js        
  │       └── scriptsCustomers.js
  │
  │── data/db.sql              
  │── docs/ER.png              
  │── upload-csv.js             
  │── package.json             
  └── README.md

---

## 🚀 Technologies Used
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript
- **Other:** csv-parser (CSV reading)

---

## ⚙️ Installation and Configuration

### 1️⃣ Clone the repository
```bash
git clone https://github.com/usuario/proyecto_db.git
cd proyecto_db
