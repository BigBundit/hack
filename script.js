const prankPanel = document.getElementById("prankPanel");
const blankPanel = document.getElementById("blankPanel");
const terminal = document.getElementById("terminal");
const progressFill = document.getElementById("progressFill");
const percentLabel = document.getElementById("percentLabel");
const phaseLabel = document.getElementById("phaseLabel");
const clock = document.getElementById("clock");
const ticker = document.getElementById("ticker");
const cpuMetric = document.getElementById("cpuMetric");
const packetMetric = document.getElementById("packetMetric");
const keyMetric = document.getElementById("keyMetric");
const popupLayer = document.getElementById("popupLayer");
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const phases = [
  "Opening socket tunnel",
  "Enumerating browser fingerprints",
  "Injecting fake payload",
  "Bypassing imaginary firewall",
  "Syncing visual noise",
  "Cleaning prank traces"
];

const logLines = [
  "[sys] handshake accepted from 10.0.0.{n}",
  "[scan] probing port {port}/tcp ... open",
  "[auth] token fragment {hex}-{hex} captured",
  "[trace] route hop {n}: latency {ms}ms",
  "[core] unpacking module prank_payload_{n}.bin",
  "[warn] screen control permission escalated",
  "[db] reading cache bucket /local/session/{hex}",
  "[net] packet burst detected: {bytes}kb",
  "[exec] running: ./totally_not_real --mode=chaos",
  "[ui] rendering panic layer #{n}",
  "[ok] fake subsystem {n} synchronized"
];

const popupTitles = [
  "Credential Sweep",
  "Packet Injector",
  "Kernel Monitor",
  "Proxy Breach",
  "Vault Scanner",
  "Session Mirror",
  "Payload Builder",
  "Port Flood"
];

const popupMessages = [
  "mount /cache/session_{hex}\nread blocks: {bytes}kb\nstatus: unstable",
  "route hop {n} accepted\nlatency spike: {ms}ms\nqueue: overflow",
  "decrypt shard {hex}-{hex}\nthread pool: saturated\nmode: aggressive",
  "port {port}/tcp exposed\nbinding remote shell\ntrace depth: {n}",
  "copy sector /tmp/{hex}\nhash mismatch detected\nretry loop active"
];

let matrixColumns = [];
let timers = [];
let progress = 0;
let popupId = 0;

function fitCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const columns = Math.ceil(window.innerWidth / 16);
  matrixColumns = Array.from({ length: columns }, () => Math.random() * window.innerHeight);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(3, 8, 6, 0.14)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#46ff8f";
  ctx.font = "15px Consolas, monospace";

  matrixColumns.forEach((y, index) => {
    const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
    const x = index * 16;
    ctx.fillText(char, x, y);
    matrixColumns[index] = y > window.innerHeight + Math.random() * 800 ? 0 : y + 16;
  });

  requestAnimationFrame(drawMatrix);
}

function randomHex(size = 4) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function renderLine(template) {
  return template
    .replaceAll("{n}", String(Math.floor(Math.random() * 999)).padStart(3, "0"))
    .replaceAll("{port}", String(20 + Math.floor(Math.random() * 65000)))
    .replaceAll("{hex}", randomHex())
    .replaceAll("{ms}", String(5 + Math.floor(Math.random() * 190)))
    .replaceAll("{bytes}", String(64 + Math.floor(Math.random() * 9000)));
}

function addLog() {
  const line = renderLine(logLines[Math.floor(Math.random() * logLines.length)]);
  terminal.textContent += `${line}\n`;
  const rows = terminal.textContent.split("\n");
  if (rows.length > 34) {
    terminal.textContent = rows.slice(rows.length - 34).join("\n");
  }
}

function setClock() {
  clock.textContent = new Date().toLocaleTimeString("th-TH", { hour12: false });
}

function setMetrics() {
  cpuMetric.textContent = `${65 + Math.floor(Math.random() * 35)}%`;
  packetMetric.textContent = String(12000 + Math.floor(Math.random() * 88000));
  keyMetric.textContent = String(Math.floor(progress * 7.2));
}

function spawnPopup() {
  const activePopups = popupLayer.querySelectorAll(".hack-popup");
  if (activePopups.length > 11) {
    activePopups[0].remove();
  }

  const popup = document.createElement("div");
  const tone = ["", "hot", "warn"][Math.floor(Math.random() * 3)];
  const width = Math.min(360, Math.max(280, window.innerWidth - 24));
  const left = Math.max(8, Math.random() * (window.innerWidth - width - 16));
  const topLimit = Math.max(120, window.innerHeight - 190);
  const top = Math.max(70, Math.random() * topLimit);
  const localId = ++popupId;
  let localProgress = 5 + Math.random() * 24;

  popup.className = `hack-popup ${tone}`.trim();
  popup.style.setProperty("--left", `${left}px`);
  popup.style.setProperty("--top", `${top}px`);
  popup.style.setProperty("--popup-progress", `${localProgress}%`);
  popup.innerHTML = `
    <div class="popup-titlebar">
      <span>${popupTitles[Math.floor(Math.random() * popupTitles.length)]}</span>
      <span>#${String(localId).padStart(3, "0")}</span>
    </div>
    <div class="popup-body">
      <pre class="popup-code">${renderLine(popupMessages[Math.floor(Math.random() * popupMessages.length)])}</pre>
      <div class="popup-progress-label">
        <span>transfer buffer</span>
        <span class="popup-percent">${Math.floor(localProgress)}%</span>
      </div>
      <div class="popup-progress">
        <div class="popup-progress-fill"></div>
      </div>
    </div>
  `;

  popupLayer.appendChild(popup);

  const popupTimer = setInterval(() => {
    if (!popup.isConnected) {
      clearInterval(popupTimer);
      return;
    }
    localProgress = Math.min(100, localProgress + 7 + Math.random() * 18);
    popup.style.setProperty("--popup-progress", `${localProgress}%`);
    popup.querySelector(".popup-percent").textContent = `${Math.floor(localProgress)}%`;
    if (localProgress >= 100) {
      clearInterval(popupTimer);
      setTimeout(() => popup.remove(), 260 + Math.random() * 360);
    }
  }, 180 + Math.random() * 170);
}

function updateProgress() {
  progress = Math.min(100, progress + Math.random() * 4.8 + 0.8);
  progressFill.style.width = `${progress}%`;
  percentLabel.textContent = `${Math.floor(progress)}%`;
  phaseLabel.textContent = phases[Math.min(phases.length - 1, Math.floor(progress / (100 / phases.length)))];
  if (progress >= 100) {
    finishPrank();
  }
}

async function requestFullscreen() {
  const root = document.documentElement;
  if (root.requestFullscreen) {
    try {
      await root.requestFullscreen({ navigationUI: "hide" });
    } catch {
      // Some browsers reject fullscreen even after a click; the prank still runs normally.
    }
  }
}

function startPrank() {
  requestFullscreen();
  prankPanel.classList.remove("is-hidden");
  ticker.textContent = " ALERT: UNUSUAL ACTIVITY DETECTED • COPYING ABSOLUTELY NOTHING • THIS IS A PRANK SEQUENCE • ";
  terminal.textContent = "";
  popupLayer.innerHTML = "";
  progress = 0;
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnPopup, i * 120);
  }

  timers = [
    setInterval(addLog, 90),
    setInterval(updateProgress, 280),
    setInterval(setClock, 500),
    setInterval(setMetrics, 210),
    setInterval(spawnPopup, 330)
  ];
}

function finishPrank() {
  timers.forEach(clearInterval);
  timers = [];
  popupLayer.innerHTML = "";
  prankPanel.classList.add("is-hidden");
  blankPanel.classList.remove("is-hidden");
  window.close();
}

window.addEventListener("resize", fitCanvas);
window.addEventListener("load", startPrank);

fitCanvas();
drawMatrix();
setClock();
