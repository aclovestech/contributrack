export type AmountLike = number | string;

/** Convert a decimal amount to integer cents for exact aggregation. */
export function amountToCents(amount: AmountLike) {
  const value = typeof amount === 'string' ? Number(amount) : amount;

  if (!Number.isFinite(value)) {
    throw new Error('Donation amount must be a finite number.');
  }

  return Math.round(value * 100);
}

export function centsToAmount(cents: number) {
  return cents / 100;
}

export function sumAmounts(amounts: readonly AmountLike[]) {
  return centsToAmount(
    amounts.reduce<number>((sum, amount) => sum + amountToCents(amount), 0),
  );
}

export type DonorAmount = { donorName: string; amount: AmountLike };

/**
 * Aggregate rows in the same shape as the report query. Keeping this pure
 * makes the rule easy to test and gives PDF/UI consumers one rounding policy.
 */
export function groupAmountsByDonor(rows: readonly DonorAmount[]) {
  const totals = new Map<string, number>();

  for (const row of rows) {
    totals.set(
      row.donorName,
      (totals.get(row.donorName) ?? 0) + amountToCents(row.amount),
    );
  }

  return Array.from(totals, ([donorName, cents]) => ({
    donorName,
    amount: centsToAmount(cents),
  })).sort((left, right) => left.donorName.localeCompare(right.donorName));
}
