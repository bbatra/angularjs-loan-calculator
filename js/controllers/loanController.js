app.controller("loanCtrl", function($scope)
{
	$scope.loan = 
	[{
			name_used : "John Doe",
			amount_used : "0.00",
			interestType_used : "simple",
			yearType_used : "bankyear",
			termLength_used : "12",
			termType_used : "months",
			rate_used : "0.0"
	}];

	$scope.enter = function(data)
	{
		var self = this;
		self.loan = 
		[{
			name_used : self.name,
			amount_used : self.amount,
			interestType_used : self.interestType,
			yearType_used : self.yearType,
			termLength_used :  self.termLength,
			termType_used : self.termType,
			rate_used : self.rate

		}];
	};
});