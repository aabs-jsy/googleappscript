class DataProvider {
  static GetSheetByName(sheetName = null) 
  {
    return SpreadsheetApp
      .getActive()
      .getSheetByName(sheetName);
  }

  static GetActiveSheet() 
  {
    return SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();
  }

  static GetRangeFromSpreadSheet(sheet = null, rowStart, colStart, numRows, numColumns) 
  {
    if (!sheet) sheet = this.GetActiveSheet();
    return sheet.getRange(rowStart, colStart, numRows, numColumns);
  }

  static GetRangeValuesFromSpreadSheet(sheet = null, rowStart, colStart, numRows, numColumns) 
  {
    return this.GetRangeFromSpreadSheet(sheet, rowStart, colStart, numRows, numColumns)
    .getValues();
  }

  static GetSheetRowColumnDetails(sheet = null) 
  {
    var activeSheet = (sheet ? sheet : this.GetActiveSheet());
    var returnObject = {};
    
    returnObject.firstRow = 2;
    returnObject.lastRow = activeSheet.getLastRow();
    returnObject.firstColumn = 1;
    returnObject.lastColumn = activeSheet.getLastColumn();
    
    return returnObject;
  }

  static GetSignleColumnValuesToArray(sheet = null, columnNumber = null, rowStart = null, numRows = null) {
    var sheetRowColumnDetails = this.GetSheetRowColumnDetails(sheet);
    var rangeData = this.GetRangeValuesFromSpreadSheet(
      sheet,
      rowStart == null ? sheetRowColumnDetails.firstRow : rowStart,
      columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      numRows == null ? sheetRowColumnDetails.lastRow : numRows,
      columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      );
      
      var rows = [];
      
      rangeData.forEach((row, index) => {
        rows.push(row[0]);
      });
      
      return rows;
    }
      
  static GetCellValue(sheet, rowNumber = null, columnNumber = null) {
    
    var sheetRowColumnDetails = this.GetSheetRowColumnDetails();
    
    var rangeData = this.GetRangeValuesFromSpreadSheet(
      sheet,
      rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
      columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
      columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      );
      
      return rangeData[0][0];
    } 
    
  static GetHeaderRow(sheet = null) {
    if (!sheet) sheet = this.GetActiveSheet();
    
    var sheetRowColumnDetails = this.GetSheetRowColumnDetails(sheet);
    
    var rangeData = this.GetRangeValuesFromSpreadSheet(sheet, 1, 1, 1, sheetRowColumnDetails.lastColumn);
    
    if (!rangeData) return;
    
    let firstRowData = rangeData[0];
    
    let headerRow = [];
    
    firstRowData.forEach((cell, index) => {
      headerRow.push({ header: cell, index })
    });
    
    return headerRow;
    
  }
      
  static GetRowObjectsByColumns(sheet = null, rowStart = null, numRows = null) {
    
    var sheetRowColumnDetails = this.GetSheetRowColumnDetails(sheet);
    
    var rangeData = DataProvider.GetRangeValuesFromSpreadSheet(
      sheet,
      rowStart == null ? sheetRowColumnDetails.firstRow : rowStart,
      sheetRowColumnDetails.firstColumn,
      numRows == null ? sheetRowColumnDetails.lastRow : numRows,
      sheetRowColumnDetails.lastColumn
      );
      
      var sheetColumnHeaderAndIndexList = this.GetHeaderRow(sheet); //this.ObjectPropertiesToList(AppConfig.SheetColumnHeaderAndIndexes); //sheetColumns.filter((x) => argsColumns.indexOf(x.columnName) > -1);
      
      var rows = [];
      
      rangeData.forEach((row, index) => {
        var rowItem = {};
        
        rowItem = row;
        
        sheetColumnHeaderAndIndexList.map(x => rowItem[x.header] = row[x.index]);
        
        rows.push(rowItem);
      });
      
      return rows;
    }

  static SetCellValue(sheet, value, rowNumber = null, columnNumber = null) {

    var sheetRowColumnDetails = this.GetSheetRowColumnDetails();

    var range = this.GetRangeFromSpreadSheet(
      sheet,
      rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
      columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
      1,
      1
      );
      
      return range.setValue(value);
    } 
      
      
  static Toast(message) {
    SpreadsheetApp.getActive().toast(message);
  }

  static Alert(message) {
    SpreadsheetApp.getUi().alert(message);
  }

  static IsValueNullEmptyUndefied(value) {
    return (!value || value == null || value == '' || value == undefined);
  }

  static MatchWithRegx(stringValue, pattern) {
    var regExp = new RegExp(pattern);
    return regExp.test(stringValue);
  }

  static SetNullToBank(value) {
    return (this.IsValueNullEmptyUndefied(value) ? '' : value);
  }

  static AreStringsEqual(string1, string2) {
    return (string1.localeCompare(string2) == 0);
  }
}
    
      // static SetCellValue(rowNumber = null, columnNumber = null) {
        
        //   var sheetRowColumnDetails = this.GetSheetRowColumnDetails();
        
        //   var rangeData = this.GetRangeFromActiveSpreadSheet(
          //     rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
          //     columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
          //     rowNumber == null ? sheetRowColumnDetails.firstRow : rowNumber,
          //     columnNumber == null ? sheetRowColumnDetails.firstColumn : columnNumber,
          //   );
          
          //   return rangeData[0][0];
          // }
          //}
          
          //}
          
          
          
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