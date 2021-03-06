loanApp.controller("altCtrl", function($scope, $log, CalculateService, DateService)
{

    $scope.totalmonthlypayment;
    $scope.totalmonthlypaymentvalue;

    $scope.monthlyinterest;
    $scope.monthlybasepayment;

    $scope.monthlyInfo = [];//first month only for test

    $scope.termType = "months";
    $scope.interestType = "compound";
    $scope.yearType = "bankyear";
    $scope.format = "dd/mm/yyy";
    $scope.express = false;
    $scope.dateToBeChanged = 0;

    

    
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

    
    $scope.startdate= DateService.setStartDate();

    $scope.loan =
	{
			name  : "John Doe",
			amount  : "0.00",
            downPayment: "0.00",
			interestType  : "compound",
			yearType  : "bankyear",
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
            self.startdate = DateService.formatDate(new Date());
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
            startdate: DateService.formatDate(self.startdate)
		};

        var monthlyPayment = CalculateService.calc(self.loan);
        if(isNaN(monthlyPayment))
        {
            monthlyPayment=0;
        }
        self.monthlyPayment = monthlyPayment;
        self.totalmonthlypaymentvalue = parseFloat(Math.round(monthlyPayment * 100) / 100).toFixed(2);
        self.getResults();

	}

    $scope.getResults = function()//should this be in calculateService?
    {
        var self = this;
        self.monthlyInfo = [];
        var principal = Number(self.loan.amount) - Number(self.loan.downPayment);

        var firstPayDate = new Date(self.loan.startdate).getDate();
        var firstMonthDays = DateService.getMonthData(self.loan.startdate).days;



        var firstPaymentInterestRate = (self.loan.rate * 0.01) / 360 * (30/firstMonthDays);

        var firstPaymentInterest = firstPaymentInterestRate * principal * (firstMonthDays - firstPayDate + 1);
        var month = new Month(self.loan.startdate, principal , firstPaymentInterest, self.loan.interestType, self.monthlyPayment, 0);
        var i = 1; //increment variable for while loop

        while(i < self.loan.termLength)
        {
            var prevMonth = month.getMonthObject();

            var prevMonthDisplay =
            {
                name: prevMonth.name,
                monthlyPayment: parseFloat(Math.round(prevMonth.monthlyPayment * 100) / 100).toFixed(2),
                monthlyInterest: parseFloat(Math.round(prevMonth.monthlyInterest * 100) / 100).toFixed(2),
                dailyPayment: parseFloat(Math.round(prevMonth.dailyPayment * 100) / 100).toFixed(2),
                paidSoFar: parseFloat(Math.round(prevMonth.paidSoFar * 100) / 100).toFixed(2),
                days: prevMonth.days

            };
            self.monthlyInfo.push(prevMonthDisplay);
            var nextDate = DateService.getValidDate (self.loan.startdate, i);

            month = new Month(nextDate, prevMonth.amountRemaining, prevMonth.interestRemaining, self.loan.interestType, self.monthlyPayment, prevMonth.paidSoFar);
            i++;
        }
        var lastMonth = month.getMonthObject();


        var lastMonthDisplay =
        {
            name: lastMonth.name,
            monthlyPayment: parseFloat(Math.round(lastMonth.monthlyPayment * 100) / 100).toFixed(2),
            monthlyInterest: parseFloat(Math.round(lastMonth.monthlyInterest * 100) / 100).toFixed(2),
            dailyPayment: parseFloat(Math.round(lastMonth.dailyPayment * 100) / 100).toFixed(2),
            paidSoFar: parseFloat(Math.round(lastMonth.paidSoFar * 100) / 100).toFixed(2),
            days: lastMonth.days
        };
        self.monthlyInfo.push(lastMonthDisplay);
    }


    var Month = function(date, amountRemaining, interestRemaining, interestType, monthlyPayment, paidSoFar)//should this be in calculateService?
    {
        var self = this;
        self.date = date;

        self.payDay = new Date(date).getDate();
        self.month = DateService.getMonthData(date);//name: self.month.name; numDays = self.month.days
        self.interestType = interestType;
        self.amount = amountRemaining;
        self.payment = monthlyPayment;
        self.paidSoFar = paidSoFar;
        self.interestRemaining = interestRemaining;
        self.interestPaid = 0;
        self.dayArray = [];


        var mm = new Date(date).getMonth() + Number(1);
        var yyyy = new Date(date).getFullYear();

        if(Number(yyyy)%4===0 && mm === 2)
        {
            self.month.days = 29;
        }

        if(mm<10)
        {
            mm= '0' + mm;
        }

        self.startDate = mm + '/01/' + yyyy;

        var i = 1;//increment variable used to loop through days of month

        var currentDate = self.startDate;

        while(i <= self.month.days)
        {
            if (i === self.payDay)
            {

                self.amount = self.amount - Number(self.payment) + Number(self.interestRemaining);
                self.interestPaid = self.interestRemaining;
                self.interestRemaining = 0;

            }

            if(self.payDay != 1 && i<self.payDay )
            {
                var isRollover = true;
                if(self.date === $scope.loan.startdate)
                {
                    isRollover = false;
                }
            }
            else
            {
                var isRollover = false;
            }

            var day = new Days(currentDate, self.amount, isRollover);
            var dailyInterest = day.getDailyInterest();
            self.interestRemaining += dailyInterest;
            var dayValue =
            {
                date: day.date,
                interest: parseFloat(Math.round(dailyInterest * 100) / 100).toFixed(2),
                balance: parseFloat(Math.round((self.amount + self.interestRemaining) * 100) / 100).toFixed(2)
            };
            self.dayArray.push(dayValue);
            currentDate = DateService.formatDate(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + Number(1))));
            i++;
        }

        self.returnObject =
        {
            name : self.month.name,
            monthlyPayment: self.payment,
            days : self.dayArray,
            monthlyInterest: self.interestPaid,
            dailyPayment : Number(self.payment)/self.month.days,
            paidSoFar : self.paidSoFar + Number(self.payment),
            interestRemaining : self.interestRemaining,
            amountRemaining: self.amount
        };

        self.getMonthObject = function()
        {
            return self.returnObject;
        }

    }


    var Days = function(date, principal, isRollover)//should this be in calculateService?
    {
        var self = this;

        self.isRollover = isRollover;

        self.principal = principal;
        self.date = date;




        self.getDaysInYear = function()
        {
            var daysInYear = 360;

            return daysInYear;
        }

        self.getDaysInMonth = function()
        {
            if (self.isRollover === true)
            {
                //in rollover case, number of days between paydates equals number of days in previous month
                var monthDays = DateService.getMonthData(self.date, Number(11)).days;
            }
            else
            {
                var monthDays = DateService.getMonthData(self.date).days;
            }
            if(Number(new Date(self.date).getFullYear()) % Number(4) === 0)//Leap Year check
            {

                if (monthDays === 28)
                    monthDays = 29;
            }

            return monthDays;
        }


        self.getDailyInterest = function()
        {
            var yearlyInterest = $scope.loan.rate * 0.01 * self.principal;
            var dailyInterest = yearlyInterest / self.getDaysInYear();

            dailyInterest *= (30/self.getDaysInMonth());//interest calculated on a 30 day month basis
                                                        //to get daily amount divide by number of days in month

            return dailyInterest;

        }

    }

    $scope.clear = function()
    {
        this.startdate = DateService.setStartDate();
        this.name = null ;
        this.amount  = null;
        this.downPayment= null;
        this.interestType  = "compound";
        this.yearType  = "bankyear";
        this.termLength = null;
        this.termType = "months"
        this.rate  = null;
        this.totalmonthlypaymentvalue = 0.00;
        this.dateToBeChanged = 0;
    }

    $scope.getLastDateOfMonth= function(startdate)
    {
       
        var ytype = self.loan.yearType;
        

        return DateService.getLastDateOfMonth(startdate, ytype);
    }


    $scope.focusChange = function() //to account for jquery date update
    {
        var newDate = document.getElementById("datepicker").value;
        $scope.dateToBeChanged = 0;

        $log.info("Initial dateToBeChanged = " + $scope.dateToBeChanged);
        if(new Date(newDate).getDate()>28)
        {
            $scope.dateToBeChanged = new Date(newDate).getDate();

            var date = new Date(newDate);
            var mm = Number(date.getMonth())+Number(1);//default start date is first day of next month
            var dd = '28';
            var yyyy = date.getFullYear();
            newDate = (mm + '/' + dd + '/' + yyyy);
        }

        $log.info("Final dateToBeChanged = " + $scope.dateToBeChanged);

        $scope.loan.startdate = newDate;
        $scope.startdate = newDate;


    }




});