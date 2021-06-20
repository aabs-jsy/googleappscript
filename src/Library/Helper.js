class Helper
{
    async IsMemberExpired(member) 
    {
    var rows = await GetRowObjectsByColumns(memberIdColumnNumber,memberStatusColumnName);

    return rows.filter((x)=>x.MemberId == member.MemberId && x.Status == MemberStatus.ACTIVE.StatusName).length > 0;
    }

    static SanitizeApiParameters(parameters)
    {
        let returnObject = {};

        for (var key in parameters) 
        {
            returnObject[key] = parameters[key][0];
        }

        return returnObject;
    }

    static BuildReceiptMessage(receipt)
    {
        return `શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ધ્વારા સંચાલીત શ્રી જીવન સહાય યોજના ધ્વારા શ્રી ધ્વારા શ્રી ${receipt.payerMemberName} તરફથી ₹${receipt.amount}, ${receipt.payeeMemberName} ના મૃત્યુ પેટે સ્વીકારવામા આવેલ છે. રસીદ નં-${receipt.receiptNumber}`;
    }

    static SendMessage(messageTo, messageText)
    {
        let sender = "PWASMS";
        var utf8EncodedMessage = Utilities.base64Decode(Utilities.base64Encode(messageText,Utilities.Charset.UTF_8), Utilities.Charset.UTF_8);
        let api_url = "http://msg.pwasms.com/app/smsapi/index.php"
        + "?key=45F3B943047D61"
        + "&campaign=0"
        + "&routeid=9"
        + "&type=unicode" 
        + "&contacts=" + messageTo
        + "&senderid=" + sender
        + "&msg=" + encodeURI(Utilities.newBlob(utf8EncodedMessage).getDataAsString("ISO-8859-1"));

        //Utilities.sleep(500);

        console.log(`TextMessage: MesaageTo: ${messageTo} MessageText: ${messageText}`)

       // DataProvider.Alert(`TextMessage: MesaageTo: ${messageTo} MessageText: ${messageText}`);
       // var response = UrlFetchApp.fetch(api_url);

      // return response.getContentText()
    }

}

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};


