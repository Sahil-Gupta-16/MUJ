console.log("Content script loaded.");

let isCapturing = false;

// Listen for activation/deactivation messages from background.js
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "ACTIVATE_LISTENER") {
    console.log("Listener activated.");
    isCapturing = true;
  } else if (message.type === "DEACTIVATE_LISTENER") {
    console.log("Listener deactivated.");
    isCapturing = false;
  }
});

// Global click listener using the capture phase to catch the event early
document.addEventListener(
  "click",
  (event) => {
    if (!isCapturing) {
      return;
    }

    // --- MODIFICATION START ---
    let capturedUrl = null;
    const link = event.target.closest("a");

    if (link && link.href) {
      // Case 1: A real link was clicked. Use its href.
      capturedUrl = link.href;
      console.log(`Explicit link clicked and captured: ${capturedUrl}`);
    } else {
      // Case 2: Anything else was clicked. Fallback to the page's URL.
      capturedUrl = window.location.href;
      console.log(`No explicit link found. Capturing page URL: ${capturedUrl}`);
    }
    // --- MODIFICATION END ---

    // Stop the browser from doing anything with the click
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Send the captured URL (either the link's or the page's) to the background script
    browser.runtime.sendMessage({ type: "LINK_CLICKED", url: capturedUrl });

    // Deactivate itself to prevent capturing more links
    isCapturing = false;
    console.log("Listener self-deactivated after capture.");
  },
  true
); // Use capture phase
