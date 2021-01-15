
function doGet(request) {   
    let receipt = Helper.SanitizeApiParameters(request.parameters);

    console.log(receipt);

    var memberSheet = DataProvider.GetSheetByName(SheetDcoument.MEMBERS);

    var allMemberRows = DataProvider.GetRowObjectsByColumns(memberSheet);

    var payerMember = allMemberRows.filter(row => row[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header] == receipt.payerMemberId)[0];
    var payeeMember = allMemberRows.filter(row => row[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header] == receipt.payeeMemberId)[0];

    // var data = 
    // {
    //     payerMember: {
    //         MemberId : payerMemeber[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header], 
    //         MemberName : payerMemeber[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberName.header],
    //         Phone : 
    //     },
    //     payeeMemeber: {
    //         MemberId : payeeMemeber[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header], 
    //         MemberName : payeeMemeber[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberName.header]
    //     }
    // }

    var data = {
        payeeMember : Utility.PurageObjectHavingArrayIndcluded(payeeMember), 
        payerMember : Utility.PurageObjectHavingArrayIndcluded(payerMember) 
    };

    receipt.payerMemberName = data.payerMember.MemberName;
    receipt.payeeMemberName = data.payeeMember.MemberName;
    receipt.payerMemeberPhone = data.payerMember.Phone;
    receipt.payerMemeberEmail = data.payerMember.Email;

    ReceiptCallBack(receipt);

    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); 
   }

   function ReceiptCallBack(receipt)
    { 
        new Member().MakePayment(receipt.payerMemberId,
            receipt.payeeMemberId,
            receipt.generatedOn);

        new TransactionLogSheet().CreateLog(receipt.receiptNumber,
            receipt.payerMemberId,
            receipt.payerMemberName,
            receipt.payeeMemberId,
            receipt.payeeMemberName,
            receipt.amount,
            receipt.generatedOn);
        
        let messageText = Helper.BuildReceiptMessage(receipt);
        console.log(receipt);
        console.log(messageText);

        //     Helper.SendMessage(receipt.payerMemeberPhone, messageText)

        return;
    }
   