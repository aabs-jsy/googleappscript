
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

function UpdateReceiptHandler(request)
{
    let hyperLinkToViewReceipt = '=HYPERLINK("'+ request.parameter.receiptLink +'","View Receipt")';  
    let viewMessageStatus = request.parameter.messageStatus ? '=HYPERLINK("'+ request.parameter.messageStatus +'","Message Status")':'N/A';  

    new ReceiptLogHandler(new UnitOfWork())
    .HandleToUpdateReceiptMessageStatusAndLink(request.parameter.receiptNumber, viewMessageStatus, hyperLinkToViewReceipt);

    return ContentService.createTextOutput(JSON.stringify(request))
}