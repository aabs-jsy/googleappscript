class ReceiptLogRepository
{
    constructor()
    {
        this._table = getTable(SheetDcoument.RECEIPTLOG, 1) ;
        this.LastColumnNumber =  this._table.header.length;
        this.HeaderColumn = this._table.header;
    }

    
    Get(where)  //review
    {
        if(where && typeof where === 'object' && where !== null) 
        {           
            return this._table.select(where);
        }        
        else 
        {
            return this._table.items;
        }
    }

    GetById(Id) //review
    {
        let header = SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns.ReceiptNumber.header;

        let whereCondition = {}
        whereCondition[header] = Id;
        
        return this.Get().filter(x=> Utility.AreStringsEqual(x.getFieldValue(header) , Id))[0];
    }

    Add(member)
    {
        // console.log(member);
        // var table = getTable(SheetDcoument.RECEIPTLOG, 1);
        // table.add(member);
        // table.commit();

       var sheet = GoogleScriptHelper.GetSheetByName(SheetDcoument.RECEIPTLOG);

       let columns = Utility.ObjectPropertiesToList(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns);
        
       columns.sort(function(a, b){ return a.index - b.index});
       let row=[];

       columns.forEach((item)=>
       {
            row.push(member[item.header]);
       });
      
       sheet.appendRow(row);
    }

    GetAsObject(sheetRowItem)
    {
        let fields = Utility.ObjectPropertiesToList(SheetColumnHeaderAndIndexes.ReceiptLogSheet.Columns)
        let returnObject = {}       

        if(fields)
        fields.forEach((x)=> returnObject[x.header] = sheetRowItem.getFieldValue(x.header))

        return returnObject;
    }
}