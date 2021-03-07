class ReceiptLogHandler
{
    constructor(unitOfWork) 
    {
        this.unitOfWork = unitOfWork;
    }

    HandleToCreateReceiptLog(nextReceiptNumber, payerMemberId, payerMemberName, payeeMemberId, payeeMemberName, Amount, receiptGenerationDateTime, ReceiptCreator, paymentMode, reference )
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

        this.unitOfWork.receiptLogRepository.Add(receiptLog);
    }


    HandleToUpdateReceiptMessageStatus()
    {
        // update receipt log
    }

    HandleToReGenerateReceipt()
    {
        // collect needfull data
        // call api to regeneate
    }

    GetReceiptObjectByReceiptNumer(receiptNumber)
    { 

        let receiptLogSheetItemRow = this.unitOfWork.receiptLogRepository.GetById(receiptNumber);

        if(!receiptLogSheetItemRow) return null;
        
        let receiptLog = this.unitOfWork.receiptLogRepository.GetAsObject(receiptLogSheetItemRow);
       
        return receiptLog;
    }
}