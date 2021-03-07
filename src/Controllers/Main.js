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
      let ReceiptCreator = Session.getEffectiveUser().getEmail();

      new PaymentHandler(new UnitOfWork())
      .HandlePaymentRequest(PayerMemberId, PayeeMemberId, Amount, ReceiptCreator);
    }
  }

function AcceptPayment(payerMemberId,payerMemberName, payeeMemberId, payeeMemberName, Amount, ReceiptCreator, paymentMode, reference) 
{
    new PaymentHandler(new UnitOfWork())
    .HandlePayment(payerMemberId,payerMemberName, payeeMemberId, payeeMemberName, Amount, ReceiptCreator, paymentMode, reference);
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
{ var tt = new MemberHandler(new UnitOfWork())
  .TestScript(); 

console.log(tt)
  
}

