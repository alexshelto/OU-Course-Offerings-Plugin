// content.js
// var instructorStore = {

// };

// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}

//logic here
function scrapeProfessors() {
  let uniqueInstructors = 0;
  var instructorStore = {};
  $('.sectionDetail').each(function () {
    if($(this).find("td").length > 0) {
      let instructorName = $(this).find("td")[6].innerText.trim(); //grabbing professors name

      //adding the instructor to the dictionary if not currently in
      if(!(instructorName in instructorStore)) {
        uniqueInstructors += 1;
        instructorStore[instructorName] = 420;
      }
    }
  })

  //store of names
  console.log(instructorStore);
  console.log(`Unique Instructors: ${uniqueInstructors}`);
}


// function getRateMyProfessorScore(name) {

// }

//First 3 listings selectors
// #courseATHN1000 > tbody > tr:nth-child(2) > td.columnTitle
// #courseATHN2000 > tbody > tr:nth-child(2) > td.columnTitle
// #courseATHN3000 > tbody > tr:nth-child(2) > td.columnValue

function handleMessage(message, sender, sendResponse) {
  console.log(`Recieved the message: ${message.action}`);
  switch(message.action) {
    case "getNumOfTables":
      scrapeProfessors(); //scrapes all instructor names from course offerings into key value pair
      sendResponse($(document).find("td:contains('Instructors:)").length);

    default:
      console.error("Unknown request from extension");
  }
}