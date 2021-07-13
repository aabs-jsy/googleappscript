
let ServerEnvironment = "Dev"  // Live ; Dev ;  Local
var AppConfig = {}

if(ServerEnvironment == "Live")
{
    AppConfig['ReceiptApi'] = "http://aabs.byethost24.com/receipts" 
}
else
{
    AppConfig['ReceiptApi'] = "http://jsy.22web.org/receipts" 
}


// var AppConfig =
// {   
//     ReceiptApi: "http://3807e14c1a84.ngrok.io/Aabs/aabsbackend/receipts" ,
//     ReceiptApi: "http://3807e14c1a84.ngrok.io/Aabs/aabsbackend/receipts" 
// }