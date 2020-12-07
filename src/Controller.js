var backendServerUrl = "www.google.com";
var memberIdColumnNumber = 1;
var memberNameColumn = 2;
var emailColumn = 3;
var phoneColumn = 4;
var eventStartingColumn = 5;

// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('My Menu')
      .addItem('My Menu Item', 'ActiveScript')
      .addToUi();
}

function generatePaymentLinks(event) {
  // validate data
  // validate event

  var newValue = event.value;
  var columnStart = event.range.columnStart;
  var columnEnd = event.range.columnEnd;
  var rowStart = event.range.rowStart;
  var rowEnd = event.range.rowEnd;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getActiveSheet();
  var c = s.getLastColumn();

  //  SpreadsheetApp.getActive().toast(c + "Script"+columnStart+" activated." + columnEnd);

  console.log(event)
  if (rowStart == rowEnd && rowEnd == 1 && columnStart == columnEnd && columnEnd == c) // == 1 && columnStart == columnEnd == c
  {
    s.getRange(2, c, s.getLastRow() - 1, 1).setValue(backendServerUrl);
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

function ActiveScript()
{
  // Display a modal dialog box with custom HtmlService content.
var htmlOutput = HtmlService
.createHtmlOutput('<p>A change of speed, a change of style...</p>')
.setWidth(250)
.setHeight(300);
SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'My add-on');
}

function onEdit(e) {
  try{
    var sheet = new MemberSheet(e);

    /* lets check for event validation before generate payment links */
    var isValidEvent = sheet.ValidateEventToGeneratePaymentLinks();

    if(!isValidEvent)
    {
      return;
    }

    sheet.GeneratePaymentLinks();


} catch (error) {
  Library.Alert(error.message);
}
  
  // TODO:
  // ValidateEventToGeneratePaymentLinks
  // GeneratePaymentLinks

  
   

// remove value if not accepted memberid on first row(last column only).
// dont create payment links for middle column change in first row
// make sure the edited column of first row should be the valid last column of the first row.
 
  //var oldValue = e.oldValue;
  //generatePaymentLinks(e);

  //SpreadsheetApp.getActive().toast(oldValue + "Script2 activated.");
}

