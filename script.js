// Clases para gestionar la información de usuarios y gastos
class Usuario {
    constructor(nombre, pathImg) {
        this.nombre = nombre;
        this.pathImg = pathImg;
        this.gastos = [];
        this.totalPaid = 0;
        this.balance = 0;
    }

    addGasto(gasto) {
        this.gastos.push(gasto);
        this.totalPaid += gasto.monto;
    }

    actualizarBalance(balance) {
        this.balance += balance;
    }
}

class Gasto {
    constructor(titulo, monto, fecha) {
        this.titulo = titulo;
        this.monto = monto;
        this.fecha = fecha;
    }
}

// Instancia de usuarios
let usuarios = {
    'Usuario 1': new Usuario('Usuario 1', 'img/avatar_a.png'),
    'Usuario 2': new Usuario('Usuario 2', 'img/avatar_b.png'),
    'Usuario 3': new Usuario('Usuario 3', 'img/avatar_c.png')
};

// Función para añadir el gasto y actualizar los balances
function addExpense(user, title, amount, date) {
    let gasto = new Gasto(title, parseFloat(amount), date);
    usuarios[user].addGasto(gasto);

    let amountPerUser = parseFloat(amount) / Object.keys(usuarios).length;

    for (let key in usuarios) {
        if (key === user) {
            usuarios[key].actualizarBalance(parseFloat(amount) - amountPerUser);
        } else {
            usuarios[key].actualizarBalance(-amountPerUser);
        }
    }

    updateSummary(user, title, amount, date);
    updateAccountSummary();
}

// Función para actualizar la pestaña resumen
function updateSummary(user, title, amount, date) {
    let summaryDiv = document.getElementById('summary');

    let expenseDiv = document.createElement('div');
    expenseDiv.classList.add('d-flex', 'align-items-center', 'mb-3');

    let userImg = document.createElement('img');
    userImg.src = usuarios[user].pathImg;
    userImg.alt = user;
    userImg.classList.add('user-img', 'me-3');

    let expenseInfo = document.createElement('div');
    let expenseText = document.createElement('p');
    expenseText.textContent = `${user} pagó ${parseFloat(amount).toFixed(2)}€ el ${date} con motivo de "${title}".`;

    expenseInfo.appendChild(expenseText);
    expenseDiv.appendChild(userImg);
    expenseDiv.appendChild(expenseInfo);

    summaryDiv.appendChild(expenseDiv);
}

// Función para actualizar la pestaña cuentas
function updateAccountSummary() {
    let accountDiv = document.getElementById('account-summary');
    accountDiv.innerHTML = '';

    for (let user in usuarios) {
        let userDiv = document.createElement('div');
        userDiv.classList.add('account-item', 'd-flex', 'align-items-center');

        let userImg = document.createElement('img');
        userImg.src = usuarios[user].pathImg;
        userImg.alt = user;
        userImg.classList.add('user-img', 'me-3');

        let userInfo = document.createElement('div');
        userInfo.classList.add('account-info');

        let userName = document.createElement('strong');
        userName.textContent = `${user}: `;

        let userBalance = document.createElement('span');
        userBalance.textContent = `Pagó ${usuarios[user].totalPaid.toFixed(2)}€. ${
            usuarios[user].balance >= 0 
            ? `Le deben ${usuarios[user].balance.toFixed(2)}€`
            : `Debe ${Math.abs(usuarios[user].balance).toFixed(2)}€`
        }`;

        userInfo.appendChild(userName);
        userInfo.appendChild(userBalance);
        userDiv.appendChild(userImg);
        userDiv.appendChild(userInfo);

        accountDiv.appendChild(userDiv);
    }
}

// Función para validar el formulario
function validateForm(user, title, amount, date) {
    if (user === '---' || title === '' || amount === '' || date === '') {
        alert('Debes rellenar todos los campos.');
        return false;
    }
    return true;
}

// Manejar el envío del formulario
document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let user = document.getElementById('user-select').value;
    let title = document.getElementById('title').value;
    let amount = document.getElementById('amount').value;
    let date = document.getElementById('date').value;

    if (validateForm(user, title, amount, date)) {
        addExpense(user, title, amount, date);
        document.getElementById('expense-form').reset();
    }
});

// Inicialización de la pestaña cuentas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateAccountSummary();
});
