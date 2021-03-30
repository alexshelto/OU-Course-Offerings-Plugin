const fs = require('fs');
var obj = JSON.parse(fs.readFileSync('file', 'utf8'));



// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}

const even = '.classSpecRowEven';
const odd  = '.classSpecRowOdd';




async function getInstrcutorScore(name) {
  let score = 'N/A'

  let initialResponse = await fetch(`${URL}api/${name}`);
  let data = await initialResponse.json();
  if(data.data.length > 0){
    score = data.data[0]['score'];
  }
  console.log(`return score: ${score}`);
  return score;
}



//logic here
const scrapeProfessors = () => {
  let store = JSON.parse(fs.readFileSync('scores.json', 'utf8'));

  let odd = true;
  let rowOdd = true; //weird css that has even and odd rows
  let n = 1;

  $('.sectionHeaderTitleRow').append("<th class='score'>Score</th>");
  //adding rate my professor row


  //looping over each section detail to get professor name
  $('.sectionDetail').each(function () {

    //if there is a row with data
    if($(this).find("td").length > 0) {
      let instructorName = $(this).find("td")[6].innerText.trim(); //grabbing professors name. weird formatting like:          prof  name         
      instructorName  = instructorName.split(' ').join(''); // sting before: John Smith, after: JohnSmith

      let score = store[instructorName] == undefined? "N/A" : store[instructorName];

      console.log(`name: ${instructorName}, score: ${score}`);

      rowOdd = !rowOdd; //changing value
    }//endif
  });
  //console.log(`${instructorName}: ${score}`);
}




function handleMessage(message, sender, sendResponse){
  console.log(`Recieved the message: ${message.action}`);

  if(message.action == "inject-professors"){
    scrapeProfessors();
    sendResponse($(document).find("td:contains('Instructors:)").length);
  }
  else {
    console.error("Unknown request from extension");
  }
}
