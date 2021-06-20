class MemberHandler
{
    constructor(unitOfWork)
    {
        this.unitOfWork = unitOfWork;
        this.paymentHandler =  new PaymentHandler(unitOfWork);
    }
    
    HandleExpiry(eventProvider)
    {
        // Validate
        // SetExpiry to payee
        // GeneratePaymentLinks (Paymenthandler)
    
        /* lets check for event validation before generate payment links */
        var isValidEvent = this.ValidateExpiryEvent(eventProvider);
 
        /* return if event is not valid */
        if (!isValidEvent) return;
        /* get payeememberid from event */
        var payeeMemberId = eventProvider.activeCell.getValue();

        this.unitOfWork.memberRepostitory.SetExpired(payeeMemberId);
        
        this.paymentHandler.HandleToGeneratePaymentLinks(payeeMemberId);
    }

    ValidateExpiryEvent(eventProvider) {

        if (!eventProvider.event) {
            return false;
        }

        let editedCellOldValue = Utility.SetNullToBank(eventProvider.oldValue);
        let editedCellNewValue = Utility.SetNullToBank(eventProvider.activeCell.getValue());

        // value must be pasted to header row (apply valiadtion only for the first row)
        if (eventProvider.activeCell.getRow() != SheetColumnHeaderAndIndexes.MemberSheet.HeaderRownumber) {
            return false;
        }

        /*  LET'S CHECK AND PREVENT COPY-PASTED MEMEBERID */
        if (Utility.IsValueNullEmptyUndefied(eventProvider.event.value)) {
            eventProvider.activeCell.setValue(editedCellOldValue);
            throw new Error("Keyboard short cuts (for example: Copy and paste or delete) are not allowed, please type Member-Id properly in the cell. System will reject his input.");
        }

        /* TODO: EDITED CELL OLD VALUE MUST BE BLANK */
        if (!Utility.IsValueNullEmptyUndefied(eventProvider.event.oldValue)) {
            eventProvider.activeCell.setValue(editedCellOldValue);
            throw new Error("The was not blank before edit, which invalid Event! System will reject this input.");
        }

        /* LETS CHECK PATTERN OF MEMBERID */
        if (!Utility.MatchWithRegx(editedCellNewValue, AppRegx.MemberIdRegx)) {
            eventProvider.activeCell.setValue('');
            throw new Error("Invalid MemberId pasted! System will reject this input.");
        }

        /* MEMBERID MUST MATCH WITH THE FIRST COULMN (MEMBERID COLUMN) */
        var allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();

        if (!Utility.IsValueNullEmptyUndefied(allMemberSheetItemRows) && allMemberSheetItemRows.length > 0) {
            if (allMemberSheetItemRows.filter((sheetItemRow) => {
                return Utility.AreStringsEqual(sheetItemRow.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header), editedCellNewValue)
                    && Utility.AreStringsEqual(sheetItemRow.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.Status.header), MemberStatus.ACTIVE.StatusName)
            }).length == 0) {
                eventProvider.activeCell.setValue(''); //review
                throw new Error("Member-Id પ્રથમ કોલમ અને સક્રિય સભ્ય સાથે મેળ ખાતી હોવી જોઈએ! સિસ્ટમ આ ઇનપુટને Reject કરશે.");
            }
        }

        // pasted cell must be last column of the sheet
        if (eventProvider.activeCell.getColumn() != this.unitOfWork.memberRepostitory.LastColumnNumber) {
            eventProvider.activeCell.setValue('');
            throw new Error("Member Id must be pasted on the last column! System will reject this input.");
        }


        /* make sure the edited column of first row should be the valid last column of the first row. */
        let headerRow = new SheetProvider(GoogleScriptHelper.GetSheetByName(SheetDcoument.MEMBERS))
        .GetRowByNumber(SheetColumnHeaderAndIndexes.MemberSheet.HeaderRownumber)

        if(!Utility.IsValueNullEmptyUndefied(headerRow) && headerRow.length > 0)
        {            
            if ( headerRow.filter((headerCoulumn)=> Utility.IsValueNullEmptyUndefied(headerCoulumn)).length > 0) {
                eventProvider.activeCell.setValue('');
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

    TestScript()
    {
        var allMemberSheetItemRows = this.unitOfWork.memberRepostitory.Get();

        return this.unitOfWork.memberRepostitory.GetAsObject(allMemberSheetItemRows[0])
    }
}