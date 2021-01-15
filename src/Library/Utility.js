class Utility {
    static GetCurrentDateTime() {
        return Utilities.formatDate(new Date(), "GMT+05:30", "dd-MMM-yyyy hh:mm:ss a"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }

    static GetDateFormatted(date) {
        return Utilities.formatDate(date, "GMT+05:30", "dd-MMM-yyyy hh:mm:ss a"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }

    static FormatToDate(date) {
        return Utilities.formatDate(date, "GMT+05:30", "dd-MMM-yyyy"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }

    static subDaysFromDate(date, d) {
        // d = number of day ro substract and date = start date
        return new Date(date.getTime() - d * (24 * 3600 * 1000));
    }

    static GetDateBeforeDays(days) {
        return this.subDaysFromDate(new Date(), days);
    }

    static AreDateEqual(dateVal1, dateVal2) {

       let date1 = new Date(dateVal1);
       let date2 = new Date(dateVal2);

       return ( date1.getDay() == date2.getDay()
          && date1.getMonth() == date2.getMonth()
          && date1.getFullYear() == date2.getFullYear()
          );
    }

    static ObjectPropertiesToList(object) {
        var keys = Object.keys(object);
        var propertyList = [];

        keys.map(x => propertyList.push(object[x]));

        return propertyList;
    }

    static PurageObjectHavingArrayIndcluded(object) {

        var returnObject = {};

        for (var key in object) {
            returnObject[key] = object[key];
        }

        return returnObject;
    }
}
