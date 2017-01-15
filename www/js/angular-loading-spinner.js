(function(){
  angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner', ['$http', '$rootScope' ,function (){
      return {
        link: function (scope, elm, attrs)
        {
          if(attrs.$attr.usSpinnerStandalone) return;
          scope.spinnerActive = false;
          // scope.isLoading = function () {
          //     return $http.pendingRequests.length > 0;
          // };

          scope.$watch("isLoading", function (loading)
          {
            console.log("is loading: " + loading);
            scope.spinnerActive = loading;
            if (!loading){
              console.log("add");
              console.log(elm.classList);
              elm[0].classList.add('saved');
            } else {
              console.log("remove");
              console.log(elm.classList);
              elm[0].classList.remove('saved');
            }
          });
        }
      };

    }]);
}).call(this);
