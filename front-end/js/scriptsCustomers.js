const APP_URL = "http://localhost:3000";
const tblPatientsBody = document.getElementById('tblcustomerBody'); 
const formEditPatient = document.getElementById('frmEditcustomer');  
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('frmcustomer'); 
  const msg  = document.getElementById('msg');

  if (!form) {
    console.error('No existe #frm en el DOM');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) msg.innerHTML = '';

    const formData = new FormData(form);
    const payload = {
      identification_number: formData.get('identification_number')?.trim(),
      name:  formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      phone: formData.get('phone')?.trim(),
      city:  formData.get('address')?.trim() 
    };

    if (!payload.identification_number || !payload.name || !payload.email || !payload.phone || !payload.city) {
      if (msg) msg.innerHTML = `<div class="alert alert-danger">Completa todos los campos.</div>`;
      return;
    }

    try {
      const res = await fetch(APP_URL + '/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(()=> '');
        throw new Error(`HTTP ${res.status} ${text}`);
      }

      await res.json().catch(() => ({}));
      if (msg) msg.innerHTML = `<div class="alert alert-success">Cliente creado</div>`;
      form.reset();
      await reloadCustomers(); // refresca tabla después de crear
    } catch (err) {
      console.error('Error en POST:', err);
      if (msg) msg.innerHTML = `<div class="alert alert-danger">Error al crear cliente: ${err.message}</div>`;
    }
  });
});

// --- LISTADO ---
async function reloadCustomers() {
  const res = await fetch(APP_URL + '/customer');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const rows = Array.isArray(data) ? data : (data.rows || []);

  if (!tblCustomersBody) return;
  tblCustomersBody.innerHTML = '';
  rows.forEach(customer => {
    tblPatientsBody.innerHTML += `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customer.city}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-primary" data-action="edit" data-id="${customer.id}" data-name="${customer.name}">Editar</button>
          <button class="btn btn-sm btn-danger"  data-action="delete" data-id="${customer.id}" data-name="${customer.name}">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

(async function index() {
  try {
    await reloadCostomers();   
  } catch (error) {
    console.error('Error en GET:', error);
  }
})();

// --- UPDATE ---
async function updateCustomer(id, payload) {
  const res = await fetch(`${APP_URL}/customers/${id}`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json().catch(() => ({}));
}

window.addEventListener('DOMContentLoaded', () => {
  const frm = document.getElementById('frmEditCostomer'); 
  if (!frm) return;

  frm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
  
    
      const id   = document.getElementById('customerId').value;
      const identification_number = document.getElementById('costumerIdentificationNumber').value.trim();
      const name  = document.getElementById('customerName').value.trim();
      const email = document.getElementById('customerEmail').value.trim();
      const phone = document.getElementById('customerPhone').value.trim();
      const city  = document.getElementById('customerCity').value.trim();

      await updateCustumer(id, { identification_number, name, email, phone, city });

      // Cerrar modal
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById('exampleModalCustomer')
      ).hide();

      // Refrescar tabla y avisar
      await reloadCostomers();
      alert('Cliente actualizado');
    } catch (err) {
      console.error('Error en PUT:', err);
      alert('No se pudo actualizar: ' + err.message);
    }
  });
});

// --- DELETE ---
async function deleteCustomer(id, name) {
  try {
    const nameLabel = name ? `"${name}"` : `#${id}`;
    const ok = confirm(`¿Eliminar cliente ${nameLabel}?`);
    if (!ok) return;

    const res = await fetch(`${APP_URL}/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${t}`);
    }

    await reloadCustomers();
    alert(`Cliente ${nameLabel} eliminado`);
  } catch (error) {
    console.error('Error en DELETE:', error);
    alert('No se pudo eliminar: ' + error.message);
  }
}

// --- Delegación de eventos en la tabla ---
if (tblCustomersBody) {
  tblCustomersBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button.btn-sm');
    if (!btn) return;

    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const action = btn.dataset.action;
    if (!id || !action) return;

    if (action === 'edit') {
      showCostumer(id);
    } else if (action === 'delete') {
      deleteCustomer(id, name);
    }
  });
}

// --- SHOW (cargar datos al modal) ---
async function showCustomer(id) {
  try {
    const res = await fetch(`${APP_URL}/customers/${id}`); // <- plural
    if (!res.ok) throw new Error(`Error HTTP ${res.status} al buscar el cliente.`);

    const costumer = await res.json();
    const c = Array.isArray(customer) ? customer[0] : customer;
    if (!c) throw new Error('Cliente no encontrado');

    // IDs de inputs dentro del modal (ajústalos a tu HTML real)
    document.getElementById('customerId').value = c.id;
    document.getElementById('customerIdentificationNumber').value = c.identification_number ?? '';
    document.getElementById('customerName').value = c.name ?? '';
    document.getElementById('customerEmail').value = c.email ?? '';
    document.getElementById('customerPhone').value = c.phone ?? '';
    document.getElementById('customerCity').value = c.city ?? '';

    const modalElement = document.getElementById('exampleModalCustumer');
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  } catch (error) {
    console.error('Error en showCostumer:', error);
    alert('No se pudieron cargar los datos del cliente.');
  }
}