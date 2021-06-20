class SettingRepository
{
    constructor()
    {
        this._table = getTable(SheetDcoument.Settings, 1) ;
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
        let header = SheetColumnHeaderAndIndexes.SettingsSheet.Columns.SettingKey.header;

        let whereCondition = {}
        whereCondition[header] = Id;
        
        return this.Get().filter(x=> Utility.AreStringsEqual(x.getFieldValue(header) , Id))[0];
    }

    Add(member)
    {
        this._table.Add(member);
    }
    GetAsObject(sheetRowItem)
    {
        let fields = Utility.ObjectPropertiesToList(SheetColumnHeaderAndIndexes.SettingsSheet.Columns)
        let returnObject = {}     
        
        if(fields)
        fields.forEach((x)=> returnObject[x.header] = sheetRowItem.getFieldValue(x.header))

        return returnObject;
    }
}