console.log("Popup script loaded.");

// --- DOM Elements ---
const views = {
  waiting: document.getElementById("waiting-view"),
  processing: document.getElementById("processing-view"),
  result: document.getElementById("result-view"),
};
const resetBtn = document.getElementById("resetBtn");
const reportBtn = document.getElementById("reportBtn");
const closeBtn = document.getElementById("closeBtn");

// Result fields
const resultStatus = document.getElementById("result-status");
const resultConfidence = document.getElementById("result-confidence");
const resultMatchingVideo = document.getElementById("result-matching-video");
const resultMatchingScore = document.getElementById("result-matching-score");
const timestampsList = document.getElementById("timestamps-list");
const resultHash = document.getElementById("result-hash");
const sourceInfo = document.getElementById("source-info");

// --- Initial State & Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  showView("waiting");
  browser.runtime.sendMessage({ type: "POPUP_READY" });
});
closeBtn.addEventListener("click", () => window.close());
resetBtn.addEventListener("click", () => {
  showView("waiting");
  browser.runtime.sendMessage({ type: "RESET_LISTENER" });
});

// --- Message Handling ---
browser.runtime.onMessage.addListener((message) => {
  console.log("Popup received message:", message);
  switch (message.type) {
    case "PROCESSING_STARTED":
      showView("processing");
      break;
    case "API_SUCCESS":
      populateResults(message.data);
      showView("result");
      break;
    case "API_ERROR":
      populateErrorResults();
      showView("result");
      break;
  }
});

// --- UI Update Functions ---

function showView(viewName) {
  for (const key in views) views[key].classList.remove("active");
  views[viewName].classList.add("active");

  // FIX: Use explicit add/remove for clarity and robustness
  if (viewName === "result") {
    resetBtn.classList.remove("hidden");
    reportBtn.classList.remove("hidden");
  } else {
    resetBtn.classList.add("hidden");
    reportBtn.classList.add("hidden");
  }
}

function populateResults(data) {
  resultStatus.textContent = data.a;
  resultStatus.className = data.a.toLowerCase();
  resultHash.textContent = data.b.id;

  if (data.b.source.includes("Cached")) {
    sourceInfo.textContent = "This result was found in our existing database.";
  } else {
    sourceInfo.textContent = "This video was analyzed for the first time.";
  }

  resultConfidence.textContent = data.c;
  resultMatchingVideo.textContent = data.d;
  resultMatchingVideo.href = data.d;
  resultMatchingScore.textContent = data.e;
  reportBtn.href = data.f;

  timestampsList.innerHTML = "";
  if (data.g && data.g.length > 0) {
    const header = document.createElement("li");
    header.className = "timestamp-header";
    header.innerHTML = `<span class="timestamp-col">Start</span><span class="timestamp-col">End</span>`;
    timestampsList.appendChild(header);

    data.g.forEach((ts) => {
      const item = document.createElement("li");
      item.className = "timestamp-item";
      item.innerHTML = `<span class="timestamp-col">${ts[0]}s</span><span class="timestamp-col">${ts[1]}s</span>`;
      timestampsList.appendChild(item);
    });
  } else {
    timestampsList.innerHTML = `<li class="timestamp-item">No specific segments found.</li>`;
  }
}

function populateErrorResults() {
  const errorData = {
    a: "Error",
    b: { id: "N/A", source: "Unknown" },
    c: "0%",
    d: "#",
    e: "0%",
    f: "#",
    g: [],
  };
  populateResults(errorData);
  resultStatus.className = "error";
  resultMatchingVideo.textContent = "N/A";
  sourceInfo.textContent = "An error occurred during analysis.";
}
