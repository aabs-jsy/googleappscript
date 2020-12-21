class SheetProvider {
    IdentifySheet(event) {

        if (!event)
            return null;

        var sheetNameInEvent = event
            .source
            .getActiveSheet()
            .getSheetName();

        if (!sheetNameInEvent)
            return null;

        var sheetDocumentKey = Object.keys(SheetDcoument)
            .filter(key => Library.AreStringsEqual(SheetDcoument[key], sheetNameInEvent));

        if (!sheetDocumentKey)
            return null;

        return SheetDcoument[sheetDocumentKey];
    }
}



