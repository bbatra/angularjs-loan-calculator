loanApp.service('CalculateService', function($log)
{

    this.calc = function(loan)
    {

        var amt = loan.amount;
        var dp = loan.downPayment;
        var rate = loan.rate;
        var time = loan.termLength;
        var yearType = loan.yearType;
        var paydate = loan.startdate; //first of every month - hardcoded temporarily - later - give user option from form






        return this.getResult(amt, rate, time, dp, yearType, paydate);


    }

    

    //used to calculate monthly payment for amortized loan
    this.getResult = function(amt, rate, time, downpayment, ytype, payDate)
    {

        var monthlyrate = (Number(rate) * Number(0.01))/ Number(12);//rate is a percentage
        var remaining = Number(amt) - Number(downpayment);

        var calcterm = Math.pow(Number(monthlyrate) +Number(1), time);
        var totalmonthlypayment = (remaining * monthlyrate * calcterm)/(Number(calcterm) - Number(1));
        var disp_totalmonthlypayment = parseFloat(Math.round(totalmonthlypayment * 100) / 100).toFixed(2);


        return totalmonthlypayment;
    }

});