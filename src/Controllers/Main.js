// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  GoogleScriptHelper.Alert("Make sure to active script From Menu 'AABS' before going ahead!");

  SpreadsheetApp.getUi()
    .createMenu('AABS')
    .addItem('Activate - Script', 'ActiveScript')
    .addItem('Create Receipt', 'RequestToAcceptPayment')
    .addToUi();
}

function ActiveScript() 
{
  GoogleScriptHelper.Toast("Your script is activated!");
}

function RequestToAcceptPayment() 
{
  let eventProvider = new EventProvider();

    if(eventProvider.sheetEvent == SheetEvent.ACCEPTPAYMENT)
    {
      let sheetProvider = new SheetProvider(eventProvider.eventSheet);
      let PayerMemberId = sheetProvider.GetRowByNumber(eventProvider.activeCell.getRow())[SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.index];
      let PayeeMemberId = sheetProvider.GetColumnHeaderByNumber(eventProvider.activeCell.getColumn());
      let Amount = eventProvider.activeCell.getValue().replace('Pay ','').toString();
      let ReceiptCreatorEmail = Session.getEffectiveUser().getEmail();

      let settingItemReceiptCreatorEmail = new UnitOfWork().settingRepository.GetById(ReceiptCreatorEmail);
      let ReceiptCreator = settingItemReceiptCreatorEmail.getFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header);
    

      new PaymentHandler(new UnitOfWork())
      .HandlePaymentRequest(PayerMemberId, PayeeMemberId, Amount, ReceiptCreator);
    }
  }

function AcceptPayment(payerMemberId,payerMemberName, payeeMemberId, payeeMemberName, Amount, payerMemberPhone, payerMemberWhatsApp, ReceiptCreator, payerMemberCity, payeeMemberCity, paymentMode, reference) 
{  
    new PaymentHandler(new UnitOfWork())
    .HandlePayment(payerMemberId,payerMemberName, payeeMemberId, payeeMemberName, Amount, payerMemberPhone, payerMemberWhatsApp, ReceiptCreator, payerMemberCity, payeeMemberCity, paymentMode, reference);
}
  
function onEdit(e) 
{
  try 
  {
    var eventProvider = new EventProvider(e);

    if (!eventProvider.sheetEvent) return null;
   
    switch (eventProvider.sheetEvent) 
    {
      case SheetEvent.GENERATEPAYMENTLINKS:
        new MemberHandler(new UnitOfWork()).HandleExpiry(eventProvider)
        break;

      default:
        break;
    }
  }
  catch (error) 
  {
    GoogleScriptHelper.Alert(error.message);
  }
}

function RefreshPaymentLinks()
{
  new PaymentHandler(new UnitOfWork())
  .HandleRefreshPaymentLinks(); 
}

function RefreshElimination()
{
  new PaymentHandler(new UnitOfWork())
  .HandlerElimination(); 
}

function  TestScript()
{ //var tt = new MemberHandler(new UnitOfWork())
  //.TestScript(); 

  //   // Get a script lock, because we're about to modify a shared resource.
  //   var lock = LockService.getScriptLock();
  //   // Wait for up to 30 seconds for other processes to finish.
  //   lock.waitLock(30000);
  
  //   var ticketNumber = Number(ScriptProperties.getProperty('lastTicketNumber')) + 1;
  //   Utilities.sleep(5000);
  //   ScriptProperties.setProperty('lastTicketNumber', ticketNumber);
  
  //   // Release the lock so that other processes can continue.
  //   lock.releaseLock(); 
  // GoogleScriptHelper.Alert(ticketNumber);

//console.log(tt)
  
}

