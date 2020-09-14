


// Ensure it's injected only once
var injected;
if(!injected) {
  injected = true;
  chrome.runtime.onMessage.addListener(handleMessage);
}

const URL  = "http://127.0.0.1:5000/";
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
  let store = {};
  let odd = true;
  let rowOdd = true; //weird css that has even and odd rows

  console.log($(this).find('sectionHeaderTitleRow').length);
  //adding rate my professor row
  $('.sectionHeaderTitleRow').append("<th>Score</th>");
  $(odd).append('<td>420</td>');



  $('.sectionDetail').each(function () {

    //of there is a row with data
    if($(this).find("td").length > 0) {
      let instructorName = $(this).find("td")[6].innerText.trim(); //grabbing professors name. weird formatting like:          prof  name         
      instructorName  = instructorName.split(' ').join(''); // sting before: John Smith, after: JohnSmith


      getInstrcutorScore(instructorName).
      then((score) => {
        store[instructorName] = score;
        console.log(score);

        if(rowOdd){ $(odd).find('td')[13].innerText = score; }
        else      { $(even).find('td')[13].innerText = score; }
        

      }).catch(err => console.log(err));

      rowOdd = !rowOdd; //changing value
    }//endif
});
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