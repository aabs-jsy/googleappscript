class MemberRepository
{
    constructor()
    {
        this._table = getTable(SheetDcoument.MEMBERS, 1) ;
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
        let header = SheetColumnHeaderAndIndexes.MemberSheet.Columns.MemberId.header;

        let whereCondition = {}
        whereCondition[header] = Id;
        
        return this.Get(whereCondition).first();
    }

    GetAllExpired() //review
    {
        let header = SheetColumnHeaderAndIndexes.MemberSheet.Columns.ExpiredOn.header;

        return this.Get()
        .filter((x)=> !DataProvider.IsValueNullEmptyUndefied(x.getFieldValue(header)));
    }

    Add(member)
    {
        this._table.Add(member);
    }

    SetExpired(payeeMemberId)
    {
        let payeeMemberSheetItem = this.GetById(payeeMemberId);

        if(payeeMemberSheetItem.getFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.Status.header) == MemberStatus.ACTIVE.StatusName)
        {
            payeeMemberSheetItem.setFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.Status.header, MemberStatus.EXPIRED.StatusName);
            payeeMemberSheetItem.setFieldValue(SheetColumnHeaderAndIndexes.MemberSheet.Columns.ExpiredOn.header, Utility.GetCurrentDateTime());
            payeeMemberSheetItem.setBackground('#f4cccc');
            payeeMemberSheetItem.commit();
        }
        else
        {
           // review
           // throw new Error(ErrorCodes.ERRORCODE1001);
        }
    }
}