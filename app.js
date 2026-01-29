const els = {
  status: document.getElementById('status'),
  clock: document.getElementById('clock'),
  xauUsd: document.getElementById('xauUsd'),
  xauSgd: document.getElementById('xauSgd'),
  xauMmk: document.getElementById('xauMmk'),
  lastUpdated: document.getElementById('lastUpdated'),
  rateInput: document.getElementById('rateInput'),
  rateHint: document.getElementById('rateHint'),
  logBody: document.getElementById('logBody'),
  refreshBtn: document.getElementById('refreshBtn'),
  ratioLine: document.getElementById('ratioLine'),
};

let xauUsd = null;
let sgdPerUsdRate = null;

const TROY_OZ_GRAMS = 31.1035;
const KYAT_THA_GRAMS = 16.606;

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return '--';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function parseRate(input) {
  const num = Number(String(input).trim());
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

function troyOzToKyatTha(oz) {
  if (!Number.isFinite(oz)) return null;
  return (oz * TROY_OZ_GRAMS) / KYAT_THA_GRAMS;
}

function computeMmkPerKyatTha(usdPerOz, rate) {
  if (!Number.isFinite(usdPerOz) || !Number.isFinite(rate)) return null;
  const mmkPerOz = usdPerOz * rate;
  const kyatThaPerOz = troyOzToKyatTha(1);
  return mmkPerOz / kyatThaPerOz;
}

function sgdPerUsd(usdPerSgd) {
  if (!Number.isFinite(usdPerSgd) || usdPerSgd <= 0) return null;
  return 1 / usdPerSgd;
}

function computeXauSgd(usdPerOz, sgdPerUsdValue) {
  if (!Number.isFinite(usdPerOz) || !Number.isFinite(sgdPerUsdValue)) return null;
  return usdPerOz * sgdPerUsdValue;
}

function logLine(message) {
  if (!els.logBody) return;
  const time = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.textContent = `[${time}] ${message}`;
  els.logBody.prepend(line);
}

function setStatus(text) {
  els.status.textContent = `STATUS: ${text}`;
}

function updateClock() {
  els.clock.textContent = new Date().toLocaleTimeString();
}

function updateConversion() {
  const rate = parseRate(els.rateInput.value);
  if (!rate || !xauUsd) {
    els.xauMmk.textContent = '--';
    els.rateInput.classList.toggle('invalid', !rate);
    els.rateHint.style.display = rate ? 'none' : 'block';
    return;
  }
  const mmkPerKyatTha = computeMmkPerKyatTha(xauUsd, rate);
  els.xauMmk.textContent = `${formatNumber(mmkPerKyatTha, 0)} MMK`;
  els.rateInput.classList.remove('invalid');
  els.rateHint.style.display = 'none';
}

function updateSgdDisplay() {
  if (!els.xauSgd) return;
  if (!xauUsd || !sgdPerUsdRate) {
    els.xauSgd.textContent = 'XAU/SGD: --';
    return;
  }
  const xauSgd = computeXauSgd(xauUsd, sgdPerUsdRate);
  els.xauSgd.textContent = `XAU/SGD: ${formatNumber(xauSgd, 2)} SGD`;
}

async function fetchXau() {
  setStatus('FETCHING');
  logLine('Fetching XAU price...');
  try {
    const res = await fetch('https://api.gold-api.com/price/XAU');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || !Number.isFinite(data.price)) throw new Error('Invalid response');
    xauUsd = data.price;
    els.xauUsd.textContent = formatNumber(xauUsd, 2);
    els.lastUpdated.textContent = `Last update: ${new Date().toLocaleString()}`;
    setStatus('OK');
    logLine(`XAU updated: ${formatNumber(xauUsd, 2)} USD/oz`);
    updateConversion();
    updateSgdDisplay();
  } catch (err) {
    setStatus('ERROR');
    logLine(`API error: ${err.message}`);
  }
}

async function fetchSgdRate() {
  logLine('Fetching SGD rate...');
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/SGD');
    if (!res.ok) throw new Error(`FX HTTP ${res.status}`);
    const data = await res.json();
    const usdPerSgd = data?.rates?.USD;
    const rate = sgdPerUsd(usdPerSgd);
    if (!rate) throw new Error('Invalid FX response');
    sgdPerUsdRate = rate;
    updateSgdDisplay();
    logLine(`FX updated: 1 USD = ${formatNumber(sgdPerUsdRate, 4)} SGD`);
  } catch (err) {
    sgdPerUsdRate = null;
    updateSgdDisplay();
    logLine(`FX error: ${err.message}`);
  }
}

function updateRatioLine() {
  const kyatThaPerOz = troyOzToKyatTha(1);
  const ratio = formatNumber(kyatThaPerOz, 3);
  if (els.ratioLine) {
    els.ratioLine.textContent = `1 troy oz = ${ratio} kyat-tha (${TROY_OZ_GRAMS}g / ${KYAT_THA_GRAMS}g)`;
  }
}

els.rateInput.addEventListener('input', updateConversion);
els.refreshBtn.addEventListener('click', fetchXau);

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') fetchXau();
});

setInterval(updateClock, 1000);
updateClock();
updateRatioLine();
fetchXau();
fetchSgdRate();
