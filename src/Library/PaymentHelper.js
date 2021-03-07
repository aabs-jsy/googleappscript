class PaymentHelper
{
   static UpdateCellPaymentLinkByPattern(unitOfWork, payeeMemberId, nextDuePattern)
  {
    let allMemberSheetItemRows = unitOfWork.memberRepostitory.Get();
    const memberStatuses = Utility.ObjectPropertiesToList(MemberStatus);

    if (!Utility.IsValueNullEmptyUndefied(allMemberSheetItemRows) && allMemberSheetItemRows.length > 0) 
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
            let memberStatusEnumValue = memberStatuses.filter((x)=> Utility.AreStringsEqual(x.StatusName, currentStatusOfMember))[0]           
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
            
            if(!Utility.IsValueNullEmptyUndefied(currentPaymentLink.toString()) && currentPaymentLink.toString().substring(0, 3) == 'Pay')
            {
              memberSheetItemRow.setFieldValue(payeeMemberId, 'Pay ' + nextDuePattern.amount);
              memberSheetItemRow.setFieldFontColor(payeeMemberId, '#4285f4')
            }
            memberSheetItemRow.commit();
          });        
      }
    }
  }

  static GenerateNextReceiptNumber(unitOfWork)
  {
    let settingItemReceiptCounter = unitOfWork.settingRepository.GetById('ReceiptCounter');
    let nextReceiptCounter = settingItemReceiptCounter.getFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header) + 1;
    settingItemReceiptCounter.setFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header, nextReceiptCounter);
    settingItemReceiptCounter.commit();

    return nextReceiptCounter;
  }

  static SetReceiptDateForPayerMember(unitOfWork, payerMemberId, payeeMemberId, receiptGenerationDateTime)
  {
    let payerMemeber = unitOfWork.memberRepostitory.GetById(payerMemberId);
    payerMemeber.setFieldValue(payeeMemberId, receiptGenerationDateTime);
    payerMemeber.commit();
  }

  static GeneratereceiptLog(unitOfWork, nextReceiptNumber, payerMemberId, payerMemberName, payeeMemberId, payeeMemberName, Amount, receiptGenerationDateTime, ReceiptCreator, paymentMode, reference )
  {
    let receiptLog = {};
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ReceiptNumber.header] = nextReceiptNumber;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayerMemberId.header] = payerMemberId;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayerMemberName.header] = payerMemberName;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayeeMemberId.header] = payeeMemberId;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayeeMemberName.header] = payeeMemberName;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.Amount.header] = Amount;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PaidOn.header] = receiptGenerationDateTime;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.GeneratedBy.header] = ReceiptCreator;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PaymentMode.header] = paymentMode;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.Reference.header] = reference;
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.MessageStatus.header] = 'Pending';
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ReceiptLink.header] = '';
    receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.Regenerate.header] = '';

    unitOfWork.receiptLogRepository.Add(receiptLog);
  }

  static GenerateReceiptByAPI(nextReceiptNumber)
  {
    let apiUrlWithParamertsAppended = `${AppConfig.GenerateReceiptApi}?rn=${nextReceiptNumber}`;

    var js = "<html><head><script>window.open('"+apiUrlWithParamertsAppended+"', '_blank'); google.script.host.close();</script></head></html>"
    var html = HtmlService.createHtmlOutput(js)
      .setHeight(10)
      .setWidth(100);
    SpreadsheetApp.getUi().showModalDialog(html, 'Generating receipt...');
  }
}