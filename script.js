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
render();