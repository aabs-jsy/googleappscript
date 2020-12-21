var backendServerUrl = "www.google.com";
var memberIdColumnNumber = 1;
var memberNameColumn = 2;
var emailColumn = 3;
var phoneColumn = 4;
var eventStartingColumn = 5;

// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  Library.Alert("Make sure to active script before going ahead!");

  SpreadsheetApp.getUi()
      .createMenu('AABS')
      .addItem('Activate - Script', 'ActiveScript')
      .addToUi();
}

function ActiveScript()
{
 Library.Toast("Your script is activated!");
}

function onEdit(e) {
  try{
  
  var sheet =  new SheetProvider()
    .IdentifySheet(e);
  
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

