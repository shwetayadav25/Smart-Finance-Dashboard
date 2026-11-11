
// ======================================
// FINOVA - SMART FINANCE DASHBOARD
// ======================================


// Initial Data

let income = Number(localStorage.getItem("income")) || 125000;
let expense = Number(localStorage.getItem("expense")) || 35750;

let transactions = JSON.parse(localStorage.getItem("transactions")) || [
    { name: "Freelancing", amount: 5000, type: "income", icon: "💰" },
    { name: "Shopping", amount: 2500, type: "expense", icon: "🛍️" },
    { name: "Salary", amount: 25000, type: "income", icon: "💰" },
    { name: "Food & Dining", amount: 450, type: "expense", icon: "🍔" }
];


// Save Data

function saveData() {
    localStorage.setItem("income", income);
    localStorage.setItem("expense", expense);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


// Update Dashboard

function updateDashboard() {

    const balance = document.getElementById("total-balance");
    const totalIncome = document.getElementById("total-income");
    const totalExpense = document.getElementById("total-expense");

    if (balance) {
        balance.textContent = "₹" + (income - expense).toLocaleString("en-IN");
    }

    if (totalIncome) {
        totalIncome.textContent = "₹" + income.toLocaleString("en-IN");
    }

    if (totalExpense) {
        totalExpense.textContent = "₹" + expense.toLocaleString("en-IN");
    }
}


// Display Transactions + Search + Filter + Sorting

function displayTransactions() {

    const list = document.getElementById("transaction-list");

    if (!list) return;

    list.innerHTML = "";

    const searchInput = document.getElementById("search-transaction");
    const filterInput = document.getElementById("transaction-filter");
    const sortInput = document.getElementById("sort-transaction");

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filterType = filterInput ? filterInput.value : "all";
    const sortType = sortInput ? sortInput.value : "newest";


    let filteredTransactions = transactions
        .map(function(transaction, index) {
            return { transaction, index };
        })
        .filter(function(item) {

            const transaction = item.transaction;

            const matchesSearch =
                transaction.name.toLowerCase().includes(searchText) ||
                transaction.type.toLowerCase().includes(searchText) ||
                String(transaction.amount).includes(searchText);

            const matchesFilter =
                filterType === "all" ||
                transaction.type === filterType;

            return matchesSearch && matchesFilter;
        });


    // Sorting Feature

    if (sortType === "newest") {
        filteredTransactions.reverse();
    }

    else if (sortType === "oldest") {
        // Original order is oldest first
    }

    else if (sortType === "high") {
        filteredTransactions.sort(function(a, b) {
            return b.transaction.amount - a.transaction.amount;
        });
    }

    else if (sortType === "low") {
        filteredTransactions.sort(function(a, b) {
            return a.transaction.amount - b.transaction.amount;
        });
    }


    // No Transactions Found

    if (filteredTransactions.length === 0) {
        list.textContent = "No transactions found.";
        return;
    }


    // Display Rows

    filteredTransactions.forEach(function(item) {

        const transaction = item.transaction;
        const index = item.index;

        const row = document.createElement("div");
        row.className = "transaction-row";

        const sign = transaction.type === "income" ? "+" : "-";

        const icon = document.createElement("span");
        icon.textContent = transaction.icon || "💳";

        const details = document.createElement("span");
        details.textContent = transaction.name;

        const amount = document.createElement("span");

        amount.textContent =
            sign + "₹" + transaction.amount.toLocaleString("en-IN");

        amount.style.color =
            transaction.type === "income" ? "#22c55e" : "#fb7185";


        // Edit Button

        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {

            const newName = prompt("Enter new transaction name:", transaction.name);

            if (newName === null || newName.trim() === "") return;

            const amountText = prompt("Enter new amount:", transaction.amount);

            if (amountText === null || amountText.trim() === "") return;

            const newAmount = Number(amountText);

            if (!Number.isFinite(newAmount) || newAmount <= 0) {
                alert("Please enter a valid amount!");
                return;
            }

            if (transaction.type === "income") {
                income = income - transaction.amount + newAmount;
            } else {
                expense = expense - transaction.amount + newAmount;
            }

            transaction.name = newName.trim();
            transaction.amount = newAmount;

            saveData();
            updateDashboard();
            displayTransactions();
            updateChart();

            alert("Transaction Updated Successfully!");
        });


        // Delete Button

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {

            if (!confirm("Delete this transaction?")) return;

            if (transaction.type === "income") {
                income -= transaction.amount;
            } else {
                expense -= transaction.amount;
            }

            transactions.splice(index, 1);

            saveData();
            updateDashboard();
            displayTransactions();
            updateChart();
        });


        row.appendChild(icon);
        row.appendChild(details);
        row.appendChild(amount);
        row.appendChild(editBtn);
        row.appendChild(deleteBtn);

        list.appendChild(row);

    });

}


// Search Transactions

const searchInput = document.getElementById("search-transaction");

if (searchInput) {
    searchInput.addEventListener("input", displayTransactions);
}


// Filter Transactions

const filterInput = document.getElementById("transaction-filter");

if (filterInput) {
    filterInput.addEventListener("change", displayTransactions);
}


// Sorting Event

const sortInput = document.getElementById("sort-transaction");

if (sortInput) {
    sortInput.addEventListener("change", displayTransactions);
}


// Add Transaction

const addButton = document.getElementById("add-transaction");

if (addButton) {

    addButton.addEventListener("click", function() {

        const nameInput = document.getElementById("transaction-name");
        const amountInput = document.getElementById("transaction-amount");
        const typeInput = document.getElementById("transaction-type");

        if (!nameInput || !amountInput || !typeInput) {
            alert("Transaction input fields not found!");
            return;
        }

        const name = nameInput.value.trim();
        const amount = Number(amountInput.value);
        const type = typeInput.value;

        if (name === "" || amount <= 0 || !Number.isFinite(amount)) {
            alert("Please enter valid transaction details!");
            return;
        }

        if (type !== "income" && type !== "expense") {
            alert("Please select transaction type!");
            return;
        }

        if (type === "income") {
            income += amount;
        } else {
            expense += amount;
        }

        const icon = type === "income" ? "💰" : "💸";

        transactions.push({
            name: name,
            amount: amount,
            type: type,
            icon: icon
        });

        saveData();
        updateDashboard();
        displayTransactions();
        updateChart();

        nameInput.value = "";
        amountInput.value = "";

        alert("Transaction Added Successfully!");
    });

}


// Finance Chart

const ctx = document.getElementById("financeChart");

let financeChart = null;

if (ctx && typeof Chart !== "undefined") {

    financeChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

            datasets: [

                {
                    label: "Income",
                    data: [12000, 15000, 18000, 20000, 22000, income],
                    backgroundColor: "#8b5cf6",
                    borderRadius: 6
                },

                {
                    label: "Expenses",
                    data: [5000, 7000, 8000, 9000, 10000, expense],
                    backgroundColor: "#fb7185",
                    borderRadius: 6
                }

            ]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }
            },

            scales: {

                x: {
                    ticks: { color: "#ffffff" },
                    grid: { display: false }
                },

                y: {
                    beginAtZero: true,
                    ticks: { color: "#ffffff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }

            }
        }
    });
}


// Update Chart

function updateChart() {

    if (!financeChart) return;

    financeChart.data.datasets[0].data[5] = income;
    financeChart.data.datasets[1].data[5] = expense;

    financeChart.update();
}


// Initial Dashboard

updateDashboard();
displayTransactions();
saveData();


// Debug Test

console.log("JavaScript Loaded Successfully");
console.log(typeof Chart);
console.log(typeof document.getElementById("add-transaction"));
