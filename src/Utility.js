class Utility {
 static GetCurrentDateTime()
    {
        let timeZone = "GMT+" + new Date().getTimezoneOffset()/60;
        return Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd HH:mm"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
    }
}
