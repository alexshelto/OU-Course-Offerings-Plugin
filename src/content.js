


// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}

const URL = "http://127.0.0.1:5000/"





async function getInstrcutorScore(name) {
  let score = 'N/A'
  console.log(`Inside getInstructorScore: ${name}`);
  let initialResponse = await fetch(`${URL}api/${name}`);
  let data = await initialResponse.json();
  if(data.data.length > 0){
    score = data.data[0]['score'];
  }
  console.log(`return score: ${score}`);
  return score;
}




// function injectScore(elements, value) {
//   var td = document.createElement('h1');
//   elements.append(td);
//   td.innerText = value;
// }





//logic here
function scrapeProfessors() {
  let store = {};
  let n = 0;

  let uniqueInstructors = 0;
  $('.sectionDetail').each(function () {
    if($(this).find("td").length > 0) {
      let instructorName = $(this).find("td")[6].innerText.trim(); //grabbing professors name. weird formatting like:          prof  name         
      instructorName  = instructorName.split(' ').join(''); // sting before: John Smith, after: JohnSmith
      console.log(`Prof #${n}, name:${instructorName}`);

      getInstrcutorScore(instructorName).
      then((score) => {
        store[instructorName] = score;
        console.log(score);
      }).catch(err => console.log(err));
      n += 1;

    }//endif
});
  console.log(`Unique Instructors: ${uniqueInstructors}`);
  console.log(store);
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