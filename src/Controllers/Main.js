function tableClassQuickstart() {
    // Let's create a table and search for Philippe.
//     var sheetName = 'Members';
//     var headerRow = 1;
//     var table = Sheetfu.getTable(sheetName, headerRow);       
//     var item = table.select([{"MemberId": "M200"}]).first();
    
//     // get values, notes, etc..
//     var Status = item.getFieldValue("Status");  // 36
//    // var ageNote = item.getFieldNote("age");
//    // var ageBackground = item.getFieldBackground("age");
    
//      //More importantly, we can set values, colors, notes.
//      item.setFieldNote("Status", "His birthday is coming soon")  
//          .setFieldValue("Status", 37) 
//          .setFieldBackground("Status", "light red")  
//     // .commit()  
//          Status = item.getFieldValue("Status");  // 36
    
//     DataProvider.Alert(Status);
//     item.commit();
//     console.log(table.header);
//     return '';

let members = Members.Get();
console.log(members[0].MemberId.Value);

members.forEach(x=>x.MemberId)

members[0].MemberId = 38;// [null,'white','red'];
members[0]._dataTableItem.commit();
//console.log(members[0].MemberId.Value);

let table = Sheetfu.getTable(SheetDcoument.MEMBERS, 1);
table.commit();

}