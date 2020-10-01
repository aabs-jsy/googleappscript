var backendServerUrl = "www.google.com";
var memberIdColumnNumber = 1;
var memberNameColumn = 2;
var emailColumn = 3;
var phoneColumn = 4;
var eventStartingColumn = 5;

function generatePaymentLinks(event)
{
  // validate data
  // validate event
  
  var newValue = event.value;
  var columnStart = event.range.columnStart;
  var columnEnd = event.range.columnEnd;
  var rowStart = event.range.rowStart;
  var rowEnd = event.range.rowEnd;
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var s=ss.getActiveSheet();
  var c=s.getLastColumn();
  
 //  SpreadsheetApp.getActive().toast(c + "Script"+columnStart+" activated." + columnEnd);
 
  console.log(event)
  if(rowStart == rowEnd && rowEnd == 1 && columnStart == columnEnd && columnEnd == c) // == 1 && columnStart == columnEnd == c
  {
    s.getRange(2,c,s.getLastRow()-1,1).setValue(backendServerUrl);
    /*
    var linksRange=[];
    var data = s.getRange(2,c,s.getLastRow()-1,c).getValues();
    data.forEach((row,index)=>
    {
      var memberId = row[memberIdColumnNumber - 1];
      var exMemberId = event.value;
    
      linksRange.push([backendServerUrl+"?ex="+exMemberId+"mid="+memberId]);
    });
  */
    
  }
  
}

function onEdit(e)
{
  var sheet = new Sheet(e);

  // TODO:
  // ValidateEventToGeneratePaymentLinks
  // GeneratePaymentLinks

  /* lets check for event validation to generate payment links */
  var ii = sheet.ValidateEventToGeneratePaymentLinks();
  //Toast(ii);

  //var oldValue = e.oldValue;
  //generatePaymentLinks(e);
   
   //SpreadsheetApp.getActive().toast(oldValue + "Script2 activated.");
}

