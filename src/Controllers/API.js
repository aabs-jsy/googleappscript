
function doGet(e) 
{      
    return ContentService.createTextOutput(JSON.stringify({ Message: "Invalid Data in request." })).setMimeType(ContentService.MimeType.JSON);   
}

function doPost(request) {    
    if(typeof request !== 'undefined')    
    {   
        let httpMethod = request.parameter.httpMethod;
        let command = decodeURIComponent((request.parameter.command + '').replace(/\+/g, '%20'));
    
        if(Utility.AreStringsEqual(httpMethod,APICommands.GetReceipt.HTTPMethod) && Utility.AreStringsEqual(command,APICommands.GetReceipt.Command))
        {
            return GetReceiptHandler(request);
        }

        if(Utility.AreStringsEqual(httpMethod,APICommands.UpdateReceipt.HTTPMethod) && Utility.AreStringsEqual(command,APICommands.UpdateReceipt.Command))
        {
            return UpdateReceiptHandler(request);
        }

        if(Utility.AreStringsEqual(httpMethod,APICommands.PostReceipt.HTTPMethod) && Utility.AreStringsEqual(command,APICommands.PostReceipt.Command))
        {
            return PostReceiptHandler(request);
        }

        if(Utility.AreStringsEqual(httpMethod,APICommands.GetMembers.HTTPMethod) && Utility.AreStringsEqual(command,APICommands.GetMembers.Command))
        {
            return GetMembersHandlers(request);
        }

    }

    return ContentService.createTextOutput(JSON.stringify({ Message: "Invalid Data in request.",request:request })).setMimeType(ContentService.MimeType.JSON);  
  }

function GetReceiptHandler(request)
{
    let receiptNumber = request.parameter.receiptNumber;

    if(receiptNumber)
    {
        const receiptLog = new ReceiptLogHandler(new UnitOfWork()).GetReceiptByReceiptNumer(receiptNumber);

        if(!receiptLog)  return ContentService.createTextOutput(JSON.stringify({ Message: "No record found." })).setMimeType(ContentService.MimeType.JSON);   

        return ContentService.createTextOutput(JSON.stringify(receiptLog)).setMimeType(ContentService.MimeType.JSON);   
    }
    else
    {
        return ContentService.createTextOutput(JSON.stringify({ Message: "Invalid Data in request." })).setMimeType(ContentService.MimeType.JSON);   
    }
}
/*
function UpdateReceiptHandler(request)
{
    let hyperLinkToViewReceipt = '=HYPERLINK("'+ request.parameter.receiptLink +'","View Receipt")';  
    let viewMessageStatus = request.parameter.messageStatus ? '=HYPERLINK("'+ request.parameter.messageStatus +'","Message Status")':'N/A';  

    new ReceiptLogHandler(new UnitOfWork())
    .HandleToUpdateReceiptMessageStatusAndLink(request.parameter.receiptNumber, viewMessageStatus, hyperLinkToViewReceipt);

    return ContentService.createTextOutput(JSON.stringify(request))
}*/

function UpdateReceiptHandler(request)
{
    let messageStatus = (request.parameter.messageStatus && request.parameter.messageStatus != '') ? request.parameter.messageStatus: '' ;  
    let whatsAppStatus = (request.parameter.whatsAppStatus && request.parameter.whatsAppStatus != '') ? request.parameter.whatsAppStatus: '' ;  

    if(messageStatus && messageStatus != '')
    {      
      new ReceiptLogHandler(new UnitOfWork())
      .HandleToUpdateReceiptMessageStatus(request.parameter.receiptNumber, messageStatus);
    }

    if(whatsAppStatus && whatsAppStatus != "")
    {      
      new ReceiptLogHandler(new UnitOfWork())
      .HandleToUpdateReceiptWhatsAppStatus(request.parameter.receiptNumber, whatsAppStatus);
    }  

    return ContentService.createTextOutput(JSON.stringify(request))
}

function GetMembersHandlers(request)
{
    if(AuthenticateRequest(request))
    {
        let members = new MemberHandler(new UnitOfWork())
        .GetAllMembers();

        if(members == null)
        {
            return ContentService.createTextOutput(JSON.stringify({ Message: "No record found." })).setMimeType(ContentService.MimeType.JSON);   
        }

        return ContentService.createTextOutput(JSON.stringify({members:members}))
    }

    return ContentService.createTextOutput(JSON.stringify({ Message: "UnAuthtorized request." })).setMimeType(ContentService.MimeType.JSON);   
}

function PostReceiptHandler(request)
{

    // let token = request.parameter.token;
    // let tokenDateTime = new Date(token);
    // let dateTime1min = addMinutes(new Date(),-1); //Date.now()+(new Date().getTimezoneOffset()*60000)).getTime()
    // return ContentService.createTextOutput(JSON.stringify({token,tokenDateTime,dateTime1min})).setMimeType(ContentService.MimeType.JSON); 


    if(AuthenticateRequest(request))
    {
        let payerMemberId = request.parameter.payerMemberId;  
        let payeeMemberId = request.parameter.payeeMemberId;  
        let reference = request.parameter.reference;  
        let paymentMode = request.parameter.paymentMode;
        let receiptCreator = request.parameter.receiptCreator;      
        let balance = request.parameter.balance;

        let receiptNumber = new PaymentHandler(new UnitOfWork())
        .HandlePaymentByApi(payerMemberId, payeeMemberId, reference, receiptCreator, paymentMode, balance);

        if(receiptNumber)
        {
            const receiptLog = new ReceiptLogHandler(new UnitOfWork()).GetReceiptByReceiptNumer(receiptNumber);
    
            if(!receiptLog)  return ContentService.createTextOutput(JSON.stringify({ Message: "No record found." })).setMimeType(ContentService.MimeType.JSON);   
    
            return ContentService.createTextOutput(JSON.stringify(receiptLog)).setMimeType(ContentService.MimeType.JSON);   
        }
        else
        {
            return ContentService.createTextOutput(JSON.stringify({ Message: "Receipt not found." })).setMimeType(ContentService.MimeType.JSON);   
        }
    }

    return ContentService.createTextOutput(JSON.stringify({ Message: "UnAuthtorized request." })).setMimeType(ContentService.MimeType.JSON);   
}

function AuthenticateRequest(request)
{
    let token = request.parameter.token;

    if(typeof token != 'undefined')
    {
        let decodedToken = decodeBase64(token.replace('bearer ','').toString());

        if(typeof decodedToken != 'undefined')
        {
            let tokenDateTime = new Date(decodedToken);
            if(tokenDateTime > addMinutes(new Date(),-1))
            {
                return true;
            }
        }
    }

    return false;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

const decodeBase64 = function(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};

