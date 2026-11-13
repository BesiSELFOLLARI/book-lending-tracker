let loans = LendLib.load();

const form = document.getElementById("loanForm");
const body = document.getElementById("loanBody");
const errorEl = document.getElementById("formError");

function render() {
  const e = LendLib.escapeHtml;
  body.innerHTML = loans.map(l => {
    const status = LendLib.getStatus(l);
    const badge = { "On loan": "ok", Overdue: "danger", Returned: "warn" }[status];
    return `<tr class="${status === "Overdue" ? "overdue" : ""}">
      <td>${e(l.title)}</td><td>${e(l.author)}</td><td>${e(l.borrower)}</td>
      <td>${e(l.dueDate)}</td><td>${e(l.genre)}</td>
      <td><span class="bt-badge bt-badge-${badge}">${status}</span></td>
      <td>
        ${l.returned ? "" : `<button class="bt-btn bt-btn-ok" data-action="return" data-id="${l.id}">Returned</button>`}
        <button class="bt-btn bt-btn-danger" data-action="delete" data-id="${l.id}">Delete</button>
      </td></tr>`;
  }).join("");

  const s = LendLib.summary(loans);
  document.getElementById("totalLoans").textContent = s.total;
  document.getElementById("overdueLoans").textContent = s.overdue;
}

form.addEventListener("submit", ev => {
  ev.preventDefault();
  const data = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    borrower: document.getElementById("borrower").value,
    dueDate: document.getElementById("dueDate").value,
    genre: document.getElementById("genre").value
  };
  const missing = LendLib.validate(data);
  if (missing.length) {
    errorEl.textContent = "Please fill in: " + missing.join(", ");
    return;
  }
  errorEl.textContent = "";
  loans.push(LendLib.create(data));
  LendLib.save(loans);
  form.reset();
  render();
});

body.addEventListener("click", ev => {
  const btn = ev.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === "return") {
    loans = loans.map(l => (l.id === id ? { ...l, returned: true } : l));
  } else {
    loans = loans.filter(l => l.id !== id);
  }
  LendLib.save(loans);
  render();
});

render();