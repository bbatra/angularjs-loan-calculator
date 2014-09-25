loanApp.service('CalculateService', function($log)
{

    this.calc = function(loan)
    {
        var type = loan.interestType;
        var amt = loan.amount;
        var dp = loan.downPayment;
        var rate = loan.rate;
        var time = loan.termLength;
        var yearType = loan.yearType;
        var paydate = loan.startdate; //first of every month - hardcoded temporarily - later - give user option from form



        if (type === "simple")
        {
            return this.simple(amt, rate, time, dp, yearType, paydate);
        }
        else if (type === "compound")
        {
            return this.compound(amt, rate, time, dp, yearType, paydate);
        }

        return "ERR";
    }

    this.dateDifference = function(startdate, enddate)
    {
        var j = 0;
        var start = new Date(startdate);
        var end = new Date(enddate)
        while(start < end)
        {
            j++;
            start = new Date(start.setDate(start.getDate()+Number(1)));
        }
        $log.info("Date Diff = " + (Number(j)+Number(1)));
        return j;

    }

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
        //$log.info("YEARDIFF: " + ydiff);
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

    this.simple = function(amt, rate, time, downpayment, ytype, payDate)
    {
        if(rate===0)
        {
            var newamount = Number(amt) - Number(downpayment);
            var result = newamount/Number(time);
            return result;
        }
        var monthlyrate = (rate * 0.01) / 12;
        var newamount = Number(amt) - Number(downpayment);
        var calcterm =  Number(monthlyrate) + Number(1);
        var calcpower = Math.pow(calcterm, time);
        var magicterm = (calcpower * monthlyrate)/(Number(calcpower) - Number(1));
        var totalmonthlypayment =  newamount * magicterm;
        var disp_totalmonthlypayment = parseFloat(Math.round(totalmonthlypayment * 100) / 100).toFixed(2);

        $log.info(disp_totalmonthlypayment);

        return totalmonthlypayment;


    }

    this.compound = function(amt, rate, time, downpayment, ytype, payDate)
    {

        var monthlyrate = (Number(rate) * Number(0.01))/ Number(12);//rate is a percentage
        var remaining = Number(amt) - Number(downpayment);

        var calcterm = Math.pow(Number(monthlyrate) +Number(1), time);
        var totalmonthlypayment = (remaining * monthlyrate * calcterm)/(Number(calcterm) - Number(1));
        var disp_totalmonthlypayment = parseFloat(Math.round(totalmonthlypayment * 100) / 100).toFixed(2);

        $log.info(disp_totalmonthlypayment);


        return totalmonthlypayment;
    }

});