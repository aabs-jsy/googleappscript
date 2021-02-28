class TransactionLogRepository
{
    constructor()
    {
        this._table = getTable(SheetDcoument.TRANSACTIONLOG, 1) ;
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
        let header = SheetColumnHeaderAndIndexes.TransactionLogSheet.Columns.ReceiptNumber.header;

        let whereCondition = {}
        whereCondition[header] = Id;
        
        return this.Get(whereCondition).first();
    }

    Add(member)
    {
        console.log(member);
        var table = getTable(SheetDcoument.TRANSACTIONLOG, 1);
        table.add(member);
        table.commit();
    }
}