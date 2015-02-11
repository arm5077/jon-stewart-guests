app = angular.module("stewartApp", []);
app.controller("guestsController", ["$scope", "$http", function($scope, $http){
	
	guests = [];
	
	$http.get("data/guests.json").
		success(function(data){
			$scope.guests = data;
		})
		.error(function(err){
			if(err) console.log(err);
		});
		
	$scope.getImageURL = function(img){
		return {"background-image": 'url("img/' + img.replace(/ /g, "-") + '.jpg")'}
	
	}
		
		
}]);

app.directive('square', function() {
    return {
        link: function(scope, element, attrs) {
			element[0].style.height = element[0].clientWidth + "px";

		}
	}
});

