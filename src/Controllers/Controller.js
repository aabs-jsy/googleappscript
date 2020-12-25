var backendServerUrl = "www.google.com";
var memberIdColumnNumber = 1;
var memberNameColumn = 2;
var emailColumn = 3;
var phoneColumn = 4;
var eventStartingColumn = 5;

// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  DataProvider.Alert("Make sure to active script before going ahead!");

  SpreadsheetApp.getUi()
    .createMenu('AABS')
    .addItem('Activate - Script', 'ActiveScript')
    .addToUi();
}

function ActiveScript() {
  DataProvider.Toast("Your script is activated!");
}

function onEdit(e) {
  try {

    var eventProvider = new EventProvider(e);

    if (!eventProvider.sheetEvent) return null;

    switch (eventProvider.sheetEvent) {
      case SheetEvent.GENERATEPAYMENTLINKS:
        HandleGeneratePaymentLinks(eventProvider)
        break;

      default:
        break;
    }
  }
  catch (error) {
    DataProvider.Alert(error.message);
  }
}

function HandleGeneratePaymentLinks(eventProvider) {

  var payeeMemberId = eventProvider.activeCell.getValue();
  var memberSheetColumnNumber = eventProvider.activeCell.getColumn();
  var memberSheet = new MemberSheet();

  /* lets check for event validation before generate payment links */
  var isValidEvent = memberSheet.ValidateEventToGeneratePaymentLinks(eventProvider);

  if (!isValidEvent) return;

  memberSheet.GeneratePaymentLinks(payeeMemberId,memberSheetColumnNumber);
}

