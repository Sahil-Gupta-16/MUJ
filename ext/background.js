console.log("Background script loaded.");

let popupWindowId = null;
const POPUP_URL = browser.extension.getURL("popup.html");

// --- Main Function: Open/Focus the Popup ---
browser.browserAction.onClicked.addListener(() => {
  if (popupWindowId !== null) {
    browser.windows.get(popupWindowId).then(
      (windowInfo) => {
        if (windowInfo) {
          browser.windows.update(popupWindowId, { focused: true });
        } else {
          createPopup();
        }
      },
      () => createPopup()
    );
  } else {
    createPopup();
  }
});

function createPopup() {
  browser.windows
    .create({
      url: POPUP_URL,
      type: "panel",
      width: 400,
      height: 580, // Adjusted height for the polished UI
    })
    .then((windowInfo) => {
      popupWindowId = windowInfo.id;
    });
}

// --- Communication Handling ---
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "POPUP_READY" || message.type === "RESET_LISTENER") {
    activateLinkListeners();
  } else if (message.type === "LINK_CLICKED") {
    deactivateLinkListeners();
    processLink(message.url);
  }
});

// --- Link Processing Logic ---

async function processLink(url) {
  console.log(`Processing link: ${url}`);
  // Immediately tell the popup we're processing
  browser.runtime.sendMessage({ type: "PROCESSING_STARTED" });

  // --- DEMO LOGIC (Currently Active) ---
  // This block simulates a network delay and returns a fake successful response.
  // To use your real backend, comment out this entire "setTimeout" block.
  setTimeout(() => {
    const fakeData = {
      a: "FAKE",
      b: {
        id: "a1b2c3d4e5f67890",
        source: "Database (Cached)",
      },
      c: "98.7%",
      d: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      e: "99.2%",
      f: "https://example.com/detailed_report/a1b2c3d4",
      g: [
        ["10.5", "15.2"],
        ["45.1", "50.8"],
        ["82.0", "85.5"],
      ],
    };
    console.log("Sending fake success data to popup:", fakeData);
    browser.runtime.sendMessage({ type: "API_SUCCESS", data: fakeData });
  }, 2000); // Simulate a 2-second processing time

  /*
  // --- REAL BACKEND LOGIC (Currently Inactive) ---
  // To use this, comment out the "setTimeout" block above and uncomment this block.
  try {
    const response = await fetch("http://localhost:8000/process_link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Backend reply received:", data);
    // NOTE: Ensure your backend returns data in the same format as the fakeData object above.
    browser.runtime.sendMessage({ type: "API_SUCCESS", data: data });

  } catch (error) {
    console.error("Fetch failed:", error);
    browser.runtime.sendMessage({ type: "API_ERROR", error: error.message });
  }
  */
}

// --- Helper Functions ---

async function activateLinkListeners() {
  console.log("Activating link listeners in all tabs.");
  // Query for all tabs that are loaded and ready
  const tabs = await browser.tabs.query({ status: "complete" });
  for (const tab of tabs) {
    try {
      // Send a message to the content script in each tab to start listening for clicks
      browser.tabs.sendMessage(tab.id, { type: "ACTIVATE_LISTENER" });
    } catch (err) {
      // This might fail on special browser pages (like about:debugging), which is fine.
      console.warn(`Could not send message to tab ${tab.id}: ${err.message}.`);
    }
  }
}

async function deactivateLinkListeners() {
  console.log("Deactivating link listeners in all tabs.");
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    try {
      // Send a message to the content script in each tab to stop listening for clicks
      browser.tabs.sendMessage(tab.id, { type: "DEACTIVATE_LISTENER" });
    } catch (err) {
      // Ignore errors, as the content script might not be on this page.
    }
  }
}

// Clean up when the popup is closed by the user
browser.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    console.log("Popup window closed.");
    popupWindowId = null;
    // Ensure listeners are turned off when the popup is closed
    deactivateLinkListeners();
  }
});
