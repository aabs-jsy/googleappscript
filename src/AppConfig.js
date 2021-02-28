var AppConfig =
{
    /* APPLICATION CONSTANTS */
    MemberIdRegx : '([M][0-9]+$)',   //"/([M][0-9]+$)/g"

    /* SHEET COLUMNS NAMES */
    SheetColumnHeaderAndIndexes :
    {
        MemberSheet: {
            MemberId: { header: "MemberId", index: 0 },
            MemberName: { header: "MemberName", index: 1 },
            City: { header: "City", index: 2 },
            Status: { header: "Status", index: 3 },
            Email: { header: "Email", index: 4 },
            Phone: { header: "Phone", index: 5 },
            ExpiredOn: { header: "ExpiredOn", index: 6 },
            EliminatedOn: { header: "EliminatedOn", index: 7 },
        }
    },

    /* PAYMENT PATTENRNS */
    PaymentPattern :
    {
        FirstDue : { amount : 100, validityInDays : 30, isFirstStage : true, isEliminationStage : false},
        SecondDue : { amount : 125, validityInDays : 60, isFirstStage : false, isEliminationStage : false},
        ThirdDue : { amount : 150, validityInDays : 90, isFirstStage : false, isEliminationStage : true}
    },

    /* PAYMENT METHODS */
    PaymentMethod :
    {
        Online: "Online",
        Cash: "Cash",
        Cheque:  "Cheque"
    },

    //GenerateReceiptApi: "https://hardikraval.herokuapp.com/receipt?payerMemberId={payerMemberId}&payeeMemberId={payeeMemberId}&amount={amount}&Method={paymentMethod}"
    GenerateReceiptApi: "https://hardikraval.herokuapp.com" 
}