/* lendlib.js - reusable loan-tracking helpers, exposes window.LendLib */
(function (global) {
  const KEY = "bookLendingTracker";
  const REQUIRED = ["title", "author", "borrower", "dueDate", "genre"];

  const LendLib = {
    today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; },

    validate(data) {
      return REQUIRED.filter(f => !data[f] || !String(data[f]).trim());
    },

    create(data) {
      const loan = { id: Date.now().toString(), returned: false };
      REQUIRED.forEach(f => (loan[f] = String(data[f]).trim()));
      return loan;
    },

    isOverdue(loan) {
      return !loan.returned && new Date(loan.dueDate + "T00:00:00") < this.today();
    },

    getStatus(loan) {
      if (loan.returned) return "Returned";
      return this.isOverdue(loan) ? "Overdue" : "On loan";
    },

    summary(loans) {
      return { total: loans.length, overdue: loans.filter(l => this.isOverdue(l)).length };
    },

    escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, c =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },

    save(loans) { localStorage.setItem(KEY, JSON.stringify(loans)); },
    load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; }
      catch { return []; }
    }
  };

  global.LendLib = LendLib;
})(window);