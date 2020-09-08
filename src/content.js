// content.js

// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}

function handleMessage(message, sender, sendResponse) {
  switch(message.action) {
    case "getNumOfTables":
      sendResponse($(document).find("table").length);
    default:
      console.error("Unknown request from extension");
  }
}