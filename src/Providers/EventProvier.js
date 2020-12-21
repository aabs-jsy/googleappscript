class EventProvider {
    constructor()
    {

    }
    
    IdentifySheetEvent(sheetName, event) {

        if(Library.IsValueNullEmptyUndefied(sheetName)) return null;

        if (!event) return null;

        switch (sheetName) {
            case SheetDcoument.MEMBERS:
                if(event.)
                break;
        
            default:
                break;
        }


        var sheetDocumentKey = Object.keys(SheetDcoument)
            .filter(key => Library.AreStringsEqual(SheetDcoument[key], sheetNameInEvent));

        if (!sheetDocumentKey)
            return null;

        return SheetDcoument[sheetDocumentKey];
    }
}



