let transactions = [];

// Load data when page opens
function loadData() {
    const savedData = localStorage.getItem('transactions');
    if (savedData) {
        transactions = JSON.parse(savedData);
    }
    renderTransactions();
    updateSummary();
}

// Save data
function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add new transaction
function addTransaction() {
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!amount || !description || !date) {
        alert("Please fill all fields!");
        return;
    }

    const transaction = {
        id: Date.now(),
        type: type,
        amount: type === "expense" ? -amount : amount,
        description: description,
        category: category,
        date: date
    };

    transactions.unshift(transaction); // Add at top
    saveData();
    renderTransactions();
    updateSummary();

    // Clear form
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
}

// Render all transactions in table
function renderTransactions() {
    const tbody = document.getElementById('transactions-body');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        const amountClass = transaction.amount > 0 ? 'style="color:green"' : 'style="color:red"';
        
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td ${amountClass}>$${Math.abs(transaction.amount).toFixed(2)}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm("Delete this transaction?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        renderTransactions();
        updateSummary();
    }
}

// Update Summary Cards
function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.amount > 0) income += t.amount;
        else expense += Math.abs(t.amount);
    });

    document.getElementById('total-income').textContent = '$' + income.toFixed(2);
    document.getElementById('total-expense').textContent = '$' + expense.toFixed(2);
    document.getElementById('balance').textContent = '$' + (income - expense).toFixed(2);
}

// Initialize the app
function init() {
    // Set today's date
    document.getElementById('date').valueAsDate = new Date();
    
    // Populate categories
    const categories = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Bills", "Other"];
    const select = document.getElementById('category');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });

    loadData();
}

// Start the application
window.onload = init;