'use strict';

/* Controllers */

var equationFinder = angular.module('equationFinder', []);

equationFinder.controller('equationFinderCtrl', function($scope, $sce, $http) {

  $http.get('equations/symbols.json').success(function(data) {
    $scope.symbols = data;
    console.log("Whats up!");
  });

    $http.get('equations/equations.json').success(function(data) {
    $scope.equations = data;
    $scope.filteredItems = data;
  });

  $scope.orderProp = 'age';

  $scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  }

  $scope.active = null;
  $scope.selectEquation = function(equation) {
        $scope.active = equation;
      };

  $scope.isSelected = function(letter) {
      var index = $scope.selectedLetters.indexOf(letter);
      if (index > -1){
        return true;
      }
      else {
        return false;
      }
  };

  $scope.selectedLetters = [];
  $scope.updateLetters = function(letter) {
      $scope.resetLimit();
      var index = $scope.selectedLetters.indexOf(letter);
      if (index > -1){
        $scope.selectedLetters.splice(index, 1);
      }
      else {
        $scope.selectedLetters.push(letter);
      }
  };

  $scope.limit = 6;
  $scope.showMore = true;
  
  $scope.increaseLimit = function() {
    if ($scope.limit + 6 >= $scope.filteredItems.length){
      $scope.limit = $scope.filteredItems.length;
    }
    else {
      $scope.limit += 6;
    }
    $scope.resetShowMore();
  }
  $scope.resetLimit = function() {
    $scope.limit = 6;
    $scope.resetShowMore();
  }

  $scope.plural = 's';
  $scope.resetShowMore = function() {
    if ($scope.filteredItems.length == 1){
      $scope.plural = '';
    }
    else {
      $scope.plural = 's';
    }
    if ($scope.limit >= $scope.filteredItems.length){
      $scope.showMore = false;
    }
    else {
      $scope.showMore = true;
    }
  }

  $scope.filteredCount = 100;

  $scope.equationFilter = function(equation) {
      $scope.resetShowMore();
      for (var i = 0; i<$scope.selectedLetters.length; i++) {
        var letter = $scope.selectedLetters[i];
        if (equation.symbols.indexOf(letter) == -1) {
          return false;
        }
      }
      return true;
  }

});

equationFinder.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs",
                function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
});

