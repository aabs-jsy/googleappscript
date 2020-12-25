class MemberSheet {

    constructor() {
        this.sheet = DataProvider.GetSheetByName(SheetDcoument.MEMBERS);
        this.lastColumnNumber = this.sheet.getLastColumn();
        this.lastRowNumber = this.sheet.getLastRow();
        this.headerRowNumber = 1;
    }

    ValidateEventToGeneratePaymentLinks(eveventProviderent) {

        if (!eveventProviderent.event) {
            return false;
        }

        let editedCellOldValue = DataProvider.SetNullToBank(eveventProviderent.oldValue);
        let editedCellNewValue = DataProvider.SetNullToBank(eveventProviderent.activeCell.getValue());
        
        // value must be pasted to header row (apply valiadtion only for the first row)
        if (eveventProviderent.activeCell.getRow() != this.headerRowNumber) 
        {
            return false;
        }

        /*  LET'S CHECK AND PREVENT COPY-PASTED MEMEBERID */
        if (DataProvider.IsValueNullEmptyUndefied(eveventProviderent.event.value)) 
        {
            eveventProviderent.activeCell.setValue(editedCellOldValue);
            throw new Error("Keyboard short cuts (for example: Copy and paste or delete) are not allowed, please type Member-Id properly in the cell. System will reject his input.");
        }

        /* TODO: EDITED CELL OLD VALUE MUST BE BLANK */
        if (!DataProvider.IsValueNullEmptyUndefied(eveventProviderent.event.oldValue)) 
        {
            eveventProviderent.activeCell.setValue(editedCellOldValue);
            throw new Error("The was not blank before edit, which invalid Event! System will reject this input.");
        }

        /* LETS CHECK PATTERN OF MEMBERID */
        if (!DataProvider.MatchWithRegx(editedCellNewValue, AppConfig.MemberIdRegx)) 
        {
            eveventProviderent.activeCell.setValue('');
            throw new Error("Invalid MemberId pasted! System will reject this input.");
        }

        /* MEMBERID MUST MATCH WITH THE FIRST COULMN (MEMBERID COLUMN) */
        var allMemberRows = DataProvider.GetRowObjectsByColumns(this.sheet);

        if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
        {
            if (allMemberRows.filter((row) => {
                return DataProvider.AreStringsEqual(row.MemberId, editedCellNewValue)
                    && DataProvider.AreStringsEqual(row.Status, MemberStatus.ACTIVE)
            }).length == 0) {
                eveventProviderent.activeCell.setValue('');
                throw new Error("Member Id must match with the values from first column's active Member Id! System will reject this input.");
            }
        }

        // pasted cell must be last column of the sheet
        if (eveventProviderent.activeCell.getColumn() != this.lastColumnNumber) 
        {
            eveventProviderent.activeCell.setValue('');
            throw new Error("Member Id must be pasted on the last column! System will reject this input.");
        }

        /* make sure the edited column of first row should be the valid last column of the first row. */
        allMemberRows = DataProvider.GetRowObjectsByColumns(this.sheet, 1, 1);

        if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
        {
            if (allMemberRows[0].filter((rowValue) => { return DataProvider.IsValueNullEmptyUndefied(rowValue) }).length > 0) 
            {
                eveventProviderent.activeCell.setValue('');
                throw new Error("You can not leave any cell blank on the header row! System will reject this input.");
            }
        }

        return true;

        // apply validation by checking activesheet by name
        // *apply valiadtion only for the first row
        // *dont apply valition if old and new values are same
        //* editedCellOldValue  must be blank
        //* value must be matching with M{D}
        // *value must be matching with the value of first column cell and active member
        // *value must be pasted to first header row
        // *pasted cell must be last column of the sheet
        // *there should not be duplicate expired memeberid pasted.
        // *make sure the edited column of first row should be the valid last column of the first row.
        // reject input if there is no valid row-column combination of active area
        // think about ctrl+z, delete

    }

    GeneratePaymentLinks(payeeMemberId, columnNumber) 
    {
        var allMemberRows = DataProvider.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);

        var generateReceiptApi = AppConfig.GenerateReceiptApi;

        var linkColumnRange = [];
        if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
        {

            allMemberRows.forEach(
                (row, index) => {

                        
                    var paymentLinkToPayOnline = this.BuildPaymentLink(payeeMemberId, 
                        row.MemberId, 
                        AppConfig.PaymentPattern.FirstDue.amount, 
                        AppConfig.PaymentMethod.Online
                        );

                    var paymentLinkToPayByCash = this.BuildPaymentLink(payeeMemberId, 
                        row.MemberId, 
                        AppConfig.PaymentPattern.FirstDue.amount, 
                        AppConfig.PaymentMethod.Cash
                        );
                    
                    var paymentLinkToPayByCheque = this.BuildPaymentLink(payeeMemberId, 
                        row.MemberId, 
                        AppConfig.PaymentPattern.FirstDue.amount, 
                        AppConfig.PaymentMethod.Cheque
                        );
                        
                    var richTextValue = this.BuildRichTextValue(
                        AppConfig.PaymentPattern.FirstDue.amount,
                        paymentLinkToPayOnline,
                        paymentLinkToPayByCash,
                        paymentLinkToPayByCheque
                        );

                    DataProvider.GetRangeFromSpreadSheet(
                        this.sheet,
                        index + 2, 
                        columnNumber, 
                        1, 
                        1)
                        .setRichTextValue(richTextValue);
                }
            )
        }
    }

    static GetHeaderRow()
    {
        return 1;
    }

    BuildPaymentLink(payeeMemberId, payerMemberId, amount, paymentMethod)
    {
        var generateReceiptApi = AppConfig.GenerateReceiptApi;

        return generateReceiptApi.supplant(
            {
                payeeMemberId: payeeMemberId,
                payerMemberId: payerMemberId,
                amount: amount,
                paymentMethod: paymentMethod
            });
    }

    BuildRichTextValue(amount, payOnlineLink, payChashLink, payChequeLink)
    {
        var richText = `Pay ${amount}   `;

        return SpreadsheetApp.newRichTextValue()
                .setText(richText)
                .setLinkUrl(0,7,payOnlineLink)
                .setLinkUrl(8,9,payChashLink)
                .setLinkUrl(9,10,payChequeLink)
                .build();
    }

    // GetRowNumberByMemberId(memberId) {
    //     var allMemberRows = DataProvider.GetSignleColumnValuesToArray(this.sheet, 1);

    //     if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
    //         let foundIndex = allMemberRows.indexOf(memberId);
    //         return (foundIndex == -1 ? foundIndex : (foundIndex + 2));
    //     }
    // }

    // GetColumnNumberByExpiredMemberId(memberId) {
    //     var allMemberRows = DataProvider.GetRowObjectsByColumns(this.sheet, 1);

    //     if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
    //         return (allMemberRows[0].indexOf(memberId) + 1);
    //     }

    //     return -1;
    // }
}
