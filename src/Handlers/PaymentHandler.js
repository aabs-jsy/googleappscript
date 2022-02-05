class PaymentHandler {
  constructor(unitOfWork) 
  {
    this.unitOfWork = unitOfWork;
  }

  HandlePaymentRequest(payerMemberId, payeeMemberId, Amount, ReceiptCreator) 
  {
    // Validation
    // UpdatePayment
    // CreateReceiptLog (ReceiptlogHandler)
    // Call Api to generate receipt

    /* GET MEMBERS INFORMATION */
    let payeeMember = this.unitOfWork.memberRepostitory.GetById(payeeMemberId);
    let payerMember = this.unitOfWork.memberRepostitory.GetById(payerMemberId);

    /* GENERATE HTML POPUP FOR CONFIRMATION */
    var htmlOutPut = HtmlService.createTemplateFromFile('PaymentForm');
    htmlOutPut.payeeMember = payeeMember;
    htmlOutPut.payerMember = payerMember;
    htmlOutPut.Amount = Amount;
    htmlOutPut.ReceiptCreator = ReceiptCreator;

    /* OPEN CONFIRMATION POPUP */
    SpreadsheetApp.getUi().showModalDialog(htmlOutPut.evaluate().setHeight(600), 'રસીદ માહિતી (Please Confirm)');
  }

  HandlePayment(payerMemberId, payerMemberName, payeeMemberId, payeeMemberName, Amount, payerMemberPhone, payerMemberWhatsApp, ReceiptCreator, payerMemberCity, payeeMemberCity, paymentMode, reference) 
  {
    /* DEFINE RECEIPT GENERATE DATETIME */
    let receiptGenerationDateTime = Utility.GetCurrentDateTime();

    /* DEFINE NEXT RECEIPT NUMBER */
    const nextReceiptNumber = PaymentHelper.GenerateNextReceiptNumber(this.unitOfWork);

    /* SET RECEIPT-DATETIME FOR PAYER MEMBER */
    PaymentHelper.SetReceiptDateForPayerMember(new UnitOfWork(), payerMemberId, payeeMemberId, receiptGenerationDateTime);

    /* GENERATE TRASANCTIONLOG */
    new ReceiptLogHandler(new UnitOfWork()).HandleToCreateReceiptLog(
      nextReceiptNumber, 
      payerMemberId, 
      payerMemberName, 
      payeeMemberId, 
      payeeMemberName, 
      Amount, 
      receiptGenerationDateTime, 
      payerMemberPhone,
      payerMemberWhatsApp,
      ReceiptCreator, 
      payerMemberCity,
      payeeMemberCity,
      paymentMode, 
      reference 
      );

      /* GENERATE RECEIPT THROUGH API */
      PaymentHelper.GenerateReceiptByAPI(nextReceiptNumber) 
  } 
  
  HandlePaymentByApi(payerMemberId, payeeMemberId, reference, receiptCreator, paymentMode, balance)
  {
    /* GET MEMBERS INFORMATION */
    let payeeMember = this.unitOfWork.memberRepostitory.GetById(payeeMemberId);    
    let payerMember = this.unitOfWork.memberRepostitory.GetById(payerMemberId);
    
    let amount = payerMember.getFieldValue(payeeMemberId).toString().replace('Pay ','').toString();

    if(isNaN(amount))
    {
      return 0;
    }

    /* DEFINE RECEIPT GENERATE DATETIME */
    let receiptGenerationDateTime = Utility.GetCurrentDateTime();

    /* DEFINE NEXT RECEIPT NUMBER */
    const nextReceiptNumber = PaymentHelper.GenerateNextReceiptNumber(this.unitOfWork);

    /* SET RECEIPT-DATETIME FOR PAYER MEMBER */
    PaymentHelper.SetReceiptDateForPayerMember(this.unitOfWork, payerMemberId, payeeMemberId, receiptGenerationDateTime, balance);    

    /* GENERATE TRASANCTIONLOG */
    new ReceiptLogHandler(new UnitOfWork()).HandleToCreateReceiptLog(
      nextReceiptNumber, 
      payerMemberId, 
      payerMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberName.header), 
      payeeMemberId, 
      payeeMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberName.header), 
      amount, 
      receiptGenerationDateTime, 
      payerMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.Phone.header),
      payerMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.WhatsApp.header),
      receiptCreator, 
      payerMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.City.header),
      payeeMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.City.header),
      paymentMode, 
      reference ,
      balance
      );

    return nextReceiptNumber;
  }

  HandleToGeneratePaymentLinks(payeeMemberId) 
  {
    /* GET FIRST PAYMENT STAGE */
    const firstDuePattern = Utility.ObjectPropertiesToList(PaymentPattern).filter((x)=>x.isFirstStage)[0];
    
    /* GENERATE PAYMENT LINKS */
    PaymentHelper.UpdateCellPaymentLinkByPattern(this.unitOfWork, payeeMemberId,firstDuePattern );
  }

  HandleToUpdateBalances(balanceUpdateRequest) 
  {    
    /*  UPDATE BALANCES */
    PaymentHelper.UpdateCellBalances(this.unitOfWork, balanceUpdateRequest );
  }

  HandleRefreshPaymentLinks() 
  {

    const allExpiredMemberSheetItemRows = this.unitOfWork.memberRepostitory.GetAllExpired();
    const duePatterns = Utility.ObjectPropertiesToList(PaymentPattern);

    duePatterns.forEach((duePattern, index) => 
    {
      if (Utility.IsValueNullEmptyUndefied(duePatterns[index + 1])) return;

      let expiredMemberRowsInIterance = allExpiredMemberSheetItemRows.filter(expiredMemberSheetItemRow => Utility.AreDateEqual(Utility.GetDateBeforeDays(duePattern.validityInDays + 1), expiredMemberSheetItemRow.getFieldValue('ExpiredOn')));

      if (!Utility.IsValueNullEmptyUndefied(expiredMemberRowsInIterance) && expiredMemberRowsInIterance.length > 0) 
      {
        expiredMemberRowsInIterance.forEach(member => {
          PaymentHelper.UpdateCellPaymentLinkByPattern(this.unitOfWork, member.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header), duePatterns[index + 1]);
          });
      }
  });

   
  }

  HandlerElimination() {
    // list all members
    // list all paymentstage
    // find members who are in criteria for final stage
    // find elibileable members 
    // foreach to eligable and update elimination

    const allExpiredMemberSheetItemRows = this.unitOfWork.memberRepostitory.GetAllExpired();
    const finalDuePattern = Utility.ObjectPropertiesToList(PaymentPattern).filter((x)=>x.isEliminationStage)[0];

      if (Utility.IsValueNullEmptyUndefied(finalDuePattern)) return;

      let expiredMemberRowsInIterance = allExpiredMemberSheetItemRows.filter(expiredMemberSheetItemRow => Utility.AreDateEqual(Utility.GetDateBeforeDays(finalDuePattern.validityInDays + 1), expiredMemberSheetItemRow.getFieldValue('ExpiredOn')));

      if (!Utility.IsValueNullEmptyUndefied(expiredMemberRowsInIterance) && expiredMemberRowsInIterance.length > 0) 
      {
        let allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();
        expiredMemberRowsInIterance.forEach(expiredMember =>
          {
            allMemberSheetItemRows.forEach(memberSheetItemRow => 
            {              
              let expiredMemberId = expiredMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header);
              let currentPaymentLink = memberSheetItemRow.getFieldValue(expiredMemberId);
              
              if(!Utility.IsValueNullEmptyUndefied(currentPaymentLink.toString()) && currentPaymentLink.toString().substring(0, 3) == 'Pay')
              {                
                memberSheetItemRow.setFieldValue(expiredMemberId, MemberStatus.ELIMINATED.StatusName);
                memberSheetItemRow.setBackground(MemberStatus.ELIMINATED.ColorCode)
                memberSheetItemRow.setFieldFontColor(expiredMemberId, '#000')
              }
              memberSheetItemRow.commit();
            }); 
          });
      }
  }
}