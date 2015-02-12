app = angular.module("stewartApp", []);
app.controller("guestsController", ["$scope", "$http", function($scope, $http){
	
	
	$scope.selected = [];
	
	$http.get("data/guests.json").
		success(function(data){
			
			$scope.guests = data;
			$scope.categories = $scope.guests.map(function(guest){ return guest.category })
				.filter(function(obj, i, a){ return a.indexOf(obj) == i })
				.sort();
			
			$scope.selected = $scope.categories.slice(0);
			
		
			
		
		})
		.error(function(err){
			if(err) console.log(err);
		});
	
	$scope.areAllSelected = function(){
		return ( $scope.selected.length == $scope.categories.length ? true : false)
	};
	
	$scope.selectOrUnselectAll = function(){
		console.log($scope.selected.length);
		if( $scope.selected.length ==  $scope.categories.length)
			$scope.selected = [];
		else 
			$scope.selected = $scope.categories.slice(0);
		
		
		$(".guestsContainer").isotope({
			filter: function(){
				return $scope.selected.indexOf($(this).attr("data-category")) != -1;
			}
		});
		
	};
	
	$scope.isCategorySelected = function(category){
		return ($scope.selected.indexOf(category) == -1 ? false : true);
	};
	
	$scope.getImageURL = function(img){
		return {"background-image": 'url("img/' + img.replace(/ /g, "-") + '.jpg")'}
	};
	
	$scope.highlightPictures = function(categories) {
		$scope.guests.forEach( function(guest){
			if( categories.indexOf(guest.category) > -1 ) guest.selected = true;
			else guest.selected = false;
		});

	};
	
	$scope.sortGuests = function(category){
		
		$(".guestsContainer").isotope({
			itemSelector: '.guest',
			layoutMode: 'fitRows',
			getSortData: {
				name: '[data-name]',
				category: '[data-category]'
			}	
		});
		
		index = $scope.selected.indexOf(category);
		if( index == -1 ) 
			$scope.selected.push(category);
		else
			$scope.selected.splice(index, 1);
		 
		$(".guestsContainer").isotope({
			filter: function(){
				return $scope.selected.indexOf($(this).attr("data-category")) != -1;
			}
		});
		
	};
	
	
	
		
}]);

app.directive('square', function() {
    return {
        link: function(scope, element, attrs) {
			element[0].style.height = element[0].clientWidth + "px";

		}
	}
});

app.directive('isotope', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function(){
				
				
            });
        }
    };
});

