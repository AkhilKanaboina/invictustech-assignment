# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:**
In `src/components/ExpenseList.jsx`, modified the sort function from `dateValue(a.date) - dateValue(b.date)` to `dateValue(b.date) - dateValue(a.date)` so that expenses are sorted by date in descending order.
Additionally, in `src/lib/format.js`, fixed `dateValue()` to return a number (`new Date(date).getTime()`) instead of the raw date string, because string subtraction resulted in `NaN` which broke the sorting logic.
---

## Bug 2

**How to reproduce:** In the "Filters" section, change the "Paid by" dropdown from "Anyone" to a specific person (e.g., "Aisha Khan").

**What is wrong:** The expense list becomes completely empty, even if that person has paid for expenses. This happens because the `paidBy` value from the dropdown is a string, while the `e.paidBy` property on the expense objects is a number. The strict equality check (`e.paidBy !== paidBy`) was therefore failing and filtering out all expenses.

**What I changed:**
In `src/App.jsx` line 36, I modified the filter logic to cast the expense `paidBy` value to a string before comparing: `if (paidBy !== "" && String(e.paidBy) !== paidBy) return false;`.

---

## Bug 3

**How to reproduce:** Add an expense where one person pays, but splits it with a group of people that *excludes* the payer. The balances will be incorrect.

**What is wrong:** The app incorrectly decreases the payer's balance when they are not included in the split. This results in the payer losing money rather than just gaining a credit for the amount they paid for others.

**What I changed:**
In `src/lib/balances.js`, I removed the `if (!(exp.paidBy in shares) && !(String(exp.paidBy) in shares))` block that incorrectly deducted `exp.amount / n` from the payer's balance when they weren't part of the split.
