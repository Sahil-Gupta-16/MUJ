console.log("Popup script loaded.");

// --- DOM Elements ---
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");
const closeBtn = document.getElementById("closeBtn");

// --- Initial State ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM ready. Sending POPUP_READY message.");
  // Tell the background script to activate the content script listeners
  browser.runtime.sendMessage({ type: "POPUP_READY" });
});

// --- Event Listeners ---
closeBtn.addEventListener("click", () => {
  console.log("Close button clicked.");
  window.close();
});

resetBtn.addEventListener("click", () => {
  console.log("Reset button clicked.");
  showInitialState();
  // Tell the background script to re-activate listeners
  browser.runtime.sendMessage({ type: "RESET_LISTENER" });
});

// --- Message Handling from background.js ---
browser.runtime.onMessage.addListener((message) => {
  console.log("Popup received message:", message);
  switch (message.type) {
    case "API_SUCCESS":
      showResultState(message.data);
      break;
    case "API_ERROR":
      showErrorState(message.error);
      break;
  }
});

// --- UI Update Functions ---
function showInitialState() {
  statusEl.textContent = "Click on a link on any page.";
  resultEl.classList.add("hidden");
  resetBtn.classList.add("hidden");
}

function showResultState(data) {
  statusEl.textContent = "Server Response:";
  resultEl.textContent = JSON.stringify(data, null, 2); // Prettify JSON
  resultEl.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
}

function showErrorState(error) {
  statusEl.textContent = "Error:";
  resultEl.textContent = "Server unavailable or network error.";
  resultEl.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
}
