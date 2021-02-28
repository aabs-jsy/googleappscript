class EventProvider {
    constructor(event) {
        // todo: review

        if(event)
        {
            this.event = event;
            this.sheetName = this.IdentifySheet();
            this.eventSheet = DataProvider.GetSheetByName(this.sheetName);
            this.activeCell = this.eventSheet != null ? this.eventSheet.getActiveCell() : null; // todo: review
            this.sheetEvent = this.IdentifySheetEvent();
            this.oldValue = this.event.oldValue;
        }
        else
        {
            this.eventSheet = SpreadsheetApp.getActiveSheet();
            this.sheetName = this.eventSheet.getSheetName();
            this.activeCell = this.eventSheet != null ? this.eventSheet.getActiveCell() : null; // todo: review
            this.sheetEvent = this.IdentifySheetEvent();
        }
    }

    IdentifySheet() {

        if (!this.event)
            return null;

        var sheetNameInEvent = this.event
            .source
            .getActiveSheet()
            .getSheetName();

        if (!sheetNameInEvent)
            return null;

        var sheetDocumentKey = Object.keys(SheetDcoument)
            .filter(key => DataProvider.AreStringsEqual(SheetDcoument[key], sheetNameInEvent));

        if (!sheetDocumentKey)
            return null;

        return SheetDcoument[sheetDocumentKey];
    }

    IdentifySheetEvent() {

        if (DataProvider.IsValueNullEmptyUndefied(this.sheetName)) return null;

        if (!this.activeCell) return null;

        switch (this.sheetName) {
            case SheetDcoument.MEMBERS:
                if (this.activeCell.getRow() == MemberSheet.GetHeaderRow() && this.event) {
                    return SheetEvent.GENERATEPAYMENTLINKS;
                }

                if (this.activeCell.getRow() != MemberSheet.GetHeaderRow()
                    && !DataProvider.IsValueNullEmptyUndefied(this.activeCell.getValue())
                    && this.activeCell.getValue().toString().startsWith('Pay ')) {
                    return SheetEvent.ACCEPTPAYMENT;
                }
                break;

            default:
                break;
        }

        return null;
    }
}



