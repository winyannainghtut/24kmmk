export function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '--';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function parseRate(input) {
  const num = Number(String(input).trim());
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

export function computeMmk(usd, rate) {
  if (!Number.isFinite(usd) || !Number.isFinite(rate)) return null;
  return usd * rate;
}

const TROY_OZ_GRAMS = 31.1035;
const KYAT_THA_GRAMS = 16.606;

export function troyOzToKyatTha(oz) {
  if (!Number.isFinite(oz)) return null;
  return (oz * TROY_OZ_GRAMS) / KYAT_THA_GRAMS;
}

export function computeMmkPerKyatTha(usdPerOz, rate) {
  if (!Number.isFinite(usdPerOz) || !Number.isFinite(rate)) return null;
  const mmkPerOz = usdPerOz * rate;
  const kyatThaPerOz = troyOzToKyatTha(1);
  return mmkPerOz / kyatThaPerOz;
}

export function sgdPerUsd(usdPerSgd) {
  if (!Number.isFinite(usdPerSgd) || usdPerSgd <= 0) return null;
  return 1 / usdPerSgd;
}

export function computeXauSgd(usdPerOz, sgdPerUsdValue) {
  if (!Number.isFinite(usdPerOz) || !Number.isFinite(sgdPerUsdValue)) return null;
  return usdPerOz * sgdPerUsdValue;
}

export function parseBinanceP2PPrice(payload) {
  const priceText = payload?.data?.[0]?.adv?.price;
  const price = Number(priceText);
  if (!Number.isFinite(price)) return null;
  return price;
}
