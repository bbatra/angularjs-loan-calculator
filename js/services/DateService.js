loanApp.service('DateService', function($log)
{

	this.addMonthsToDate = function (startdate, months)
    {
        var dd = new Date(startdate).getDate();
        var mm = Number(new Date(startdate).getMonth())+Number(1); //January is 0!
        var yyyy = new Date(startdate).getFullYear();
        var nm = (Number(mm)+Number(months))%12;//new month for end date
        if (nm===0)
        {
            nm = 12;
        }

        var ydiff =  Math.ceil((Number(mm)+Number(months))/12) - Number(1);//difference in the year number

        var nyyy = Number(yyyy) + Number(ydiff);
        var nd = dd;//day is the same since we are only adding whole months right now

        if(nd<10)
        {
            nd = '0' + nd;
        }
        if(nm<10)
        {
            nm= '0' + nm;
        }
        var enddate = nm + '/' + nd + '/' + nyyy;

        return enddate;

    }

     this.getLastDateOfMonth= function(startdate, ytype)
    {
        var self = this;
        if(ytype === "fullyear")
        {
            var nextmonth =  this.addMonthsToDate(startdate, Number(1));
            var lastdate = new Date(new Date(nextmonth).setDate(new Date(nextmonth).getDate() - Number(1)));

        }
        else
        {
            var lastdate = new Date(new Date(startdate).setDate(new Date(startdate).getDate() + Number(29)));
        }

        return this.formatDate(lastdate);
    }

    this.formatDate = function(date)//put in date service
    {
        date = new Date(date);
        var dd = date.getDate();
        var mm = date.getMonth()+Number(1);
        var yyyy = date.getFullYear();
        if(dd<10)
        {
            dd = '0' + dd;
        }
        if(mm<10)
        {
            mm= '0' + mm;
        }

        return (mm + '/' + dd + '/' + yyyy);

    }

    this.getMonthData = function(date, monthsToAdd)//put in date service
    {

        date = new Date(date);
        var month = new Array();
        month[0] =
        {
            name: "January",
            days: 31
        };
        month[1] =
        {
            name: "February",
            days: 28
        };

        month[2] =
        {
            name: "March",
            days: 31
        };

        month[3] =
        {
            name: "April",
            days: 30
        };

        month[4] =
        {
            name: "May",
            days: 31
        };

        month[5] =
        {
            name: "June",
            days: 30
        };

        month[6] =
        {
            name: "July",
            days: 31
        };
        month[7] =
        {
            name: "August",
            days: 31
        };

        month[8] =
        {
            name: "September",
            days: 30
        };

        month[9] =
        {
            name: "October",
            days: 31
        };

        month[10] =
        {
            name: "November",
            days: 30
        };

        month[11] =
        {
            name: "December",
            days: 31
        };
        if(monthsToAdd===null || angular.isUndefined(monthsToAdd))
            var result = month[date.getMonth()];
        else
            var result = month[(date.getMonth() + Number(monthsToAdd))%12]
        return result;
    }

    this.getValidDate = function(date, monthsToAdd)//put in date service - also edit calculate service to separate date components
    {
        var self = this;
        var currentDate = new Date(date);
        var dd = currentDate.getDate();
        var dayNum = dd;
        var mm = currentDate.getMonth() + Number(1);
        var yyyy = currentDate.getFullYear();
        var newMonth = this.getMonthData(currentDate, monthsToAdd);

        if (Number(dd)>newMonth.days)
        {
            dd = newMonth.days;
        }

        if(Number(yyyy) % Number(4) === 0 && dd === 28 && dayNum > 28)
        {
            dd = 29;
        }


        if(dd<10)
        {
            dd = '0' + dd;
        }
        if(mm<10)
        {
            mm= '0' + mm;
        }


        return this.addMonthsToDate((mm+'/'+dd+'/'+yyyy), monthsToAdd);
    }

    this.setStartDate = function()//put in date controller & edit setStartDate
    {
        var today = new Date();
        var mm = Number(today.getMonth())+Number(2);//default start date is first day of next month
        var dd = '01';
        var yyyy = today.getFullYear();
        return (mm + '/' + dd + '/' + yyyy);


    }

});