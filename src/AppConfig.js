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

    GenerateReceiptApi: "http://localhost:3000/receipt?payerMemberId={payerMemberId}&payeeMemberId={payeeMemberId}&amount={amount}"
}