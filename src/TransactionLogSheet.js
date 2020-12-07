class TransactionLogSheet 
{
    constructor() {
      this.activeSheet = Library.GetSheetByName('TransactionLog');
    }
  
    CreateLog(receiptNumber,payerMemberId, payer, payeeMemberId,payee,amount,paidOn)
    { 
        this.activeSheet.appendRow([receiptNumber,payerMemberId,payer,payeeMemberId,payee,amount,paidOn]);
    }
  
    SetExpired()
    {
  
    }
  
  }
  
  