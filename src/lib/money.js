export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function splitEqual(amount, ids) {
  const n = ids.length || 1;
  const totalCents = Math.round(amount * 100);
  const baseCents = Math.floor(totalCents / n);
  let remainder = totalCents % n;

  const shares = {};
  for (const id of ids) {
    if (remainder > 0) {
      shares[id] = (baseCents + 1) / 100;
      remainder--;
    } else {
      shares[id] = baseCents / 100;
    }
  }
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  return values.reduce((a, b) => a + b, 0) === 100;
}

export function splitByPercent(amount, percents) {
  const totalCents = Math.round(amount * 100);
  const shares = {};
  let centsAllocated = 0;
  const entries = Object.entries(percents);
  
  for (let i = 0; i < entries.length; i++) {
    const [id, pct] = entries[i];
    if (i === entries.length - 1) {
      shares[id] = (totalCents - centsAllocated) / 100;
    } else {
      const shareCents = Math.round((totalCents * Number(pct)) / 100);
      shares[id] = shareCents / 100;
      centsAllocated += shareCents;
    }
  }
  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
