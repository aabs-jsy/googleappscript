/* APPLICATION CONSTANTS */
var memberIdRegx = '([M][0-9]+$)';   //"/([M][0-9]+$)/g"

/* SHEET COLUMNS NAMES */
var memberIdColumnName = "MemberId";
var memberNameColumnName = "MemberName";
var memberStatusColumnName = "Status";

var sheetColumns = [];
sheetColumns.push({columnName:memberIdColumnName, index: 1});
sheetColumns.push({columnName:memberNameColumnName, index: 2});
