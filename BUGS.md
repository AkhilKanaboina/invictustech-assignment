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

---

## Bug 4

**How to reproduce:** Add an expense of $100 and split it equally between 3 people. 

**What is wrong:** The shares calculated will be 33.33, 33.33, and 33.33, which sum to $99.99 instead of $100. This happens due to missing cents when dividing numbers that do not divide evenly (like $100 / 3). The missing $0.01 is lost in rounding.

**What I changed:**
In `src/lib/money.js`, I updated `splitEqual` and `splitByPercent` to calculate shares in cents. For remainders that do not divide equally, the extra cents are distributed one by one to the users so that the sum of the shares exactly equals the total amount.

---

## Bug 5

**How to reproduce:** Add an expense and look at the "Balances" section in the right sidebar. Notice the labels next to people's balances when they are positive or negative.

**What is wrong:** When someone's calculated balance is positive (meaning they paid more than their fair share and should be getting money back), the UI labels it as "owes". If their balance is negative (meaning they owe money), the UI says they are "is owed". The labels are swapped.

**What I changed:**
In `src/components/BalancesPanel.jsx`, I swapped the condition checks so `bal > 0.005` correctly displays "is owed" and `bal < -0.005` displays "owes".

---

## Bug 6

**How to reproduce:** In the UI, add multiple expenses, and then click "Delete" or change the amount on one of the expenses in the middle of the list.

**What is wrong:** The app deletes or updates the wrong expense! This happens because `ExpenseList.jsx` passes the array `index` of the filtered and sorted list, but the reducer in `store.js` assumes this `index` corresponds to the full, raw, unsorted array of expenses. 

**What I changed:**
I refactored `App.jsx`, `ExpenseList.jsx`, and `store.js` to target expenses by their unique `expense.id` rather than their array index.

---

## Bug 7

**How to reproduce:** Add an expense, then refresh the page.

**What is wrong:** When the app saves data to `localStorage` and loads it back (`loadState`), it simply runs `JSON.parse(raw)`. Because JSON doesn't support Date objects, they are retrieved as raw strings, corrupting the dates.

**What I changed:**
In `src/state/store.js`, I updated `loadState` to run `hydrate(JSON.parse(raw))` so the date strings are properly converted back into actual `Date` objects when loaded from local storage.
