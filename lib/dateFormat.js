module.exports = {
    /*
    *   
    * 
    */
    sql2date: (date) => {

        return date;
    },
    /*
    *   前端日期格式转化为mysql的datetime    2018-12-11 12:00:00
    * 
    */
    date2sql: (date) => {

        return date;
    },
    /*
    *   2018-12-01 12:09:12  ===> return new Date(2012, 11, 21, 5, 30, 0);
    * 
    */
    date2task: (date) => {
        var oDate = new Date(date);
        return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), oDate.getHours(), oDate.getMinutes(), oDate.getSeconds());
    }
}