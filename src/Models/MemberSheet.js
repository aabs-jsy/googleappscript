
class MemberSheet {
    constructor(event) {
        if(event)
        {
            this.event = event;
            this.activeSheet = Library.GetActiveSheet();
            this.activeCell = this.activeSheet.getActiveCell();
            this.editedCellOldValue = Library.SetNullToBank(this.event.oldValue);
            this.editedCellNewValue = Library.SetNullToBank(this.activeCell.getValue());
        }
        else
        {
            this.activeSheet = Library.GetSheetByName('Members');
        }

        this.headerRowNumber = 1;
        this.lastColumnNumber = this.activeSheet.getLastColumn();
        this.lastRowNumber = this.activeSheet.getLastRow();
    }

    ValidateEventToGeneratePaymentLinks() {
        
        if(!this.event)
        {
            return false;
        }

        let editedCellOldValue = this.editedCellOldValue;
        let editedCellNewValue = this.editedCellNewValue;
            
            // value must be pasted to header row (apply valiadtion only for the first row)
             if (this.activeCell.getRow() != this.headerRowNumber) {
               return false;
            }

            /*  LET'S CHECK AND PREVENT COPY-PASTED MEMEBERID */
            if (Library.IsValueNullEmptyUndefied(this.event.value)) {
                this.activeCell.setValue(editedCellOldValue);
                throw new Error("Keyboard short cuts (for example: Copy and paste or delete) are not allowed, please type Member-Id properly in the cell. System will reject his input.");
            }
           
            /* EDITED CELL OLD VALUE MUST BE BLANK */
            if (!Library.IsValueNullEmptyUndefied(this.event.oldValue)) {
                this.activeCell.setValue(editedCellOldValue);
                throw new Error("The was not blank before edit, which invalid Event! System will reject this input.");
            }

            /* LETS CHECK PATTERN OF MEMBERID */
            if (!Library.MatchWithRegx(editedCellNewValue, AppConfig.MemberIdRegx)) {
                this.activeCell.setValue('');
                throw new Error("Invalid MemberId pasted! System will reject this input.");
            }

            /* MEMBERID MUST MATCH WITH THE FIRST COULMN (MEMBERID COLUMN) */
            var allMemberRows = Library.GetRowObjectsByColumns();

            if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
            {
                if ( allMemberRows.filter((row)=>{ return Library.AreStringsEqual(row.MemberId, editedCellNewValue) 
                    &&  Library.AreStringsEqual(row.Status ,  MemberStatus.ACTIVE)}).length == 0)
                {  
                    this.activeCell.setValue('');
                    throw new Error("Member Id must match with the values from first column's active Member Id! System will reject this input.");
                }
            }

            // pasted cell must be last column of the sheet
            if (this.activeCell.getColumn() != this.lastColumnNumber) {
                this.activeCell.setValue('');
                throw new Error("Member Id must be pasted on the last column! System will reject this input.");
            }
            
            /* make sure the edited column of first row should be the valid last column of the first row. */
            allMemberRows = Library.GetRowObjectsByColumns(1,1);

            if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
            {
                if ( allMemberRows[0].filter((rowValue)=>{ return Library.IsValueNullEmptyUndefied(rowValue) }).length > 0)
                {  
                    this.activeCell.setValue('');
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

    GeneratePaymentLinks()
    { 
        var ActionColumnNumber;
        var generateReceiptApi = AppConfig.GenerateReceiptApi;

        var allMemberRows = Library.GetRowObjectsByColumns(2,this.lastRowNumber - 1);

        var linkColumnRange = [];
            if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
            {
                allMemberRows.forEach(
                    (row,index) => {

                     var generatedLink = generateReceiptApi.supplant(
                         { 
                            payeeMemberId: this.editedCellNewValue,
                            payerMemberId: row.MemberId ,
                            amount:'100' 
                        });

                     Library.GetRangeFromActiveSpreadSheet(index+2,this.activeCell.getColumn(),1,1)
                     .setFormula('=HYPERLINK("'+generatedLink+'","'+`Pay 100`+'")'); ;
                    }
                )
            } 
    }

    GetRowNumberByMemberId(memberId)
    {
        var allMemberRows = Library.GetSignleColumnValuesToArray(1);

        if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
        {
            let foundIndex = allMemberRows.indexOf(memberId);
            return ( foundIndex == -1?foundIndex: (foundIndex+2));
        }
    }

    GetColumnNumberByExpiredMemberId(memberId)
    {
        var allMemberRows = Library.GetRowObjectsByColumns(1);

        if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
        {
          return (allMemberRows[0].indexOf(memberId) + 1);
        }

        return -1;
    }
}
