class Library {

  static GetActiveSheet() {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  static Toast(message) {
    SpreadsheetApp.getActive().toast(message);
  }

  static Alert(message) {
    SpreadsheetApp.getUi().alert(message);
  }

  static IsValueNullEmptyUndefied(value) {
    return (value == null || value == '' || value == undefined);
  }

  static MatchWithRegx(stringValue, pattern) {
    var regExp = new RegExp(pattern);
    return regExp.test(stringValue);
  }

  static AreStringsEqual(string1, string2)
  {
    return (string1.localeCompare(string2) == 0);
  }

  static GetRangeFromActiveSpreadSheet(rowStart, colStart, rowEnd, colEnd) {
    var activeSheet = this.GetActiveSheet();
    return activeSheet.getRange(rowStart, colStart, rowEnd, colEnd).getValues();
  }

  static GetSheetRowColumnDetails() {
    var activeSheet = this.GetActiveSheet();
    var returnObject = {};

    returnObject.firstRow = 2;
    returnObject.lastRow = activeSheet.getLastRow();
    returnObject.firstColumn = 1;
    returnObject.lastColumn = activeSheet.getLastColumn();

    return returnObject;
  }

  static ObjectPropertiesToList(object) {
    var keys = Object.keys(object);
    var propertyList = [];
    
    keys.map(x=> propertyList.push(object[x]));

    return propertyList;
  }

  static GetRowObjectsByColumns(rowStart = null, rowEnd = null) {
   
      var sheetRowColumnDetails = this.GetSheetRowColumnDetails();

      var rangeData = Library.GetRangeFromActiveSpreadSheet(
        rowStart == null ? sheetRowColumnDetails.firstRow : rowStart,
        sheetRowColumnDetails.firstColumn,
        rowEnd == null ? sheetRowColumnDetails.lastRow : rowEnd,
        sheetRowColumnDetails.lastColumn
      );

      var sheetColumnHeaderAndIndexList = this.ObjectPropertiesToList(AppConfig.SheetColumnHeaderAndIndexes); //sheetColumns.filter((x) => argsColumns.indexOf(x.columnName) > -1);

      var rows = [];

      rangeData.forEach((row, index) => {
        var rowItem = {};

        rowItem.index = index;

        sheetColumnHeaderAndIndexList.map((x => rowItem[x.header] = row[x.index-1]));

        rows.push(rowItem);
      });

      return rows;
  }

  static GetSignleColumnValuesToArray(columnIndex = null, rowStart = null, rowEnd = null) {
    var sheetRowColumnDetails = this.GetSheetRowColumnDetails();
    var rangeData = this.GetRangeFromActiveSpreadSheet(
      rowStart == null ? sheetRowColumnDetails.firstRow : rowStart,
      columnIndex == null ? sheetRowColumnDetails.firstColumn : columnIndex,
      rowEnd == null ? sheetRowColumnDetails.lastRow : rowEnd,
      columnIndex == null ? sheetRowColumnDetails.firstColumn : columnIndex,
    );

    var rows = [];

    rangeData.forEach((row, index) => {
      rows.push(row[0]);
    });

    return rows;
  }

  static GetCellValue(rowNumber = null, columnNumber = null) {
    return new Promise(function (resolve, reject) {

      var sheetRowColumnDetails = this.GetSheetRowColumnDetails();

      var rangeData = this.GetRangeFromActiveSpreadSheet(
        rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
        columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
        rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
        columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      );

      resolve(rows[0][0]);
    });
  }

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