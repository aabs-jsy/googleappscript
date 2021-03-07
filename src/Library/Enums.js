const SheetDcoument = {
    MEMBERS: "Members2",
    RECEIPTLOG: "receiptLog2",
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
            ExpiredOn: { header: "ExpiredOn", index: 6 },
            EliminatedOn: { header: "EliminatedOn", index: 7 },
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
            PaymentMode: { header: "PaymentMode", index: 6 },
            Reference: { header: "Reference", index: 6 },
            GeneratedBy: { header: "GeneratedBy", index: 7 },
            MessageStatus: { header: "MessageStatus", index: 8 },
            ReceiptLink: { header: "ReceiptLink", index: 9 },
            Regenerate: { header: "Regenerate", index: 10 },

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
    INACTIVE: {StatusName: "INACTIVE", ColorCode: '#ffe599'},
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