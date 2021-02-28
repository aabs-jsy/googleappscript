// class Members {
//     constructor() {
//         this._headerColumnNames = {
//                 MemberId: 'MemberId', 
//                 MemberName: 'MemberName', 
//                 Status: 'Status', 
//                 City: 'City', 
//                 Email: 'Email', 
//                 Phone: 'Phone', 
//                 ExpiredOn: 'ExpiredOn',
//                 EliminatedOn: 'EliminatedOn'
//             }
//     }

//     static headerColumnNames = {
//         MemberId: 'MemberId', 
//         MemberName: 'MemberName', 
//         Status: 'Status', 
//         City: 'City', 
//         Email: 'Email', 
//         Phone: 'Phone', 
//         ExpiredOn: 'ExpiredOn',
//         EliminatedOn: 'EliminatedOn'
//     }
    
//     // @ts-ignore
//     static Get(where) {
//         if(where && isObject(where))
//         {
//             let members = [];
//             let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
//             let dataTableItems = table.select(where).items;

//             dataTableItems.forEach(item => members.push(new Members(item)));

//             return members;
//         }
//         else
//         {
//             let members = [];
//             let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
//             let dataTableItems = table.items;

//             dataTableItems.forEach(item => members.push(new Members(item)));

//             return members;
//         }
//     }

//     // @ts-ignore
//     static GetById(Id) {

//         let membersWithSameId = this.Get({header:Id});

//         if(membersWithSameId && membersWithSameId.length > 0)
//             return membersWithSameId[0];

//         return null;
//     }

//     Add(member)
//     {
//         let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
//         table.Add(member);
//         table.commit();
//     }

//     AddOrUpdate() {
//         if(this.MemberId)
//         {
//             this.SaveChanges();
//         }
//         else
//         {
//             let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
//             let member = 
//             {
//                 this._headerColumnNames.MemberId : this.MemberId,

//             };
//             table.Add();
//             table.commit();

//         }
//     }

//     SaveChanges() {
//         this._dataTableItem.commit();
//     }

//     Getter(key)
//     {
//         if (Utility.IsValueNullEmptyUndefied(this._dataTableItem)) return null;

//         return {
//             Value :  this._dataTableItem.getFieldValue(key),
//             Background :  this._dataTableItem.getFieldBackground(key),
//             FontColor :  this._dataTableItem.getFieldFontColor(key)
//         };
//     }

//     Setter(key, val)
//     {
//         if(Array.isArray(val))
//         {
//             let value = null;
//             let backGround = null;
//             let fontColor = null;

//             [value, backGround, fontColor] = val;

//             if(!Utility.IsValueNullEmptyUndefied(value))
//             this._dataTableItem.setFieldValue(key, value);

//             if(!Utility.IsValueNullEmptyUndefied(backGround))
//                 this._dataTableItem.setFieldBackground(key, backGround);

//             if(!Utility.IsValueNullEmptyUndefied(fontColor))
//                 this._dataTableItem.setFieldFontColor(key, fontColor);
//         }
//        else
//        {
//             if(!Utility.IsValueNullEmptyUndefied(val))
//                 this._dataTableItem.setFieldValue(key, val);
//        }
//     }
// }
