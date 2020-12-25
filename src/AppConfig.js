var AppConfig =
{
    /* APPLICATION CONSTANTS */
    MemberIdRegx : '([M][0-9]+$)',   //"/([M][0-9]+$)/g"

    /* SHEET COLUMNS NAMES */
    SheetColumnHeaderAndIndexes :
    {
        MemberId: { header: "MemberId", index: 1 },
        MemberName: { header: "MemberName", index: 2 },
        Status: { header: "Status", index: 3 }
    },

    /* PAYMENT PATTENRNS */
    PaymentPattern :
    {
        FirstDue : { amount : 100, validityInDays : 30},
        SecondDue : { amount : 125, validityInDays : 30},
        ThirdDue : { amount : 150, validityInDays : 30}
    },

    /* PAYMENT METHODS */
    PaymentMethod :
    {
        Online: "Online",
        Cash: "Cash",
        Cheque:  "Cheque"
    },

    GenerateReceiptApi: "https://hardikraval.herokuapp.com/receipt?payerMemberId={payerMemberId}&payeeMemberId={payeeMemberId}&amount={amount}&Method={paymentMethod}"
}