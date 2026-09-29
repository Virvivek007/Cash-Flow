# Cash-Flow — Salary & Expense Tracker

A vanilla JavaScript dashboard for logging salary and expenses, tracking remaining balance in real time, and visualizing the split with a live pie chart. Built as Sprint 02 of a front-end engineering track, focused on DOM manipulation, event handling, and data persistence without frameworks.

## Features

### Phase 1 — Core Logic
- Form-based input for Total Salary, Expense Name, and Expense Amount
- Real-time calculation: `Total Salary − Total Expenses = Remaining Balance`
- Dynamic rendering of the expense list to the DOM
- Input validation — blocks empty or negative values with inline error messages

### Phase 2 — Persistence & Visualization
- State is serialized to `localStorage` and restored on page load
- Delete any expense, with instant recalculation and re-render
- Live pie chart (Chart.js) showing Remaining Balance vs. Total Expenses
- Chart instance is updated in place (`.update()`) rather than recreated, avoiding duplication on re-render

### Phase 3 — Stretch Features
- **PDF report export** (jsPDF) — downloads salary, expenses, and balance as a formatted PDF, paginating automatically for long expense lists
- **Currency conversion** (Frankfurter API) — toggle the display currency between INR, USD, EUR, and GBP; all figures are stored internally in INR and converted only for display
- **Threshold alerts** — balance turns red and a warning banner appears when the remaining balance drops below 10% of salary

## Tech Stack
- HTML5 / CSS3 (no frameworks)
- Vanilla JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) — pie chart rendering
- [jsPDF](https://github.com/parallax/jsPDF) — PDF report generation
- [Frankfurter API](https://www.frankfurter.app/) — live exchange rates
- Browser `localStorage` — client-side persistence

## Project Structure
```
├── index.html      # Markup and layout
├── style.css       # Styling
├── script.js       # State, DOM rendering, event handlers, PDF & currency logic
└── README.md
```

## Running Locally
This project has no build step or dependencies to install.

1. Clone the repo:
   ```bash
   git clone https://github.com/Virvivek007/Cash-Flow.git
   cd Cash-Flow
   ```
2. Open `index.html` directly in a browser, **or** serve it locally (recommended, since `fetch()` for currency conversion can be blocked on `file://` URLs in some browsers):
   ```bash
   npx serve .
   ```
3. Visit the local URL shown in the terminal (e.g. `http://localhost:3000`).

## Notes
- All monetary values are stored internally in INR; conversion happens only at display time.
- The currency dropdown falls back to INR automatically if the exchange-rate API request fails.
- PDF exports use `Rs.` instead of `₹`, since jsPDF's default fonts don't render the rupee glyph.

## Author
Built by [Virvivek007](https://github.com/Virvivek007) as part of a front-end engineering sprint.
