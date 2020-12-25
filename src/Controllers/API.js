function doGet(request) {    

    var payerMemberId =  request.parameters.payerMemberId;
    var payeeMemberId =  request.parameters.payeeMemberId;
    var receiptNumber =  request.parameters.receiptNumber.toString();
    var amount =  request.parameters.amount.toString();

    let paidOn = Utility.GetCurrentDateTime();

    var allMemberRows = DataProvider.GetRowObjectsByColumns();

    var payerMemeber = allMemberRows.filter(row => row[0] == payerMemberId)[0];
    var payeeMemeber = allMemberRows.filter(row => row[0] == payeeMemberId)[0];

    ReceiptCallBack(receiptNumber,payerMemeber[0],payerMemeber[1],payeeMemeber[0],payeeMemeber[1],amount,paidOn);
    //ReceiptCallBack();
    var data = 
    {
        payerMember: {
            MemberId : payerMemeber[0], 
            MemberName : payerMemeber[1]
        },
        payeeMemeber: {
            MemberId : payeeMemeber[0], 
            MemberName : payeeMemeber[1]
        }
    }

   
    
   // return ContentService.createTextOutput(request.parameters.payeeMemberId);
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); 
    // }
   }

   function ReceiptCallBack(receiptNumber,payerMemberId, payerName, payeeMemberId,payeeName,amount,paidOn)
  // function ReceiptCallBack()
    { /*
        let receiptNumber = '111'
        let payerMemberId = "M3"
        let payerName = "Xyz"
        let payeeMemberId ="M9"
        let payeeName = "VWX"
        let amount = 100
        let paidOn = Utility.GetCurrentDateTime();
*/
        new Member().MakePayment(payerMemberId,payeeMemberId,paidOn);
        new TransactionLogSheet().CreateLog(receiptNumber,payerMemberId,payerName,payeeMemberId,payeeName,amount,paidOn);
        return;
    }
   