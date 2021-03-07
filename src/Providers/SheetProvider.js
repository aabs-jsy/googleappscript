class SheetProvider {
    // todo: review
    constructor(sheet) {
        // todo: review
        this.sheet = sheet
    }
    
    GetRowByNumber(rowNumber)
    {
        let rows = GoogleScriptHelper.GetRowObjectsByColumns(this.sheet, rowNumber, 1);

        return rows ? rows[0] : null;
    }    
    
    GetColumnHeaderByNumber(columnNumber)
    {
        var column = GoogleScriptHelper.GetSignleColumnValuesToArray(this.sheet, columnNumber, 1, 1);

        if(column)
        {
            return column[0];
        }

        return null;
    }
}



