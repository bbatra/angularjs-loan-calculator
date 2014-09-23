loanApp.controller("altCtrl", function($scope, $log, CalculateService)
{

    $scope.result;
    $scope.totalmonthlypayment;
    $scope.totalmonthlypaymentvalue;

    $scope.monthlyinterest;
    $scope.monthlybasepayment;

    $scope.monthlyInfo = [];//first month only for test

    $scope.termType = "months";
    $scope.interestType = "simple";
    $scope.yearType = "fullyear";
    $scope.format = "dd/mm/yyy";
    $scope.finalpayment;
    $scope.express = false;

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

    $scope.expressSettings = function()
    {
        if(this.express === true)
        {
            this.express = false;
        }
        else
        {
            this.express = true;
        }
    }

    //var date = (Number(new Date().getMonth)+Number(2) )+ "/01/" + new Date().getFullYear;

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

    $scope.setStartDate = function()
    {
        var today = new Date();
        var mm = Number(today.getMonth())+Number(2);
        var dd = '01';
        var yyyy = today.getFullYear();
        return (mm + '/' + dd + '/' + yyyy);


    }

    $scope.startdate= $scope.setStartDate();
    //$scope.startdate = $scope.formatDate(new Date());


    $scope.loan =
	{
			name  : "John Doe",
			amount  : "0.00",
            downPayment: "0.00",
			interestType  : "simple",
			yearType  : "fullyear",
			termLength  : "12",
			rate  : "0.0",
            startdate: $scope.startdate
	};

    $scope.isNumber = function(s)
    {
        var x = +s; // made cast obvious for demonstration
        return x.toString() === s;
    }

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
        else if(self.isNumber(self.amount)===false)
        {
            self.amount=0.0;
            $log.info("Incorrect Input Format: Loan amount");
        }

        if (angular.isUndefined(self.downPayment) || self.downPayment ===null)
        {
            self.downPayment = 0.0;
        }
        else if(self.isNumber(self.downPayment)===false)
        {
            self.downPayment=0.0;
            $log.info("Incorrect Input Format: Down Payment");
        }

//		if (angular.isUndefined(self.interestType) || self.interestType ===null)
//		{
//            self.interestType = "simple";
//            $log("interest type defaulted to simple");
//		}

        if (angular.isUndefined(self.yearType) || self.yearType ===null)
		{
            self.yearType = "bankyear";
		}

        if (angular.isUndefined(self.termLength) || self.termLength ===null)
		{
            self.termLength = 12;
		}
        else if(self.isNumber(self.termLength)===false)
        {
            self.termLength=12;
            $log.info("Incorrect Input Format: Term Length");
        }

        if (angular.isUndefined(self.termType) || self.termType ===null)
		{
			self.termType = "months";
		}
		else if(self.termType === "years")
		{
            self.termLength = self.termLength * 12;
            self.termType = "months";
		}

		if (angular.isUndefined(self.rate) || self.rate ===null)
		{
            self.rate = 0.00;
		}
        else if(self.isNumber(self.rate)===false)
        {
            self.rate=0.00;
            $log.info("Incorrect Input Format: Rate");
        }

        if (angular.isUndefined(self.startdate) || self.startdate ===null)
        {
            self.startdate = self.formatDate(new Date());
        }

        if(self.downPayment >= self.amount)
        {
            self.amount = self.downPayment;
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
        self.totalmonthlypaymentvalue = parseFloat(Math.round(calcresult * 100) / 100).toFixed(2);

        self.monthlybasepayment = (Number(self.amount) - Number(self.downPayment)) / self.termLength;
        self.monthlyinterest = self.totalmonthlypayment - self.monthlybasepayment;


        self.monthlyInfo = self.getMonthlyInfo();
        $log.info("CALCRESULT: " + self.totalmonthlypayment);


	}

    $scope.clear = function()
    {
        this.startdate = this.setStartDate();
        this.name = null ;
        this.amount  = null;
        this.downPayment= null;
        this.interestType  = "simple";
        this.yearType  = "fullyear";
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

    $scope.getMonthName = function(date)
    {

        date = new Date(date);
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var name = month[date.getMonth()];
        $log.info("NAME:" + name);
        return name;
    }



    $scope.getDailyAmount = function(startdate, lastdate, total)
    {
        var self = this;
        var days = CalculateService.dateDifference(startdate, lastdate) + Number(1);
        var dailytotal = Number(total) / Number(days);
        return dailytotal;
    }

    $scope.focusChange = function()
    {
        $scope.loan.startdate = document.getElementById("datepicker").value;
        $scope.startdate = document.getElementById("datepicker").value;
        $log.info("STARTDATE:" + $scope.loan.startdate);
    }


    $scope.dateChange = function()
    {
        $log.info ("DATE CHANGED");
        this.focusChange();
    }

    $scope.getMonthlyInfo = function()
    {
        var self = this;

        var i = 0;
        var start = self.loan.startdate;
        var ytype = self.yearType;
        var mtotal = Number(self.totalmonthlypayment);
        var finalAmount = mtotal * self.termLength;
        var base = self.monthlybasepayment;
        var minterest = Number(self.monthlyinterest);
        var totalpaidsofar = Number(self.downPayment);
        var monthlyInfo = [];
        var dailysofar = totalpaidsofar;//both start off equal to downpayment
        var totalremaining = Number(self.amount) - Number(self.downPayment);//total remaining out of amount - used for interest recalculations
        var totalremainingafterpayment = totalremaining;
        var yearlastdate;
        var daysinyear;

        if(self.interestType === "simple") {
            while (i < self.termLength)
            {

                if (ytype === "fullyear")
                {
                    yearlastdate = CalculateService.addMonthsToDate(start, Number(12));
                    daysinyear = CalculateService.dateDifference(start, yearlastdate);
                    $log.info("START DATE: " + start + "DAYS IN YEAR" + daysinyear);
                }
                else
                {
                    daysinyear = 360;
                }


                $log.info("Start DATE:" + i + "is :" + start);

                var end = self.getLastDateOfMonth(start, ytype);
                $log.info("LAST DATE:" + i + "is :" + end);

                var dailyarr = [];
                var dailyamt = self.getDailyAmount(start, end, mtotal);
                var date = self.formatDate(new Date(start));
                var j = CalculateService.dateDifference(date, end);

                var dailyinterestrate = (Number(self.rate) * 0.01) / Number(daysinyear);

                minterest = totalremaining * (j + Number(1)) * dailyinterestrate;

                totalremainingafterpayment += minterest;

                totalremaining -= Number(mtotal);
                if (totalremaining < Number(0)) {
                    totalremaining = 0;
                }

                // totalremainingafterpayment = totalremainingafterpayment -  Number(mtotal) + minterest;
                totalremainingafterpayment = totalremainingafterpayment -  Number(mtotal);
                if (totalremainingafterpayment < Number(0)) {
                    totalremainingafterpayment = 0;
                }

                var nextstart = new Date(end);
                nextstart = self.formatDate(new Date(nextstart.setDate(nextstart.getDate() + Number(1))));
                var nextend = self.getLastDateOfMonth(nextstart, ytype);
                var k = CalculateService.dateDifference(nextstart, nextend);
                var nextminterest = totalremaining * (k+Number(1)) * dailyinterestrate;

                var dailyinterest = nextminterest/(Number(1)+j);
                var balance = totalremainingafterpayment;


                while (j >= 0)
                {


                    balance += Number(dailyinterest);
                    var dailyobj =
                    {
                        day: date,
                        dailyinterest: parseFloat(Math.round(dailyinterest * 100) / 100).toFixed(2),
                        balance: parseFloat(Math.round(balance * 100) / 100).toFixed(2)
                    };

                    dailyarr.push(dailyobj);
                    date = self.formatDate(new Date(new Date(date).setDate(new Date(date).getDate() + Number(1))));
                    j--;
                }

                if(ytype==="bankyear")
                {
                    dispmonth = self.getMonthName(end);
                }
                else
                {
                    dispmonth = self.getMonthName(start);
                }

                totalpaidsofar += Number(mtotal);
                var monthobj =
                {
                    startdate: start,
                    startdisplay: dispmonth,
                    enddate: end,
                    totalpayment: parseFloat(Math.round(mtotal * 100) / 100).toFixed(2),
                    monthlyinterest: parseFloat(Math.round(minterest * 100) / 100).toFixed(2),
                    dailytotal: parseFloat(Math.round(dailyamt * 100) / 100).toFixed(2),
                    paidsofar: parseFloat(Math.round(totalpaidsofar * 100) / 100).toFixed(2),
                    dailyinfo: dailyarr
                };
                monthlyInfo.push(monthobj);




                start = new Date(end);
                start = self.formatDate(new Date(start.setDate(start.getDate() + Number(1))));

                i++;



            }
        }
        else
        {

            var calcamountremaining = totalremaining;
            while(i < self.termLength)
            {


                var dailyinterestrate;
                if(ytype==="fullyear")
                {
                    yearlastdate = CalculateService.addMonthsToDate(start, Number(12));
                    daysinyear = CalculateService.dateDifference(start, yearlastdate);
                    $log.info("START DATE: " + start + "DAYS IN YEAR" + daysinyear);
                }
                else
                {
                    daysinyear = 360;
                }


                $log.info("Start DATE:" + i + "is :"  + start);

                var end = self.getLastDateOfMonth(start, ytype);
                $log.info("LAST DATE:" + i + "is :"  + end);

                var dailyarr = [];
                //var dailyamt = parseFloat(Math.round(self.getDailyAmount(start, end, mtotal) * 100) / 100).toFixed(2);
                var dailyamt = self.getDailyAmount(start, end, mtotal);
                var date = self.formatDate(new Date(start));
                var j = CalculateService.dateDifference(date, end);


                dailyinterestrate = (Number(self.rate) * 0.01) / Number(daysinyear);


                minterest = calcamountremaining * (j+Number(1)) * dailyinterestrate;

                totalremainingafterpayment+= Number(minterest);
                totalremainingafterpayment = totalremainingafterpayment -  Number(mtotal);

                if (totalremainingafterpayment < 0.9*(mtotal)) {
                    totalremainingafterpayment = 0;
                }

                var nextstart = new Date(end);
                nextstart = self.formatDate(new Date(nextstart.setDate(nextstart.getDate() + Number(1))));
                var nextend = self.getLastDateOfMonth(nextstart, ytype);
                var k = CalculateService.dateDifference(nextstart, nextend);
                var nextminterest = totalremainingafterpayment * (k+Number(1)) * dailyinterestrate;

                var dailyinterest = nextminterest/(Number(1)+j);
                var balance = totalremainingafterpayment;
                var dispmonth;
                if(ytype==="bankyear")
                {
                    dispmonth = self.getMonthName(end);
                }
                else
                {
                    dispmonth = self.getMonthName(start);
                }

                while (j >= 0)
                {


                    balance += Number(dailyinterest);
                    var dailyobj =
                    {
                        day: date,
                        dailyinterest: parseFloat(Math.round(dailyinterest * 100) / 100).toFixed(2),
                        balance: parseFloat(Math.round(balance * 100) / 100).toFixed(2)
                    };

                    dailyarr.push(dailyobj);
                    date = self.formatDate(new Date(new Date(date).setDate(new Date(date).getDate() + Number(1))));
                    j--;
                }



                totalpaidsofar += Number(mtotal);
                var monthobj =
                {
                    startdate: start,
                    startdisplay: dispmonth,
                    enddate: end,
                    month:new Date(start),
                    totalpayment: parseFloat(Math.round(mtotal * 100) / 100).toFixed(2),
                    monthlyinterest: parseFloat(Math.round(minterest * 100) / 100).toFixed(2),
                    dailytotal: parseFloat(Math.round(dailyamt * 100) / 100).toFixed(2),
                    paidsofar: parseFloat(Math.round(totalpaidsofar * 100) / 100).toFixed(2),
                    dailyinfo: dailyarr
                };

                monthlyInfo.push(monthobj);




                start = new Date(end);
                start = self.formatDate(new Date(start.setDate(start.getDate()+Number(1))));

                i++;
                calcamountremaining = calcamountremaining - Number(mtotal) + minterest;
//                if (totalremaining<Number(0))
//                {
//                    totalremaining = 0;
//                }


            }

        }
        self.finalpayment = totalpaidsofar;
        return monthlyInfo;
    }
});