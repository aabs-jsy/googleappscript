class SheetProvider {
    // todo: review
    constructor(event) {
        // todo: review
        this.event = event;
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
}



