class MemberSheet {

    constructor() {
        this.sheet = GoogleScriptHelper.GetSheetByName(SheetDcoument.MEMBERS);
        this.lastColumnNumber = this.sheet.getLastColumn();
        this.lastRowNumber = this.sheet.getLastRow();
        this.headerRowNumber = 1;
    }

    ValidateEventToGeneratePaymentLinks(eveventProviderent) {

        if (!eveventProviderent.event) {
            return false;
        }

        let editedCellOldValue = Utility.SetNullToBank(eveventProviderent.oldValue);
        let editedCellNewValue = Utility.SetNullToBank(eveventProviderent.activeCell.getValue());

        // value must be pasted to header row (apply valiadtion only for the first row)
        if (eveventProviderent.activeCell.getRow() != this.headerRowNumber) {
            return false;
        }

        /*  LET'S CHECK AND PREVENT COPY-PASTED MEMEBERID */
        if (Utility.IsValueNullEmptyUndefied(eveventProviderent.event.value)) {
            eveventProviderent.activeCell.setValue(editedCellOldValue);
            throw new Error("Keyboard short cuts (for example: Copy and paste or delete) are not allowed, please type Member-Id properly in the cell. System will reject his input.");
        }

        /* TODO: EDITED CELL OLD VALUE MUST BE BLANK */
        if (!Utility.IsValueNullEmptyUndefied(eveventProviderent.event.oldValue)) {
            eveventProviderent.activeCell.setValue(editedCellOldValue);
            throw new Error("The was not blank before edit, which invalid Event! System will reject this input.");
        }

        /* LETS CHECK PATTERN OF MEMBERID */
        if (!Utility.MatchWithRegx(editedCellNewValue, AppConfig.MemberIdRegx)) {
            eveventProviderent.activeCell.setValue('');
            throw new Error("Invalid MemberId pasted! System will reject this input.");
        }

        /* MEMBERID MUST MATCH WITH THE FIRST COULMN (MEMBERID COLUMN) */
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
            if (allMemberRows.filter((row) => {
                return Utility.AreStringsEqual(row.MemberId, editedCellNewValue)
                    && Utility.AreStringsEqual(row.Status, MemberStatus.ACTIVE)
            }).length == 0) {
                eveventProviderent.activeCell.setValue('');
                throw new Error("Member-Id પ્રથમ કોલમ અને સક્રિય સભ્ય સાથે મેળ ખાતી હોવી જોઈએ! સિસ્ટમ આ ઇનપુટને Reject કરશે.");
            }
        }

        // pasted cell must be last column of the sheet
        if (eveventProviderent.activeCell.getColumn() != this.lastColumnNumber) {
            eveventProviderent.activeCell.setValue('');
            throw new Error("Member Id must be pasted on the last column! System will reject this input.");
        }

        /* make sure the edited column of first row should be the valid last column of the first row. */
        allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 1, 1);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
            if (allMemberRows[0].filter((rowValue) => { return Utility.IsValueNullEmptyUndefied(rowValue) }).length > 0) {
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

    GeneratePaymentLinks(payeeMemberId, columnNumber, dueIterance) {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);
        let payeeMember = new Member().GetMemberById(payeeMemberId);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {

            allMemberRows.forEach(
                (row, index) => {

                    var range = GoogleScriptHelper.GetRangeFromSpreadSheet(
                        this.sheet,
                        index + 2,
                        columnNumber,
                        1,
                        1);

                    // do not change if cell is already set as 'expired' or 'eliminated'    
                    if (dueIterance.isFirstStage == false) {
                        if (range != null 
                            && !Utility.IsValueNullEmptyUndefied(range.getValue()) 
                            && range.getValue().toString().substring(0, 3) != 'Pay') 
                            return;
                    }
                    
                    // if payer is joined after respective payee is expired
                    if (dueIterance.isFirstStage == false) {
                        if (range != null 
                            && Utility.IsValueNullEmptyUndefied(range.getValue())
                            ) 
                            {
                                range.setValue('N/A')
                                    .setBackground("#cccccc");

                                return;
                            }
                    }

                    if (row.Status == MemberStatus.EXPIRED && dueIterance.isFirstStage == true) {
                        range.setValue('Expired')
                            .setBackground("#f4cccc");

                        return;
                    }

                    if (row.Status == MemberStatus.ELIMINATED && dueIterance.isFirstStage == true) {
                        range.setValue('Eliminated')
                            .setBackground("#d9d2e9");

                        return;
                    }

                    if (row.Status == MemberStatus.INACTIVE && dueIterance.isFirstStage == true) {
                        range.setValue('InActive')
                            .setBackground("#ffe599");

                        return;
                    }

                    var paymentLinkToPayOnline = this.BuildPaymentLink(payeeMemberId,
                        row.MemberId,
                        dueIterance.amount,
                        AppConfig.PaymentMethod.Online
                    );

                    var paymentLinkToPayByCash = this.BuildPaymentLink(payeeMemberId,
                        row.MemberId,
                        dueIterance.amount,
                        AppConfig.PaymentMethod.Cash
                    );

                    var paymentLinkToPayByCheque = this.BuildPaymentLink(payeeMemberId,
                        row.MemberId,
                        dueIterance.amount,
                        AppConfig.PaymentMethod.Cheque
                    );

                    var richTextValue = this.BuildRichTextValue(
                        dueIterance.amount,
                        paymentLinkToPayOnline,
                        paymentLinkToPayByCash,
                        paymentLinkToPayByCheque
                    );

                    range.setRichTextValue(richTextValue);


                    // if(dueIterance.isFirstStage ==  true
                    //     && row.Status == MemberStatus.ACTIVE)
                    // {
                    //    let reminderMessageText = `શ્રી જીવન સહાય યોજના ના સભ્ય નં ${payeeMember.MemberId} ${payeeMember.MemberName} નુ તાજેતરમાં અવસાન થયુ હોવાથી તમારે ₹${dueIterance.amount} તા-${Utility.FormatToDate(Utility.subDaysFromDate(payeeMember.ExpiredOn, (-1 * dueIterance.validityInDays)))} સુધીમા ભરવાના રહેશે.`
                    //    Helper.SendMessage(row.Phone, reminderMessageText);
                    // }
                }
            )
        }
    }

    GenerateElimination(payeeMemberId) 
    {
        var payeeMembercolumnNumber = this.GetColumnNumberByExpiredMemberId(payeeMemberId);
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
        {
            allMemberRows.forEach(
                (row, index) => 
                {
                    if (!Utility.IsValueNullEmptyUndefied(row[payeeMemberId]) 
                        && row[payeeMemberId].toString().substring(0, 3) == 'Pay'
                        && row.Status == MemberStatus.ACTIVE) 
                    {
                        row.Status = MemberStatus.ELIMINATED;
                        row.EliminatedOn = Utility.GetCurrentDateTime();

                       this.SetEliminationStyleOnMemberRow(row.MemberId);
                    }
                })
            
            Member.UpdateMembers(allMemberRows);
        }
    }

    RemovePaymentLinks(payeeMemberId, columnNumber) {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
            allMemberRows.forEach(
                (row, index) => {
                    GoogleScriptHelper.GetRangeFromSpreadSheet(
                        this.sheet,
                        index + 2,
                        columnNumber,
                        1,
                        1)
                        .setValue('');
                }
            )
        }
    }

    RefreshDueIterance() {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);
        var duePatterns = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern);

        if (Utility.IsValueNullEmptyUndefied(allMemberRows) || allMemberRows.length <= 0) return;

        if (Utility.IsValueNullEmptyUndefied(duePatterns) || duePatterns.length <= 0) return;

        duePatterns.forEach((duePattern, index) => {
            if (Utility.IsValueNullEmptyUndefied(duePatterns[index + 1])) return;

            let memberRowsInIterance = allMemberRows.filter(row => !Utility.IsValueNullEmptyUndefied(row.ExpiredOn)
                && Utility.AreDateEqual(Utility.GetDateBeforeDays(duePattern.validityInDays + 1), row.ExpiredOn));

            if (!Utility.IsValueNullEmptyUndefied(memberRowsInIterance) && memberRowsInIterance.length > 0) {
                memberRowsInIterance.forEach(member => {
                    this.GeneratePaymentLinks(member.MemberId, this.GetColumnNumberByExpiredMemberId(member.MemberId), duePatterns[index + 1]);
                });
            }
        });
    }

    RefreshDueElimination() {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);
        var duePatterns = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern);

        if (Utility.IsValueNullEmptyUndefied(allMemberRows) || allMemberRows.length <= 0) return;

        if (Utility.IsValueNullEmptyUndefied(duePatterns) || duePatterns.length <= 0) return;

        let eliminationDuePattern = duePatterns.filter(duePattern => duePattern.isEliminationStage == true)[0];

        if(!eliminationDuePattern) return;

        let memberRowsInIterance = allMemberRows.filter(row => !Utility.IsValueNullEmptyUndefied(row.ExpiredOn)
                && Utility.AreDateEqual(Utility.GetDateBeforeDays(eliminationDuePattern.validityInDays + 1), row.ExpiredOn));
        
        if (!Utility.IsValueNullEmptyUndefied(memberRowsInIterance) && memberRowsInIterance.length > 0) {
            memberRowsInIterance.forEach(payeeMember => 
            {
                this.GenerateElimination(payeeMember.MemberId);
            });
        }
    }

    SendPaymentReminder()
    {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);
        var duePatterns = Utility.ObjectPropertiesToList(AppConfig.PaymentPattern);

        if (Utility.IsValueNullEmptyUndefied(allMemberRows) || allMemberRows.length <= 0) return;

        if (Utility.IsValueNullEmptyUndefied(duePatterns) || duePatterns.length <= 0) return;

        duePatterns.forEach((duePattern, index) => 
        {
            let memberRowsInIterance = allMemberRows.filter(row => !Utility.IsValueNullEmptyUndefied(row.ExpiredOn)
            && Utility.AreDateEqual(Utility.GetDateBeforeDays(duePattern.validityInDays - 8), row.ExpiredOn));
    
            if (!Utility.IsValueNullEmptyUndefied(memberRowsInIterance) && memberRowsInIterance.length > 0) {
                memberRowsInIterance.forEach(payeeMember => 
                {
                    this.SendReminder(payeeMember, duePattern, duePatterns[index + 1] );
                });
            }
        });
    }

    SendReminder(payeeMember, currentDuePattern, nextPattern ) 
    {
        var payeeMembercolumnNumber = this.GetColumnNumberByExpiredMemberId(payeeMember.MemberId);
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, 2, this.lastRowNumber - 1);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
        {
            allMemberRows.forEach(
                (row, index) => 
                {
                    var range = GoogleScriptHelper.GetRangeFromSpreadSheet(
                        this.sheet,
                        index + 2,
                        payeeMembercolumnNumber,
                        1,
                        1);                        
                    
                    if (range != null 
                        && !Utility.IsValueNullEmptyUndefied(range.getValue()) 
                        && range.getValue().toString().substring(0, 3) == 'Pay'
                        && row.Status == MemberStatus.ACTIVE) 
                    {
                        let reminderMessageText = ''

                        if(currentDuePattern.isEliminationStage ==  false)
                        {
                           reminderMessageText = `શ્રી જીવન સહાય યોજના ના સભ્ય નં ${payeeMember.MemberId} ${payeeMember.MemberName} ના મૃત્યુ પેટે તમારે ₹${currentDuePattern.amount} ભરવાના બાકી છે, જે સત્વરે ભરી દેવા. તા-${Utility.FormatToDate(Utility.subDaysFromDate(payeeMember.ExpiredOn, (-1 * currentDuePattern.validityInDays)))} પછી આ રકમ દંડ સાથે ₹${nextPattern.amount} ભરવાની રહેશે.`
                        }
                        else
                        {
                            reminderMessageText = `શ્રી જીવન સહાય યોજના ના સભ્ય નં ${payeeMember.MemberId} ${payeeMember.MemberName} ના મૃત્યુ પેટે તમારે ₹${currentDuePattern.amount} ભરવાના બાકી છે, જે સત્વરે ભરી દેવા અન્યથા તા-${Utility.FormatToDate(Utility.subDaysFromDate(payeeMember.ExpiredOn, (-1 * currentDuePattern.validityInDays)))} પછી તમારું સભ્યપદ રદ થઈ શકે છે.`
                        }

                        Helper.SendMessage(row.Phone, reminderMessageText);
                    }
                })
        }
    }

    

    static GetHeaderRow() {
        return 1;
    }

    BuildPaymentLink(payeeMemberId, payerMemberId, amount, paymentMethod) {
        var generateReceiptApi = AppConfig.GenerateReceiptApi;

        return generateReceiptApi.supplant(
            {
                payeeMemberId: payeeMemberId,
                payerMemberId: payerMemberId,
                amount: amount,
                paymentMethod: paymentMethod
            });
    }

    BuildRichTextValue(amount, payOnlineLink, payChashLink, payChequeLink) {
        var richText = `Pay ${amount}   `;

        return SpreadsheetApp.newRichTextValue()
            .setText(richText)
            .setLinkUrl(0, 7, payOnlineLink)
            .setLinkUrl(8, 9, payChashLink)
            .setLinkUrl(9, 10, payChequeLink)
            .build();
    }

    SetEliminationStyleOnMemberRow(payerMemberId)
    {
        let payerMemberIdRowNumber = this.GetRowNumberByMemberId(payerMemberId);

        var range = GoogleScriptHelper.GetRangeFromSpreadSheet(
            this.sheet,
            payerMemberIdRowNumber,
            1,
            1,
            this.lastColumnNumber);

        range.setBackground("#d9d2e9");
    }

    SetExpiredStyleOnMemberRow(payeeMemberId)
    {
        let payerMemberIdRowNumber = this.GetRowNumberByMemberId(payeeMemberId);
        var range = GoogleScriptHelper.GetRangeFromSpreadSheet(
            this.sheet,
            payerMemberIdRowNumber,
            1,
            1,
            this.lastColumnNumber);

        range.setBackground("#f4cccc");
    }

    GetRowNumberByMemberId(memberId) {
        var allMemberRows = GoogleScriptHelper.GetSignleColumnValuesToArray(this.sheet,
            AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.index + 1);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows)
            && allMemberRows.length > 0) {
            let foundIndex = allMemberRows.indexOf(memberId);
            return (foundIndex == -1 ? foundIndex : (foundIndex + 2));
        }
    }

    GetColumnNumberByExpiredMemberId(memberId) {
        var allMemberRows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, this.headerRowNumber);

        if (!Utility.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {
            return (allMemberRows[0].indexOf(memberId) + 1);
        }

        return -1;
    }

    GetRowObjectsByColumns(rowStart = this.headerRowNumber, numRows = null) {
        return GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, rowStart, numRows);
    }

    SetCellValue(value, rowNumber = null, columnNumber = null) {
        GoogleScriptHelper.SetCellValue(this.sheet, value, rowNumber, columnNumber);
    }
}
