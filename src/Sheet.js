class Sheet {
    constructor(event) {
        this.event = event;
        this.activeSheet = Library.GetActiveSheet();
        this.activeCell = this.activeSheet.getActiveCell();
    }

    ValidateEventToGeneratePaymentLinks() {
        try 
        {
            let editedCellOldValue = this.event.oldValue;
            let editedCellNewValue = this.activeCell.getValue();

            /*  LET'S CHECK AND PREVENT COPY-PASTED MEMEBERID */
            if (!Library.IsValueNullEmptyUndefied(editedCellNewValue)) {
                this.activeCell.value = '';
                throw new Error("Copy and paste is not allowed, please type Member-Id properly in the cell.");
            }

            /* EDITED CELL OLD VALUE MUST BE BLANK */
            if (!Library.IsValueNullEmptyUndefied(editedCellOldValue)) {
                throw new Error("The was not blank before edit, which invalid Event!");
            }

            /* LETS CHECK PATTERN OF MEMBERID */
            if (!Library.MatchWithRegx(editedCellNewValue, AppConfig.memberIdRegx)) {
                return false; 
            }

            /* MEMBERID MUST MATCH WITH THE FIRST COULMN (MEMBERID COLUMN) */
            var allMemberRows = Library.GetRowObjectsByColumns();

            if(!Library.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0)
            {
            
                if ( allMemberRows.filter((row)=>{ return Library.AreStringsEqual(row.MemberId, editedCellNewValue) &&  Library.AreStringsEqual(row.Status ,  MemberStatus.ACTIVE)}).length == 0)
                {  
                    return false;
                }
            }
            
        } catch (error) {
            Logger.log(error);
            return error.message;
        }
        

        return true;

        //* editedCellOldValue  must be blank
        //* value must be matching with M{D}
        // *value must be matching with the value of first column cell and active member
        // value must be pasted to first header row
        // pasted cell must be last column of the sheet
        // there should not be duplicate expired memeberid pasted.
        // make sure the edited column of first row should be the valid last column of the first row.
    }
}
