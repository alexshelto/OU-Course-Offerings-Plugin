// popup.js
chrome.tabs.executeScript(
  null,                      // Current tab
  {file: "jquery.js"},        // Script to inject
  function() {               // Something to do afterwards
    chrome.tabs.executeScript(null, {file: "content.js"}, afterInject);
  }
);


// Make sure it happens after the inject
function afterInject(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getNumOfTables"}, function(result) {
      console.log(result);
      // Use the result here
    });
  });
}