// content.js


// https://www.ratemyprofessors.com/filter/professor/?&page=1&queryoption=TEACHER&query=Juanita+Hall&sid=727
// https://www.ratemyprofessors.com/filter/professor/?&page=1&queryoption=TEACHER&query=David+Juedes

var rate_my_prof_url = 'https://www.ratemyprofessors.com/filter/professor/?&page=1&queryoption=TEACHER&query=';
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';



// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}




function getInstrcutorScore(name, callback) {
  var score;
  fetch(`${proxyUrl}${rate_my_prof_url}${name.split(' ').join('+')}&sid=727`) //727 is school id code for ohio university
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log(`Error: ${response.status}`);
          return;
        }
        //Examine response
        response.json().then(function(data) {
          //data.professors returns an array with details on each prof. professor[1] is our desired prof

          if(data.professors.length == 0) callback(-1); //clean up
          // if(data.professors.length > 1) score = -1
          else {
            console.log(data.professors[0]['overall_rating']);
            callback(data.professors[0]['overall_rating']);
          }
        });
      }
    ).catch(function(err) {
      console.log(`Error: ${err}`);
      callback(-1); //clean  
    });

    callback(score);
}



//logic here
function scrapeProfessors() {
  let uniqueInstructors = 0;
  let instructorStore = {};
  $('.sectionDetail').each(function () {
    if($(this).find("td").length > 0) {
      let instructorName = $(this).find("td")[6].innerText.trim(); //grabbing professors name. weird formatting like:          prof  name         
      
      //adding the instructor to the dictionary if not currently in
      if(!(instructorName in instructorStore)) {
        let score = getInstrcutorScore(instructorName, (score) => {
          instructorStore[instructorName] = score;
        });
        uniqueInstructors += 1; //iterating unique instructors 
      }
    }
  });
  //store of names
  console.log(instructorStore);
  console.log(`Unique Instructors: ${uniqueInstructors}`);
}





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