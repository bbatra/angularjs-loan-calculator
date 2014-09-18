var loanApp = angular.module('app', []);
loanApp.controller("altCtrl", function($scope, $log, CalculateService)
{

    $scope.result;
    $scope.totalmonthlypayment;
    $scope.monthlyinterest;
    $scope.monthlybasepayment;

    $scope.monthlyInfo = [];//first month only for test

    $scope.termType = "months";
    $scope.interestType = "simple";
    $scope.yearType = "bankyear";
    $scope.format = "dd/mm/yyy";
    $scope.finalpayment;


    $scope.formatDate = function(date)
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

        //$log.info("NEW DATE: " + mm + '/' + dd + '/' + yyyy);

        return (mm + '/' + dd + '/' + yyyy);

    }
    $scope.dateChange = function()
    {
        $log.info ("DATE CHANGED");
        $scope.apply;
    }

    $scope.startdate= $scope.formatDate(new Date());
    //$scope.startdate= "02/07/2014";


//    $scope.setDate = function()
//    {
//        var today = new Date();
//        var dd = today.getDate();
//        var mm = today.getMonth()+1;
//        var yyyy = today.getFullYear();
//        if(dd<10)
//        {
//            dd = '0' + dd;
//        }
//        if(mm<10)
//        {
//            mm= '0' + mm;
//        }
//
//        return (mm + '/' + dd + '/' + yyyy);
//    }

    //$scope.startdate = $scope.formatDate(new Date());


    $scope.loan =
	{
			name  : "John Doe",
			amount  : "0.00",
            downPayment: "0.00",
			interestType  : "simple",
			yearType  : "bankyear",
			termLength  : "12",
			rate  : "0.0",
            startdate: $scope.startdate
	};

	$scope.enter = function(data)
	{
        var self = this;

        $log.info("DATE ENTERED: " + self.startdate);

//        var name = self.name;
//        var amount = self.amount;
//        var downPayment = self.downPayment;
//        var interestType = self.interestType;
//        var yearType = self.yearType;
//        var termLength = self.termLength;
//        var rate = self.rate;
//        var startdate = self.startdate;


		if (angular.isUndefined(self.name) || self.name ===null)
		{
            self.name = "Unnamed Account";
		}
		if (angular.isUndefined(self.amount) || self.amount ===null)
		{
            self.amount = 0.0;
		}
        if (angular.isUndefined(self.downPayment) || self.downPayment ===null)
        {
            self.downPayment = 0.0;
        }
		if (angular.isUndefined(self.interestType) || self.interestType ===null)
		{
            self.interestType = "simple";
		}
		if (angular.isUndefined(self.yearType) || self.yearType ===null)
		{
            self.yearType = "bankyear";
		}
		if (angular.isUndefined(self.termLength) || self.termLength ===null)
		{
            self.termLength = 12;
		}
		if (angular.isUndefined(self.termType) || self.termType ===null)
		{
			self.termType = "months";
		}
		else if(self.termType === "years")
		{
            self.termLength = self.termLength * 12;
            self.termType === "months";
		}

		if (angular.isUndefined(self.rate) || self.rate ===null)
		{
            self.rate = 0.00;
		}

        if (angular.isUndefined(self.startdate) || self.startdate ===null)
        {
            self.startdate = self.formatDate(new Date());
        }

		self.loan = 
		{
			name  : self.name,
            downPayment: self.downPayment,
			amount  : self.amount,
			interestType  : self.interestType,
			yearType  : self.yearType,
			termLength  :  self.termLength,
			rate  : self.rate,
            startdate: self.formatDate(self.startdate)
		};

        var calcresult = CalculateService.calc(self.loan);
        if(isNaN(calcresult))
        {
            calcresult=0;
        }
        self.totalmonthlypayment = calcresult;

        self.monthlybasepayment = (Number(self.amount) - Number(self.downPayment)) / self.termLength;
        self.monthlyinterest = self.totalmonthlypayment - self.monthlybasepayment;


        self.monthlyInfo = self.getMonthlyInfo();
        $log.info("CALCRESULT: " + self.totalmonthlypayment);


	}

    $scope.clear = function()
    {
        this.startdate = this.formatDate(new Date());
        this.name = null ;
        this.amount  = null;
        this.downPayment= null;
        this.interestType  = "simple";
        this.yearType  = "bankyear";
        this.termLength = null;
        this.termType = "months"
        this.rate  = null;
    }

    $scope.getLastDateOfMonth= function(startdate, ytype)
    {
        var self = this;
        if(ytype === "fullyear")
        {
            var nextmonth =  CalculateService.addMonthsToDate(startdate, Number(1));
            var lastdate = new Date(new Date(nextmonth).setDate(new Date(nextmonth).getDate() - Number(1)));

        }
        else
        {
            var lastdate = new Date(new Date(startdate).setDate(new Date(startdate).getDate() + Number(29)));
        }

        return self.formatDate(lastdate);


    }



    $scope.getDailyAmount = function(startdate, lastdate, total)
    {
        var self = this;
        var days = CalculateService.dateDifference(startdate, lastdate) + Number(1);
        var dailytotal = Number(total) / Number(days);
        return dailytotal;
    }

    $scope.getMonthlyInfo = function()
    {
        var i = 0;
        var self = this;
        var start = self.startdate;
        var ytype = self.yearType;
        var mtotal = Number(self.totalmonthlypayment);
        var base = self.monthlybasepayment;
        var minterest = Number(self.monthlyinterest);
        var totalpaidsofar = Number(self.downPayment);
        var monthlyInfo = [];
        var dailysofar = totalpaidsofar;//both start off equal to downpayment


        while(i < self.termLength)
        {
            $log.info("Start DATE:" + i + "is :"  + start);

            var end = self.getLastDateOfMonth(start, ytype);
            $log.info("LAST DATE:" + i + "is :"  + end);

            var dailyarr = [];
            //var dailyamt = parseFloat(Math.round(self.getDailyAmount(start, end, mtotal) * 100) / 100).toFixed(2);
            var dailyamt = self.getDailyAmount(start, end, mtotal);
            var date = self.formatDate(new Date(start));
            var j = CalculateService.dateDifference(date, end);
            //$log.info("Date Diff:  " + i + "is :" + j);

            while(j>=0)
            {
                dailysofar += Number(dailyamt);
                var dailyobj =
                {
                    day: date,
                    amount: parseFloat(Math.round(dailyamt * 100) / 100).toFixed(2),
                    paidsofar: parseFloat(Math.round(dailysofar * 100) / 100).toFixed(2)
                };
                dailyarr.push(dailyobj);
                date = self.formatDate(new Date(new Date(date).setDate(new Date(date).getDate() + Number(1))));
                j--;
            }




            var monthobj =
            {
                startdate: start,
                enddate: end,
                totalpayment: parseFloat(Math.round(mtotal * 100) / 100).toFixed(2),
                monthlyinterest: parseFloat(Math.round(minterest * 100) / 100).toFixed(2),
                dailytotal: parseFloat(Math.round(dailyamt * 100) / 100).toFixed(2),
                paidsofar: parseFloat(Math.round(totalpaidsofar * 100) / 100).toFixed(2),
                dailyinfo: dailyarr
            };
            monthlyInfo.push(monthobj);


            totalpaidsofar += Number(mtotal);

            start = new Date(end);
            start = self.formatDate(new Date(start.setDate(start.getDate()+Number(1))));

            i++;


        }
        self.finalpayment = totalpaidsofar;
        return monthlyInfo;
    }
});loanApp.service('CalculateService', function($log)
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

    this.getTotalDays = function(startdate, months)//get number of days from a date until end of term
    {
        var enddate = this.addMonthsToDate(startdate, months);

        //$log.info("START DATE:" + startdate);
        //$log.info("END DATE:" + enddate);

        var diffDays = this.dateDifference(startdate, enddate);

        //$log.info("diff: " + diffDays);

        return diffDays;


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

//        var dailyinterest;
//        var total;
//        var remaining;
//        var newamount = amt - downpayment;
//        var dailyrate;//rate is a percentage
//        var totalDays = 1;
//        var yeardays = 365;//number of days in current year
//        var monthlypayment;
//        var startdate = new Date(payDate);
//        var result;
//
//        //$log.info("START DATE: " + startdate + "    RATE: " + rate);
//
//        var finaldate = this.addMonthsToDate(startdate, time);
//
//        var disp_monthlypayment = parseFloat(Math.round(monthlypayment * 100) / 100).toFixed(2);

//        if (ytype==="bankyear")
//        {
//            monthlypayment = newamount/time;
//            var dailypayment = monthlypayment/30;
//            dailypayment = parseFloat(Math.round(dailypayment * 100) / 100).toFixed(2);
//            yeardays = 360;
//            dailyrate = Number(rate * 0.01) / Number(yeardays);//constant interest rate per day
//            var monthlyrate = dailyrate * 30;
//            var totalmonthlyinterest = 0.00;
//            lastdate = new Date(new Date().setDate(new Date(startdate).getDate() + 30));
//
//            var i=0;
//            while (i<time)
//            {
//                monthlyinterest = monthlyrate * newamount;
//                totalmonthlyinterest += Number(monthlyinterest);
//                var dailyinterest = monthlyinterest/Number(30);
//                var disp_dailyinterest = parseFloat(Math.round(dailyinterest * 100) / 100).toFixed(2);
//
//                newamount = newamount - monthlypayment;
//
//                disp_monthlyinterest = parseFloat(Math.round(monthlyinterest * 100) / 100).toFixed(2);;
//                disp_newamount = parseFloat(Math.round(newamount * 100) / 100).toFixed(2);
//                disp_monthlypayment = parseFloat(Math.round(monthlypayment * 100) / 100).toFixed(2);
//
//                //$log.info("START: " + startdate + " END: " + lastdate);
//                //$log.info("Monthly Payment: " + monthlypayment + " Monthly interest: " + monthlyinterest + " Amount remaining: " + disp_newamount);
//
//
//
//                 //CODE TO SEND BACK OBJECT TO CONTROLLER
//                /*if(i===0)
//                    result = [{"duedate: " : lastdate, "monthlypayment" : disp_monthlypayment,
//                                "monthlyinterest" : disp_monthlyinterest, "dailypayment": dailypayment,
//                                 "dailyinterest" : disp_dailyinterest, "remaining" : disp_newamount}];
//                else
//                    result.push({"duedate: " : lastdate, "monthlypayment" : disp_monthlypayment,
//                        "monthlyinterest" : disp_monthlyinterest, "dailypayment": dailypayment,
//                        "dailyinterest" : disp_dailyinterest, "remaining" : disp_newamount});*/
//                if(i===0)
//                {
//                    var startArr = [startdate];
//                    var lastArr = [lastdate];
//                }
//                else
//                {
//                   startArr.push(startdate);
//                   lastArr.push(lastdate);
//                }
//
//                startdate = new Date(lastdate);
//                lastdate = new Date(lastdate);
//                lastdate = new Date(lastdate.setDate(new Date(startdate).getDate() + 30));
//                i++;
//            }
//
//            var avginterest = totalmonthlyinterest/time;
//            var totalmonthlypayment = Number(monthlypayment)+Number(avginterest);
//
//            $log.info("TOTAL PAYMENT = " + parseFloat(Math.round((totalmonthlypayment) * 100) / 100).toFixed(2));
//
//            result = [startArr, lastArr, totalmonthlypayment];
//            return result;
//            //return result= Number(avginterest)+Number(monthlypayment);
//        }
//        else
//        {
//            //if(new Date().getDay()===1)
//                monthlypayment = newamount/time;
//            //else
//            //    monthlypayment = newamount/(Number(time)+ Number(2));//if it isn't 1st, we split payment
//            // into shorter months at end and beginning of term
//            //yeardays = ((Number(new Date().getFullYear()) % Number(4)) === 0) ? 366 : 365;//check for leapyear
//
//            //var newday = 1;
//            /*var newday = startdate.getDate();
//            var newmonth = (Number(startdate.getMonth()) + Number(1)) % 12;
//            var ydiff = Math.ceil((Number(startdate.getMonth()) + Number(1)) / 12) - 1;
//            var newyear = Number(startdate.getFullYear()) + Number(ydiff);
//            */
//            var lastdate = this.addMonthsToDate(startdate, 1);
//            var i = 0;
//            var totalmonthlyinterest = 0;
//            avginterest = 0;
//
//            while (lastdate < finaldate)
//            {
//                yeardays = ((Number(new Date(startdate).getFullYear()) % Number(4)) === 0) ? 366 : 365;
//                dailyrate = Number(rate * 0.01) / Number(yeardays);
//                dailyinterest = Number(dailyrate) * newamount;
//
//                //$log.info("Daily Rate: " + dailyrate + "   Daily interest: " + dailyinterest);
//
//                var numdays = this.dateDifference(startdate, lastdate);
//                var dailypayment = Number(monthlypayment)/Number(numdays);
//                var monthlyinterest = Number(numdays) * Number(dailyinterest);
//                totalmonthlyinterest += Number(monthlyinterest);
//                var disp_monthlyinterest = parseFloat(Math.round(monthlyinterest * 100) / 100).toFixed(2);
//
//                //$log.info("Monthly Interest + Payment due on date" + lastdate + " is " + disp_monthlypayment + " + " + disp_monthlyinterest);
//
//                newamount = Number(newamount)  - Number(monthlypayment);
//                var disp_newamount = parseFloat(Math.round(newamount * 100) / 100).toFixed(2);
//
//                //$log.info("Amount Remaining" + disp_newamount);
//
//                /*if(i===0)
//                    result = [{"duedate: " : startdate, "monthlypayment" : monthlypayment,
//                        "monthlyinterest" : monthlyinterest, "dailypayment": dailypayment,
//                        "dailyinterest" : dailyinterest, "remaining" : disp_newamount}];
//                else
//                    result.push({"duedate: " : lastdate, "monthlypayment" : monthlypayment,
//                        "monthlyinterest" : monthlyinterest, "dailypayment": dailypayment,
//                        "dailyinterest" : dailyinterest, "remaining" : disp_newamount});
//                */
//
//                if(i===0)
//                {
//                    var startArr = [startdate];
//                    var lastArr = [lastdate];
//                }
//                else
//                {
//                    startArr.push(startdate);
//                    lastArr.push(lastdate);
//                }
//
//
//                startdate = lastdate;
//                lastdate = this.addMonthsToDate(lastdate, 1);
//                i++;
//            }
//
//            lastdate = finaldate;
//            startArr.push(startdate);
//            lastArr.push(lastdate);
//            yeardays = ((Number(new Date(startdate).getFullYear()) % Number(4)) === 0) ? 366 : 365;
//            dailyrate = Number(rate * 0.01) / Number(yeardays);
//            dailyinterest = Number(dailyrate) * newamount;
//            var numdays = this.dateDifference(startdate, lastdate);
//            var monthlyinterest = Number(numdays) * Number(dailyinterest);
//
//            monthlyinterest = parseFloat(Math.round(monthlyinterest * 100) / 100).toFixed(2);
//
//            totalmonthlyinterest += Number(monthlyinterest);
//            avginterest = totalmonthlyinterest/time;
//            var totalmonthlypayment = Number(monthlypayment) + Number(avginterest);
//
//            $log.info("TOTAL PAYMENT = " + parseFloat(Math.round((totalmonthlypayment) * 100) / 100).toFixed(2));
//
//            //$log.info("Monthly Interest + Payment due on date" + finaldate + " is " + disp_monthlypayment + " + " + monthlyinterest);
//
//            newamount = Number(newamount) -  Number(monthlypayment);
//            disp_newamount = parseFloat(Math.round(newamount * 100) / 100).toFixed(2);
//
//            //$log.info("Amount Remaining" + disp_newamount);
//
//            /*result.push({"duedate: " : lastdate, "monthlypayment" : monthlypayment,
//                "monthlyinterest" : monthlyinterest, "dailypayment": dailypayment,
//                "dailyinterest" : dailyinterest, "remaining" : disp_newamount});
//            */
//
//            result = [startArr, lastArr, totalmonthlypayment];
//
//            return result;
//
//        }
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