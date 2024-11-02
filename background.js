console.log("have full access to the silliest of cats pics!");

// in this function we send the message to the content script and wait for the response
// then we open the image in a new tab or download it based on which button was clicked
function performAction(tab, option) {
  if (tab.url.includes("instagram.com")) {
    chrome.tabs.sendMessage(tab.id, { action: "getImageSource" }, (response) => {
        //opens the image in a new tab
    if (response && response.imageSource && option === 1) {
        chrome.tabs.create({ url: response.imageSource });
      } else if (response && response.imageSource && option === 2) {
        //downloads the image
          const toDownload = response.imageSource;
          chrome.downloads.download({ url: toDownload });
      }
      else {
        window.alert("No image found or invalid response");
      }
    });
  }
}
// this calls the performAction function if the Open button is clicked
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "performOpen") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          performAction(tabs[0],1);
        }
      });
    }
  });
// this calls the performAction function if the Download button is clicked
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "performDownload") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            performAction(tabs[0],2);
        }
      });
    }
  });

// this calls the performAction function if the Open image shortcut keys are pressed
chrome.commands.onCommand.addListener((command) => {
  if (command === "open_image") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            performAction(tabs[0],1);
        }
    });
  }
});

// this calls the performAction function if the Download image shortcut keys are pressed
chrome.commands.onCommand.addListener((command) => {
    if (command === "download_image") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            performAction(tabs[0],2);
          }
      });
    }
  });
