const SheetDcoument = {
    MEMBERS: "Members",
    RECEIPTLOG: "ReceiptLogs",
    Settings: "Settings",
};

 /* SHEET COLUMNS NAMES */
 const SheetColumnHeaderAndIndexes =
 {
     MemberSheet: 
     {
        Columns: 
        {
            MemberId: { header: "MemberId", index: 0 },
            MemberName: { header: "MemberName", index: 1 },
            City: { header: "City", index: 2 },
            Status: { header: "Status", index: 3 },
            Email: { header: "Email", index: 4 },
            Phone: { header: "Phone", index: 5 },
            WhatsApp: { header: "WhatsApp", index: 6 },
            ExpiredOn: { header: "ExpiredOn", index: 7 },
            EliminatedOn: { header: "EliminatedOn", index: 8 },
        },
        HeaderRownumber: 1
     },
     ReceiptLogSheet: 
     {
        Columns: 
        {
            ReceiptNumber: { header: "ReceiptNumber", index: 0 },
            PayerMemberId: { header: "PayerMemberId", index: 1 },
            PayerMemberName: { header: "PayerMemberName", index: 2 },
            PayeeMemberId: { header: "PayeeMemberId", index: 3 },
            PayeeMemberName: { header: "PayeeMemberName", index: 4 },
            Amount: { header: "Amount", index: 5 },
            PaidOn: { header: "PaidOn", index: 6 },
            PaymentMode: { header: "PaymentMode", index: 7 },
            Reference: { header: "Reference", index: 8 },            
            PayerMemberPhone: { header: "PayerMemberPhone", index: 9 },
            PayerMemberWhatsApp: { header: "PayerMemberWhatsApp", index: 10 },
            GeneratedBy: { header: "GeneratedBy", index: 11 },
            PayerMemberCity: { header: "PayerMemberCity", index: 12 },            
            PayeeMemberCity: { header: "PayeeMemberCity", index: 13 },            
            MessageStatus: { header: "MessageStatus", index: 14 },
            ReceiptLink: { header: "ReceiptLink", index: 15 },
            Regenerate: { header: "Regenerate", index: 16 },

        },
        HeaderRownumber: 1
     },
     SettingsSheet: 
     {
        Columns: 
        {
            SettingKey: { header: "SettingKey", index: 0 },
            SettingValue: { header: "SettingValue", index: 1 },
        },
        HeaderRownumber: 1
     }
 };
 

const SheetEvent = {
    GENERATEPAYMENTLINKS: "GeneratePaymentLinks",
    ACCEPTPAYMENT: "AcceptPayment"
};


const ErrorCodes =
{
    ERRORCODE1001 : { Code: '10001', message: "Member is already Inactive, system can not generate payment links for him/her.!"},
}

const MemberStatus = {
    PENDING: {StatusName: "PENDING", ColorCode: '#fff;'}, 
    ACTIVE: {StatusName: "ACTIVE", ColorCode: '#fff;'},
    INACTIVE: {StatusName: "INACTIVE", ColorCode: '#fff2cc'},
    EXPIRED:{StatusName: "EXPIRED", ColorCode: '#f4cccc'} ,
    ELIMINATED: {StatusName: "ELIMINATED", ColorCode: '#d9d2e9'},
  };

  const PaymentModes = {
    OnlineUPI: "OnlineUPI", 
    OnlineNeftRtgs: "OnlineNeftRtgs",
    OnlineWallet: "OnlineWallet",
    Cash: "Cash",
    Cheque: "Cheque"
  };

  const AppRegx = {MemberIdRegx: "([J][0-9]+$)"};


   /* PAYMENT PATTENRNS */
   const PaymentPattern =
   {
       FirstDue : { amount : 100, validityInDays : 30, isFirstStage : true, isEliminationStage : false},
       SecondDue : { amount : 125, validityInDays : 60, isFirstStage : false, isEliminationStage : false},
       ThirdDue : { amount : 150, validityInDays : 90, isFirstStage : false, isEliminationStage : true}
   }

   const WebAPIs =
   {
       GenerateReceiptAPI : AppConfig.ReceiptApi+"/generate/${receiptNumber}",
       ViewReceiptAPI : AppConfig.ReceiptApi+"/${receiptNumber}",
   }

   const APICommands =
   {
       GetReceipt : {HTTPMethod : "GET", Command : "api/receipts/{receiptNumber}"},
       UpdateReceipt : {HTTPMethod : "PUT", Command : "api/receipts/{receiptNumber}"},
   }
  