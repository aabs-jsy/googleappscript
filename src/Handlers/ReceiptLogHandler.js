class ReceiptLogHandler
{
    constructor(unitOfWork) 
    {
        this.unitOfWork = unitOfWork;
    }

    HandleToCreateReceiptLog(nextReceiptNumber, payerMemberId, payerMemberName, payeeMemberId, payeeMemberName, Amount, receiptGenerationDateTime, payerMemberPhone, payerMemberWhatsApp, ReceiptCreator, payerMemberCity, payeeMemberCity, paymentMode, reference, balanceAfterReceipt = 0)
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
       // receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ReceiptLink.header] = '=HYPERLINK("'+ WebAPIs.ViewReceiptAPI.replace('${receiptNumber}', nextReceiptNumber)+'","View Receipt")';
     //   receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.Regenerate.header] = '=HYPERLINK("'+ WebAPIs.GenerateReceiptAPI.replace('${receiptNumber}', nextReceiptNumber)+'","Resend Receipt")';
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayerMemberPhone.header] = payerMemberPhone;
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayerMemberWhatsApp.header] = payerMemberWhatsApp;
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayeeMemberCity.header] = payeeMemberCity;        
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.PayerMemberCity.header] = payerMemberCity; 
        
         receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.BalanceAfterReceipt.header] = balanceAfterReceipt; 
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.WhatsAppStatus.header] = 'Pending'; 
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.MessageStatus.header] = 'Pending'; 
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ResendWhatsApp.header] = '';  
        receiptLog[SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ResendMessage.header] = '';        

        this.unitOfWork.receiptLogRepository.Add(receiptLog);
    }


    HandleToUpdateReceiptMessageStatusAndLink(receiptNumber, messageStatus, receiptLink)
    {
        // update receipt log
        let receiptRowItem = this.unitOfWork.receiptLogRepository.GetById(receiptNumber);
        receiptRowItem.setFieldValue(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.MessageStatus.header, messageStatus)
        receiptRowItem.setFieldValue(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ReceiptLink.header, receiptLink)
        receiptRowItem.commit();        
    }

     HandleToUpdateReceiptMessageStatus(receiptNumber, messageStatus)
    {
        // update receipt log
        let receiptRowItem = this.unitOfWork.receiptLogRepository.GetById(receiptNumber);
        receiptRowItem.setFieldValue(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.MessageStatus.header, messageStatus)        
        receiptRowItem.commit();        
    }

     HandleToUpdateReceiptWhatsAppStatus(receiptNumber, whatsAppStatus)
    {
        // update receipt log
        let receiptRowItem = this.unitOfWork.receiptLogRepository.GetById(receiptNumber);
        receiptRowItem.setFieldValue(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.WhatsAppStatus.header, whatsAppStatus)
        receiptRowItem.commit();        
    }

    HandleToReGenerateReceipt()
    {
        // collect needfull data
        // call api to regeneate
    }

    GetReceiptByReceiptNumer(receiptNumber)
    { 

        let receiptLogSheetItemRow = this.unitOfWork.receiptLogRepository.GetById(receiptNumber);

        if(!receiptLogSheetItemRow) return null;
        
        let receiptLog = this.unitOfWork.receiptLogRepository.GetAsObject(receiptLogSheetItemRow);
       
        return receiptLog;
    }
}