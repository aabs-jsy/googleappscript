class PaymentHandler {
  constructor(unitOfWork) {
    this.unitOfWork = unitOfWork;
    //this._memberRepository = new MemberRepository();
  }

  HandlePaymentRequest(payerMemberId, payeeMemberId, Amount, ReceiptCreator) {
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

  HandlePayment(payerMemberId, payerMemberName, payeeMemberId, payeeMemberName, Amount, ReceiptCreator, paymentMode, reference) 
  {
    let receiptGenerationDateTime = Utility.GetCurrentDateTime();
    let settingItemReceiptCounter = this.unitOfWork.settingRepository.GetById('ReceiptCounter');
    let newReceiptCounter = settingItemReceiptCounter.getFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header) + 1;
    settingItemReceiptCounter.setFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header, newReceiptCounter);
    settingItemReceiptCounter.commit();

    let payerMemeber = this.unitOfWork.memberRepostitory.GetById(payerMemberId);
    payerMemeber.setFieldValue(payeeMemberId, receiptGenerationDateTime);
    payerMemeber.commit();

    let transactionLog = {};
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.ReceiptNumber.header] = newReceiptCounter;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PayerMemberId.header] = payerMemberId;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PayerMemberName.header] = payerMemberName;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PayeeMemberId.header] = payeeMemberId;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PayeeMemberName.header] = payeeMemberName;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.Amount.header] = Amount;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PaidOn.header] = receiptGenerationDateTime;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.GeneratedBy.header] = ReceiptCreator;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.PaymentMode.header] = paymentMode;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.Reference.header] = reference;
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.MessageStatus.header] = 'Pending';
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.ReceiptLink.header] = '';
    transactionLog[SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.Regenerate.header] = '';

    this.unitOfWork.transactionLogRepository.Add(transactionLog);

   let apiUrl = AppConfig.GenerateReceiptApi
   let apiUrlWithParamertsAppended = `${apiUrl}?rn=${newReceiptCounter}`;

    var js = "<html><head><script>window.open('"+apiUrlWithParamertsAppended+"', '_blank'); google.script.host.close();</script></head></html>"
    var html = HtmlService.createHtmlOutput(js)
      .setHeight(10)
      .setWidth(100);
    SpreadsheetApp.getUi().showModalDialog(html, 'Generating receipt...');
  }

  HandleToGeneratePaymentLinks(payeeMemberId) {
    // Generate payment links

    // let allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();

    // if (!DataProvider.IsValueNullEmptyUndefied(allMemberSheetItemRows) && allMemberSheetItemRows.length > 0) {
    //   allMemberSheetItemRows.forEach(memberSheetItemRow => {
    //     memberSheetItemRow.setFieldValue(pyeeMemberId, 'Pay 100');
    //     memberSheetItemRow.setFieldFontColor(pyeeMemberId, '#4285f4')
    //     memberSheetItemRow.commit();
    //   });

    // }
    const firstDuePattern = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern).filter((x)=>x.isFirstStage)[0];
    this.UpdateCellPaymentLinkByPattern(payeeMemberId,firstDuePattern );
  }

  HandleRefreshPaymentLinks() {
    // list all members
    // list all paymentstage
    // find members who are in criteria for each payment stage
    // find elibileable members 
    // foreach to eligable and update paymentlinks

    const allExpiredMemberSheetItemRows = this.unitOfWork.memberRepostitory.GetAllExpired();
    const duePatterns = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern);

    duePatterns.forEach((duePattern, index) => {
      if (DataProvider.IsValueNullEmptyUndefied(duePatterns[index + 1])) return;

      let expiredMemberRowsInIterance = allExpiredMemberSheetItemRows.filter(expiredMemberSheetItemRow => Utility.AreDateEqual(Utility.GetDateBeforeDays(duePattern.validityInDays + 1), expiredMemberSheetItemRow.getFieldValue('ExpiredOn')));

      if (!DataProvider.IsValueNullEmptyUndefied(expiredMemberRowsInIterance) && expiredMemberRowsInIterance.length > 0) {
        expiredMemberRowsInIterance.forEach(member => {
              this.UpdateCellPaymentLinkByPattern(member.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header), duePatterns[index + 1]);
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
    const finalDuePattern = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern).filter((x)=>x.isEliminationStage)[0];

      if (DataProvider.IsValueNullEmptyUndefied(finalDuePattern)) return;

      let expiredMemberRowsInIterance = allExpiredMemberSheetItemRows.filter(expiredMemberSheetItemRow => Utility.AreDateEqual(Utility.GetDateBeforeDays(finalDuePattern.validityInDays + 1), expiredMemberSheetItemRow.getFieldValue('ExpiredOn')));

      if (!DataProvider.IsValueNullEmptyUndefied(expiredMemberRowsInIterance) && expiredMemberRowsInIterance.length > 0) 
      {
        let allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();
        expiredMemberRowsInIterance.forEach(expiredMember =>
          {
            allMemberSheetItemRows.forEach(memberSheetItemRow => 
            {              
              let expiredMemberId = expiredMember.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header);
              let currentPaymentLink = memberSheetItemRow.getFieldValue(expiredMemberId);
              
              if(!DataProvider.IsValueNullEmptyUndefied(currentPaymentLink.toString()) && currentPaymentLink.toString().substring(0, 3) == 'Pay')
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

  UpdateCellPaymentLinkByPattern(payeeMemberId, nextDuePattern)
  {
    let allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();
    const memberStatuses = Utility.ObjectPropertiesToList(MemberStatus);

    if (!DataProvider.IsValueNullEmptyUndefied(allMemberSheetItemRows) && allMemberSheetItemRows.length > 0) 
    {
      if(nextDuePattern.isFirstStage)
      {
        allMemberSheetItemRows.forEach(memberSheetItemRow => 
        {
          let currentStatusOfMember = memberSheetItemRow.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.Status.header);
          
          if(currentStatusOfMember == MemberStatus.ACTIVE.StatusName || currentStatusOfMember == MemberStatus.INACTIVE.StatusName)
          {
            memberSheetItemRow.setFieldValue(payeeMemberId, 'Pay ' + nextDuePattern.amount);
            memberSheetItemRow.setFieldFontColor(payeeMemberId, '#4285f4')
          }
          else
          {
            let memberStatusEnumValue = memberStatuses.filter((x)=> DataProvider.AreStringsEqual(x.StatusName, currentStatusOfMember))[0]           
            memberSheetItemRow.setFieldValue(payeeMemberId, memberStatusEnumValue.StatusName);
            memberSheetItemRow.setFieldBackground(payeeMemberId, memberStatusEnumValue.ColorCode)
            memberSheetItemRow.setFieldFontColor(payeeMemberId, '#000')
          }
         
          memberSheetItemRow.commit();
        });

      }
      else
      {
        allMemberSheetItemRows.forEach(memberSheetItemRow => 
          {
            let currentPaymentLink = memberSheetItemRow.getFieldValue(payeeMemberId);
            
            if(!DataProvider.IsValueNullEmptyUndefied(currentPaymentLink.toString()) && currentPaymentLink.toString().substring(0, 3) == 'Pay')
            {
              memberSheetItemRow.setFieldValue(payeeMemberId, 'Pay ' + nextDuePattern.amount);
              memberSheetItemRow.setFieldFontColor(payeeMemberId, '#4285f4')
            }
            memberSheetItemRow.commit();
          });        
      }
    }
  }
}