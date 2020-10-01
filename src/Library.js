function GetActiveSheet()
{
   return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

function Toast(message)
{
  SpreadsheetApp.getActive().toast(message);
}

function IsValueNullEmptyUndefied(value)
{
  return (value == null || value == '' || value == undefined);
}

function MatchWithRegx(stringValue,pattern)
{
  Toast(stringValue);
  var regExp = new RegExp(pattern);
  return regExp.test(stringValue);
}

function GetRangeFromActiveSpreadSheet(rowStart, colStart, rowEnd, colEnd)
{
  var activeSheet = GetActiveSheet();
  return activeSheet.getRange(rowStart,colStart,rowEnd,colEnd).getValues();
}

function GetSheetRowColumnDetails()
{
  var activeSheet = GetActiveSheet();
  var returnObject = {};
  
  returnObject.firstRow = activeSheet.GetFirstRow()
  returnObject.lastRow = activeSheet.getLastRow()
  returnObject.firstColumn = activeSheet.GetFirstRow()
  returnObject.lastColumn = activeSheet.getLastRow()

  return returnObject;
}

async function GetRowObjectsByColumns(...argsColumns)
{
  return new Promise(function(resolve, reject) {
    
    var sheetRowColumnDetails = GetSheetRowColumnDetails();
  
    var rangeData = GetRangeFromActiveSpreadSheet(
      sheetRowColumnDetails.firstRow, 
      sheetRowColumnDetails.firstColumn, 
      sheetRowColumnDetails.lastRow, 
      sheetRowColumnDetails.lastColumn
      );

      var filteredSheetColumns = sheetColumns.filter((x)=> argsColumns.indexOf(x.columnName)>-1 );
  
      var rows = [];

      rangeData.forEach((row,index)=>
      {
        var rowListItem = {};

        rowListItem.index = index;

        filteredSheetColumns.map((x=> rowListItem[x.columnName] = row[x.index]));
        
        rows.push(rowListItem);
      });

      resolve(rows);
  });
}



/*
function showDialog() {

  var ui = SpreadsheetApp.getUi();
  // Display a modal dialog box with custom HtmlService content.
  var htmlOutput = HtmlService
    .createHtmlOutput('<img src=https://i.stack.imgur.com/AuqJU.gif>')
    .setWidth(250)
    .setHeight(300);
  ui.showModalDialog(htmlOutput, 'Script Running');
*/

//}