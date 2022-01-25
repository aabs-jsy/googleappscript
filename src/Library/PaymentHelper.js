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
          
          if(currentStatusOfMember == MemberStatus.ACTIVE.StatusName)
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
         
         // memberSheetItemRow.commit();
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
          //  memberSheetItemRow.commit();
          });        
      }

      unitOfWork.memberRepostitory._table.commit();
    }
  }

  static GenerateNextReceiptNumber(unitOfWork)
  {
    // let settingItemReceiptCounter = unitOfWork.settingRepository.GetById('ReceiptCounter');
    // let nextReceiptCounter = settingItemReceiptCounter.getFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header) + 1;
    // settingItemReceiptCounter.setFieldValue(SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingValue.header, nextReceiptCounter);
    // settingItemReceiptCounter.commit();
  

        // Get a script lock, because we're about to modify a shared resource.
    var lock = LockService.getScriptLock();
    // Wait for up to 30 seconds for other processes to finish.
    lock.waitLock(30000);
  
    let ticketNumber = Number(ScriptProperties.getProperty('lastTicketNumber')) + 1;    
    ScriptProperties.setProperty('lastTicketNumber', ticketNumber.toString());
  
    // Release the lock so that other processes can continue.
    lock.releaseLock(); 
  

    return ticketNumber;
  }

  static SetReceiptDateForPayerMember(unitOfWork, payerMemberId, payeeMemberId, receiptGenerationDateTime)
  {
      // Get a script lock, because we're about to modify a shared resource.
         var lock = LockService.getScriptLock();
         // Wait for up to 30 seconds for other processes to finish.
         lock.waitLock(5000);
       
        let payerMemeber = unitOfWork.memberRepostitory.GetById(payerMemberId);
        payerMemeber.setFieldValue(payeeMemberId, receiptGenerationDateTime);
       // payerMemeber.commit();
       payerMemeber.commitFieldValue(payeeMemberId);

         // Release the lock so that other processes can continue.
         lock.releaseLock();
  }
    
  static GenerateReceiptByAPI(nextReceiptNumber)
  {
    let apiUrlWithParamertsAppended = WebAPIs.GenerateReceiptAPI.replace('${receiptNumber}', nextReceiptNumber); //`${AppConfig.GenerateReceiptApi}?rn=${nextReceiptNumber}`;

    var js = "<html><head><script>window.open('"+apiUrlWithParamertsAppended+"', '_blank'); google.script.host.close();</script></head></html>"
    var html = HtmlService.createHtmlOutput(js)
      .setHeight(10)
      .setWidth(100);
    SpreadsheetApp.getUi().showModalDialog(html, 'Generating receipt...');
  }
}