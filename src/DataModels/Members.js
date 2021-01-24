class Members {
    static dataTable;
    constructor(dataTable, dataTableItem) {
        this._dataTable = dataTable;
        this._dataTableItem = dataTableItem;
        this._headerColumnNames = {
                MemberId: 'MemberId', 
                MemberName: 'MemberName', 
                Status: 'Status', 
                City: 'City', 
                Email: 'Email', 
                Phone: 'Phone', 
                ExpiredOn: 'ExpiredOn',
                EliminatedOn: 'EliminatedOn'
            }
    }

    get MemberId() 
    {
        return this.Getter(this._headerColumnNames.MemberId);
    }

    set MemberId(val) 
    {
       this.Setter(this._headerColumnNames.MemberId, val);
    }

    get MemberName() 
    {
        return this.Getter(this._headerColumnNames.MemberName);
    }

    set MemberName(val) 
    {
         this.Setter(this._headerColumnNames.MemberName, val);
    }

    get Status() 
    {        
        return this.Getter(this._headerColumnNames.Status);
    }

    set Status(val) 
    {
         this.Setter(this._headerColumnNames.Status, val);
    }

    get City() 
    {
        return this.Getter(this._headerColumnNames.City);
    }

    set City(val) 
    {
         this.Setter(this._headerColumnNames.City, val);
    }

    get Email() 
    {
        return this.Getter(this._headerColumnNames.Email);
    }

    set Email(val) 
    {
         this.Setter(this._headerColumnNames.Email, val);
    }

    get Phone() 
    {
        return this.Getter(this._headerColumnNames.Phone);
    }

    set Phone(val) 
    {
         this.Setter(this._headerColumnNames.Phone, val);
    }


    get ExpiredOn() 
    {
        return this.Getter(this._headerColumnNames.ExpiredOn);
    }

    set ExpiredOn(val) 
    {
         this.Setter(this._headerColumnNames.ExpiredOn, val);
    }

    get EliminatedOn() 
    {
        return this.Getter(this._headerColumnNames.EliminatedOn);
    }

    set EliminatedOn(val) 
    {
         this.Setter(this._headerColumnNames.EliminatedOn, val);
    }
    

    
    // @ts-ignore
    static Get(where) {
        if(where && isObject(where))
        {
            let members = [];
            let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
            let dataTableItems = table.select(where).items;

            dataTableItems.forEach(item => members.push(new Members(item)));

            return members;
        }
        else
        {
            let members = [];
            let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
            let dataTableItems = table.items;

            dataTableItems.forEach(item => members.push(new Members(item)));

            return members;
        }
    }

    // @ts-ignore
    static GetById(Id) {

        let membersWithSameId = this.Get({'MemberId':Id});

        if(membersWithSameId && membersWithSameId.length > 0)
            return membersWithSameId[0];

        return null;
    }


    AddOrUpdate() {
        this.MemberId = 
    }

    SaveChanges() {
        this._dataTableItem.commit();
    }

    Getter(key)
    {
        if (Utility.IsValueNullEmptyUndefied(this._dataTableItem)) return null;

        return {
            Value :  this._dataTableItem.getFieldValue(key),
            Background :  this._dataTableItem.getFieldBackground(key),
            FontColor :  this._dataTableItem.getFieldFontColor(key)
        };
    }

    Setter(key, val)
    {
        if(Array.isArray(val))
        {
            let value = null;
            let backGround = null;
            let fontColor = null;

            [value, backGround, fontColor] = val;

            if(!Utility.IsValueNullEmptyUndefied(value))
            this._dataTableItem.setFieldValue(key, value);

            if(!Utility.IsValueNullEmptyUndefied(backGround))
                this._dataTableItem.setFieldBackground(key, backGround);

            if(!Utility.IsValueNullEmptyUndefied(fontColor))
                this._dataTableItem.setFieldFontColor(key, fontColor);
        }
       else
       {
            if(!Utility.IsValueNullEmptyUndefied(val))
                this._dataTableItem.setFieldValue(key, val);
       }
    }
}
