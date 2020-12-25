class EventProvider {
    constructor(event) {
        // todo: review
        this.event = event;
        this.sheetName = this.IdentifySheet();
        this.eventSheet = DataProvider.GetSheetByName(this.sheetName);
        this.activeCell = this.eventSheet.getActiveCell(); // todo: review
        this.sheetEvent = this.IdentifySheetEvent();
        this.oldValue = this.event.oldValue;
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

        if (!this.event) return null;

        switch (this.sheetName) {
            case SheetDcoument.MEMBERS:
                if (this.activeCell.getRow() == MemberSheet.GetHeaderRow()) {
                    return SheetEvent.GENERATEPAYMENTLINKS;
                }
                break;

            default:
                break;
        }

        return null;
    }
}



