
function doGet(request) {  
    
    let receiptLogInRequest = Helper.SanitizeApiParameters(request.parameters);

    if(receiptLogInRequest && receiptLogInRequest.rn)
    {
        const receiptLog = new ReceiptLogHandler(new UnitOfWork()).GetReceiptObjectByReceiptNumer(receiptLogInRequest.rn);

        if(!receiptLog)  return ContentService.createTextOutput(JSON.stringify({ Message: "No record found." })).setMimeType(ContentService.MimeType.JSON);   

        return ContentService.createTextOutput(JSON.stringify(receiptLog)).setMimeType(ContentService.MimeType.JSON);   
    }
    else
    {
        return ContentService.createTextOutput(JSON.stringify({ Message: "Invalid Data in request." })).setMimeType(ContentService.MimeType.JSON);   
    }
   }
