
  module.exports = {
     getReportDate(dateRange) {
       var start = Date.now();
       var end = 0;
       var datesArray = [];
       if (typeof dateRange === 'number') {
         end = new Date(start).getTime() + dateRange * 24 * 60 * 60 * 1000;
         end = new Date(end).getTime();
       } else if (Array.isArray(dateRange)) {
         start = new Date(dateRange[0]).getTime();
         end = new Date(dateRange[1]).getTime();
       }
       do
       {
         datesArray.push(new Date(start).getFullYear() + '-' + (new Date(start).getMonth() + 1) + '-' + new Date(start).getDate());
         start += 1 * 24 * 60 * 60 * 1000;
       }
       while (end > start);

       return datesArray;
     },
     getReportOrderCout(dateLen) {
       dateLen = this.getDateRangeLen(dateLen);
       var countArray = [];
       do
       {
         var count = 10 + Math.random() * 1000;
         countArray.push(parseInt(count));
         dateLen--;
       }
       while (dateLen > 0);
       return countArray;
     },
     getReportOrderMoney (dateLen) {
       dateLen = this.getDateRangeLen(dateLen);

       var moneyArray = [];
       do
       {
         var count = 10000 + Math.random() * 400000;
         moneyArray.push(parseInt(count));
         dateLen--;
       }
       while (dateLen > 0);
       return moneyArray;
     },
     getDateRangeLen (dataRange) {
       return Array.isArray(dataRange) ? (dataRange[1] - dataRange[0]) / 1000 / 60 / 60 / 24 : dataRange;
     }
   }


