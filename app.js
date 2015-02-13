app = angular.module("stewartApp", []);
app.controller("guestsController", ["$scope", "$http", function($scope, $http){
	
	
	$scope.selected = [];
	$scope.categories = [];
	
	$http.get("data/guests.json").
		success(function(data){
			
			$scope.guests = data;
			$scope.categories = $scope.guests.map(function(guest){ return guest.category[0] })
				.filter(function(obj, i, a){ return a.indexOf(obj) == i })
				.sort();
			

			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$scope.selected = $scope.categories.filter(function(category){ return ( category == "Non-political" ? false : true) });
				setTimeout(function(){ $scope.runSort(); }, 1000);
			} 
			else
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
			
		$scope.runSort();
		
	};
	
	$scope.isCategorySelected = function(category){
		return ($scope.selected.indexOf(category) == -1 ? false : true);
	};
	
	$scope.getImageURL = function(img){
		return {"background-image": 'url("img/' + img.replace(/ /g, "-") + '.jpg")'}
	};
	

	
	$scope.sortGuests = function(category){
		
	
		
		index = $scope.selected.indexOf(category);
		if( index == -1 ) 
			$scope.selected.push(category);
		else
			$scope.selected.splice(index, 1);
		 
		$scope.runSort();
		
	};
	
	$scope.runSort = function(){
		$(".guestsContainer").isotope({
			itemSelector: '.guest',
			layoutMode: 'fitRows',
			getSortData: {
				name: '[data-name]',
				category: '[data-category]'
			}	
		});
		 
		$(".guestsContainer").isotope({
			filter: function(){
				matches = false;
				$scope.guests[parseInt($(this).attr("id")) ].category.forEach(function(category){
					if( $scope.selected.indexOf(category) != -1) matches = true;
				});
				
				return matches;
			}
		});
	}
	
		
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

