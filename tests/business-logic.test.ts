import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateTrend } from '@/lib/utils';
import {
  amountToCents,
  groupAmountsByDonor,
  sumAmounts,
} from '@/lib/reporting';
import {
  donationFormSchema,
  normalizeDonationInput,
  normalizeDonorInput,
} from '@/lib/validation';

test('amount aggregation uses cents and avoids floating point drift', () => {
  assert.equal(amountToCents('10.005'), 1001);
  assert.equal(sumAmounts(['0.10', '0.20', '0.30']), 0.6);
});

test('report rows are grouped by donor and sorted for a stable PDF', () => {
  assert.deepEqual(
    groupAmountsByDonor([
      { donorName: 'Zoe', amount: '5.10' },
      { donorName: 'Alex', amount: 2 },
      { donorName: 'Zoe', amount: '0.90' },
    ]),
    [
      { donorName: 'Alex', amount: 2 },
      { donorName: 'Zoe', amount: 6 },
    ],
  );
});

test('donation validation rejects zero, malformed dates, and unknown types', () => {
  assert.equal(
    donationFormSchema.safeParse({
      dateReceived: '2024-02-30',
      amount: 0,
      donationType: 'tithes',
    }).success,
    false,
  );
  assert.equal(
    donationFormSchema.safeParse({
      dateReceived: '2024-02-29',
      amount: 12,
      donationType: 'not-a-type',
    }).success,
    false,
  );
});

test('server normalization trims donor fields and formats donation cents', () => {
  assert.deepEqual(
    normalizeDonorInput({
      name: '  Alex Smith  ',
      email: '',
      phoneNumber: ' 555-0100 ',
      address: '',
      notes: '',
    }),
    {
      name: 'Alex Smith',
      email: null,
      phoneNumber: '555-0100',
      address: null,
      notes: null,
    },
  );
  assert.equal(
    normalizeDonationInput({
      dateReceived: '2024-01-01',
      amount: 10.009,
      donationType: 'other',
    }).amount,
    '10.01',
  );
});

test('trend calculation handles a first year without a divide-by-zero result', () => {
  assert.deepEqual(calculateTrend(100, 0), { output: 'New', isPositive: true });
  assert.deepEqual(calculateTrend(0, 0), {
    output: '0.00%',
    isPositive: false,
  });
  assert.deepEqual(calculateTrend(120, 100), {
    output: '20.00%',
    isPositive: true,
  });
});
