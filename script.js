<<<<<<< HEAD
let state = {
  salary: 0,
  expenses: [] 
};

const STORAGE_KEY = "cashflow-state";


const salaryForm     = document.getElementById("salary-form");
const salaryInput    = document.getElementById("salary-input");
const salaryError    = document.getElementById("salary-error");

const expenseForm    = document.getElementById("expense-form");
const expenseNameEl  = document.getElementById("expense-name");
const expenseAmtEl   = document.getElementById("expense-amount");
const expenseError   = document.getElementById("expense-error");

const summarySalary   = document.getElementById("summary-salary");
const summaryExpenses = document.getElementById("summary-expenses");
const summaryBalance  = document.getElementById("summary-balance");
const balanceCell     = summaryBalance.closest(".summary-cell");

const alertBanner = document.getElementById("alert-banner");
const expenseList = document.getElementById("expense-list");
const emptyState  = document.getElementById("empty-state");
const footerNote  = document.getElementById("footer-note");


function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    footerNote.textContent = "Saved to this browser \u2014 reload the page and it'll still be here.";
  } catch (err) {
    // localStorage can throw (private browsing, quota exceeded, etc.)
    console.error("Could not save to localStorage:", err);
    footerNote.textContent = "Could not save locally \u2014 your changes exist only for this session.";
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    // Defensive defaults in case older/partial data is in storage.
    state.salary = Number(parsed.salary) || 0;
    state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
  } catch (err) {
    console.error("Stored data was corrupted, starting fresh:", err);
  }
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = false;
}
function clearError(el) {
  el.hidden = true;
  el.textContent = "";
}


// Formats a number as currency text. Kept in one place so every
// on-screen figure looks consistent.
function formatCurrency(n) {
  return "\u20B9" + n.toFixed(2);
}

function totalExpenses() {
  return state.expenses.reduce((sum, item) => sum + item.amount, 0);
}

function render() {
  const total = totalExpenses();
  const balance = state.salary - total;

  summarySalary.textContent = formatCurrency(state.salary);
  summaryExpenses.textContent = formatCurrency(total);
  summaryBalance.textContent = formatCurrency(balance);

  // Negative-balance styling
  summaryBalance.classList.toggle("negative", balance < 0);

  // Phase 3 stretch: threshold alert when balance < 10% of salary
  const threshold = state.salary * 0.10;
  const shouldWarn = state.salary > 0 && balance < threshold;
  alertBanner.hidden = !shouldWarn;
  balanceCell.classList.toggle("negative", shouldWarn || balance < 0);

  renderExpenseList();
  renderChart(balance, total);
}

function renderExpenseList() {

  expenseList.innerHTML = "";

  if (state.expenses.length === 0) {
    expenseList.appendChild(emptyState);
    return;
  }

  state.expenses.forEach((item) => {
    const li = document.createElement("li");
    li.className = "expense-row";
    li.dataset.id = item.id;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = item.name;

    const leader = document.createElement("span");
    leader.className = "leader";

    const amount = document.createElement("span");
    amount.className = "amount";
    amount.textContent = formatCurrency(item.amount);

    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.type = "button";
    delBtn.setAttribute("aria-label", `Delete ${item.name}`);
    delBtn.textContent = "\u2715"; 
    delBtn.addEventListener("click", () => deleteExpense(item.id));

    li.append(name, leader, amount, delBtn);
    expenseList.appendChild(li);
  });
}


let balanceChart = null; // holds the Chart.js instance

function renderChart(balance, expenses) {
  const ctx = document.getElementById("balance-chart");
  const safeBalance = Math.max(balance, 0); // chart can't show negative slices
  const data = {
    labels: ["Remaining balance", "Total expenses"],
    datasets: [{
      data: [safeBalance, expenses],
      backgroundColor: ["#136c0b", "#C1503B"],
      borderColor: "#182325",
      borderWidth: 2
    }]
  };

  if (balanceChart) {
    
    balanceChart.data = data;
    balanceChart.update();
    return;
  }

  balanceChart = new Chart(ctx, {
    type: "pie",
    data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#E8E3D6", font: { family: "Inter" } }
        }
      }
    }
  });
}


salaryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError(salaryError);

  // DOM inputs are always strings — must be parsed before math (FAQ #1).
  const value = Number(salaryInput.value);

  if (salaryInput.value === "" || isNaN(value) || value < 0) {
    showError(salaryError, "Enter a salary of 0 or more.");
    return;
  }

  state.salary = value;
  salaryInput.value = "";
  saveState();
  render();
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError(expenseError);

  const name = expenseNameEl.value.trim();
  const amount = Number(expenseAmtEl.value);

  if (!name) {
    showError(expenseError, "Give the expense a name.");
    return;
  }
  if (expenseAmtEl.value === "" || isNaN(amount) || amount < 0) {
    showError(expenseError, "Enter an amount of 0 or more.");
    return;
  }

  state.expenses.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    amount
  });

  expenseNameEl.value = "";
  expenseAmtEl.value = "";
  saveState();
  render();
});

function deleteExpense(id) {
  state.expenses = state.expenses.filter((item) => item.id !== id);
  saveState();
  render();
}


loadState();
=======
let state = {
  salary: 0,
  expenses: [] 
};

let currency = {
  code: "INR",
  rate: 1,     
  symbol: "\u20B9"
};

const SYMBOLS = { INR: "\u20B9", USD: "$", EUR: "\u20AC", GBP: "\u00A3" };

const STORAGE_KEY = "cashflow-state";

const currencySelect = document.getElementById("currency-select");
const salaryForm     = document.getElementById("salary-form");
const salaryInput    = document.getElementById("salary-input");
const salaryError    = document.getElementById("salary-error");

const expenseForm    = document.getElementById("expense-form");
const expenseNameEl  = document.getElementById("expense-name");
const expenseAmtEl   = document.getElementById("expense-amount");
const expenseError   = document.getElementById("expense-error");

const summarySalary   = document.getElementById("summary-salary");
const summaryExpenses = document.getElementById("summary-expenses");
const summaryBalance  = document.getElementById("summary-balance");
const balanceCell     = summaryBalance.closest(".summary-cell");

const alertBanner = document.getElementById("alert-banner");
const expenseList = document.getElementById("expense-list");
const emptyState  = document.getElementById("empty-state");
const footerNote  = document.getElementById("footer-note");


function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    footerNote.textContent = "Saved to this browser \u2014 reload the page and it'll still be here.";
  } catch (err) {
    // localStorage can throw (private browsing, quota exceeded, etc.)
    console.error("Could not save to localStorage:", err);
    footerNote.textContent = "Could not save locally \u2014 your changes exist only for this session.";
  }
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    // Defensive defaults in case older/partial data is in storage.
    state.salary = Number(parsed.salary) || 0;
    state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
  } catch (err) {
    console.error("Stored data was corrupted, starting fresh:", err);
  }
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = false;
}
function clearError(el) {
  el.hidden = true;
  el.textContent = "";
}


// Formats a number as currency text. Kept in one place so every
// on-screen figure looks consistent.
function formatCurrency(n) {
  const converted = n * currency.rate;
  return currency.symbol + converted.toFixed(2);
}

function totalExpenses() {
  return state.expenses.reduce((sum, item) => sum + item.amount, 0);
}

function render() {
  const total = totalExpenses();
  const balance = state.salary - total;

  summarySalary.textContent = formatCurrency(state.salary);
  summaryExpenses.textContent = formatCurrency(total);
  summaryBalance.textContent = formatCurrency(balance);

  // Negative-balance styling
  summaryBalance.classList.toggle("negative", balance < 0);

  // Phase 3 stretch: threshold alert when balance < 10% of salary
  const threshold = state.salary * 0.10;
  const shouldWarn = state.salary > 0 && balance < threshold;
  alertBanner.hidden = !shouldWarn;
  balanceCell.classList.toggle("negative", shouldWarn || balance < 0);

  renderExpenseList();
  renderChart(balance, total);
}

async function setCurrency(code) {
  if (code === "INR") {
    currency = { code: "INR", rate: 1, symbol: SYMBOLS.INR };
    render();
    return;
  }

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${code}&to=INR`);
    if (!res.ok) throw new Error("Rate fetch failed");
    const data = await res.json();
    const inrPerUnit = data.rates.INR;
    currency = { code, rate: 1 / inrPerUnit, symbol: SYMBOLS[code] };
  } catch (err) {
    console.error("Currency conversion failed:", err);
    alert("Could not fetch exchange rate. Staying on INR.");
    currency = { code: "INR", rate: 1, symbol: SYMBOLS.INR };
    currencySelect.value = "INR";
  }
  render();
}

currencySelect.addEventListener("change", () => {
  setCurrency(currencySelect.value);
});

function renderExpenseList() {

  expenseList.innerHTML = "";

  if (state.expenses.length === 0) {
    expenseList.appendChild(emptyState);
    return;
  }

  state.expenses.forEach((item) => {
    const li = document.createElement("li");
    li.className = "expense-row";
    li.dataset.id = item.id;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = item.name;

    const leader = document.createElement("span");
    leader.className = "leader";

    const amount = document.createElement("span");
    amount.className = "amount";
    amount.textContent = formatCurrency(item.amount);

    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.type = "button";
    delBtn.setAttribute("aria-label", `Delete ${item.name}`);
    delBtn.textContent = "\u2715"; 
    delBtn.addEventListener("click", () => deleteExpense(item.id));

    li.append(name, leader, amount, delBtn);
    expenseList.appendChild(li);
  });
}


let balanceChart = null; // holds the Chart.js instance

function renderChart(balance, expenses) {
  const ctx = document.getElementById("balance-chart");
  const safeBalance = Math.max(balance, 0); // chart can't show negative slices
  const data = {
    labels: ["Remaining balance", "Total expenses"],
    datasets: [{
      data: [safeBalance, expenses],
      backgroundColor: ["#136c0b", "#C1503B"],
      borderColor: "#182325",
      borderWidth: 2
    }]
  };

  if (balanceChart) {
    
    balanceChart.data = data;
    balanceChart.update();
    return;
  }

  balanceChart = new Chart(ctx, {
    type: "pie",
    data,
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#E8E3D6", font: { family: "Inter" } }
        }
      }
    }
  });
}


salaryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError(salaryError);

  // DOM inputs are always strings — must be parsed before math (FAQ #1).
  const value = Number(salaryInput.value);

  if (salaryInput.value === "" || isNaN(value) || value < 0) {
    showError(salaryError, "Enter a salary of 0 or more.");
    return;
  }

  state.salary = value;
  salaryInput.value = "";
  saveState();
  render();
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError(expenseError);

  const name = expenseNameEl.value.trim();
  const amount = Number(expenseAmtEl.value);

  if (!name) {
    showError(expenseError, "Give the expense a name.");
    return;
  }
  if (expenseAmtEl.value === "" || isNaN(amount) || amount < 0) {
    showError(expenseError, "Enter an amount of 0 or more.");
    return;
  }

  state.expenses.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    amount
  });

  expenseNameEl.value = "";
  expenseAmtEl.value = "";
  saveState();
  render();
});

function deleteExpense(id) {
  state.expenses = state.expenses.filter((item) => item.id !== id);
  saveState();
  render();
}


function pdfMoney(n) {
  return currency.code + " " + (n * currency.rate).toFixed(2);
}
function downloadReport() {
  if (!window.jspdf) {
    alert("PDF library failed to load. Check your internet connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const total = totalExpenses();
  const balance = state.salary - total;
  let y = 20;

  doc.setFontSize(20);
  doc.text("Cash-Flow Report", 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text("Generated: " + new Date().toLocaleString(), 14, y);
  y += 14;

  doc.setFontSize(12);
  doc.text("Total Salary:", 14, y);
  doc.text(pdfMoney(state.salary), 196, y, { align: "right" });
  y += 8;
  doc.text("Total Expenses:", 14, y);
  doc.text(pdfMoney(total), 196, y, { align: "right" });
  y += 8;

  const low = state.salary > 0 && balance < state.salary * 0.10;
  if (low || balance < 0) doc.setTextColor(193, 80, 59);
  doc.setFont(undefined, "bold");
  doc.text("Remaining Balance:", 14, y);
  doc.text(pdfMoney(balance), 196, y, { align: "right" });
  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 0);
  y += 6;

  doc.line(14, y, 196, y);
  y += 10;

  doc.setFontSize(14);
  doc.text("Expense List", 14, y);
  y += 8;
  doc.setFontSize(11);

  if (state.expenses.length === 0) {
    doc.text("No expenses logged.", 14, y);
  } else {
    state.expenses.forEach((item, i) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${i + 1}. ${item.name}`, 14, y);
      doc.text(pdfMoney(item.amount), 196, y, { align: "right" });
      y += 7;
    });
  }

  doc.save("cashflow-report.pdf");
}



document.getElementById("download-report").addEventListener("click", downloadReport);


loadState();
>>>>>>> 3a88e64 (update download dashboard)
render();