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
          console.log("Popup already open, focusing it.");
        } else {
          createPopup();
        }
      },
      () => createPopup() // Window doesn't exist, create it
    );
  } else {
    createPopup();
  }
});

function createPopup() {
  console.log("Creating new popup window.");
  browser.windows
    .create({
      url: POPUP_URL,
      type: "panel",
      width: 400,
      height: 300,
    })
    .then((windowInfo) => {
      popupWindowId = windowInfo.id;
    });
}

// --- Communication Handling ---
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  switch (message.type) {
    // From popup.js: The popup is ready or reset, activate listeners
    case "POPUP_READY":
    case "RESET_LISTENER":
      activateLinkListeners();
      break;

    // From content.js: A link was clicked
    case "LINK_CLICKED":
      // Deactivate listeners to prevent multiple captures
      deactivateLinkListeners();
      // Process the link
      processLink(message.url);
      break;
  }
});

// --- Content Script and API Logic ---

async function activateLinkListeners() {
  console.log("Activating link listeners in all tabs.");
  const tabs = await browser.tabs.query({ status: "complete" });
  for (const tab of tabs) {
    try {
      // FIX: No longer need to inject the script. Just send the message.
      browser.tabs.sendMessage(tab.id, { type: "ACTIVATE_LISTENER" });
    } catch (err) {
      console.warn(
        `Could not send message to tab ${tab.id}: ${err.message}. It might be a privileged page.`
      );
    }
  }
}

async function deactivateLinkListeners() {
  console.log("Deactivating link listeners in all tabs.");
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    try {
      browser.tabs.sendMessage(tab.id, { type: "DEACTIVATE_LISTENER" });
    } catch (err) {
      // Ignore errors, script might not be injected or active on this tab
    }
  }
}

async function processLink(url) {
  console.log(`Sending link to backend: ${url}`);
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
    browser.runtime.sendMessage({ type: "API_SUCCESS", data: data });
  } catch (error) {
    console.error("Fetch failed:", error);
    browser.runtime.sendMessage({ type: "API_ERROR", error: error.message });
  }
}

// Clean up when the popup is closed by the user
browser.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    console.log("Popup window closed.");
    popupWindowId = null;
    deactivateLinkListeners();
  }
});
