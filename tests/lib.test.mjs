import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNumber,
  parseRate,
  computeMmk,
  computeMmkPerKyatTha,
  troyOzToKyatTha,
  sgdPerUsd,
  computeXauSgd,
  parseBinanceP2PPrice,
} from '../lib.mjs';

test('formatNumber adds thousands separators', () => {
  assert.equal(formatNumber(1234.56, 2), '1,234.56');
});

test('parseRate rejects empty or non-positive', () => {
  assert.equal(parseRate(''), null);
  assert.equal(parseRate('0'), null);
});

test('computeMmk multiplies USD by rate', () => {
  assert.equal(computeMmk(2000, 3500), 7000000);
});

test('troyOzToKyatTha converts ounces to kyat-tha', () => {
  assert.equal(troyOzToKyatTha(1).toFixed(3), '1.873');
});

test('computeMmkPerKyatTha converts to MMK per kyat-tha', () => {
  const mmkPerKyatTha = computeMmkPerKyatTha(2000, 3500);
  assert.equal(mmkPerKyatTha.toFixed(0), '3737264');
});

test('sgdPerUsd converts usd per sgd to sgd per usd', () => {
  assert.equal(sgdPerUsd(0.74).toFixed(6), '1.351351');
});

test('computeXauSgd converts XAU price to SGD', () => {
  const sgd = computeXauSgd(2000, 1.351351);
  assert.equal(sgd.toFixed(2), '2702.70');
});

test('parseBinanceP2PPrice reads the first adv price', () => {
  const payload = {
    data: [{ adv: { price: '3500.50' } }],
  };
  assert.equal(parseBinanceP2PPrice(payload), 3500.5);
});

test('parseBinanceP2PPrice returns null for missing data', () => {
  assert.equal(parseBinanceP2PPrice({ data: [] }), null);
  assert.equal(parseBinanceP2PPrice({}), null);
});
