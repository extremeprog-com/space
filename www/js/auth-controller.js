"use strict";

app.controller('AuthCtrl', ['$scope', '$http', function ($scope, $http) {

  // register new user
  $scope.user = {};

  $scope.register = function (email, passwd) {
    event.preventDefault();

    if (!document.querySelector('#accept').checked) {
      $scope.error = 'Do you agree to terms?';
      $scope.$$phase || $scope.$apply();

      document.querySelector('#accept').style.borderColor = "red";
      document.querySelector('#error').style.display = "block";
      return;
    }

    if (!$scope.user.email) {
      $scope.error = 'The email field is required.';
      $scope.$$phase || $scope.$apply();

      document.querySelector('#email').style.borderColor = "red";
      document.querySelector('#error').style.display = "block";
      return;
    }

    if (!$scope.user.passwd) {
      $scope.error = 'The password field is required.';
      $scope.$$phase || $scope.$apply();

      document.querySelector('#passwd').style.borderColor = "red";
      document.querySelector('#error').style.display = "block";
      return;
    }

    if ($scope.user.passwd !== $scope.user.passwd2) {
      $scope.error = 'Passwords should be equal.';
      $scope.$$phase || $scope.$apply();

      document.querySelector('#passwd2').style.borderColor = "red";
      document.querySelector('#error').style.display = "block";
      return;
    }

      mongoSitesApi
        .auth_register({_id: email, password: passwd})
        .then(function (res) {

          mongoSitesApi
            .auth(email, passwd)
            .then(function (res) {

              $scope.user.hash = Math.random().toString(36).substr(2);

              // add hash
              mongoSitesApi
                .auth_update({_id: email, hash: $scope.user.hash})
                .then(function (res) {
                  console.log($scope.user);
                  window.localStorage.gitGimUser = angular.toJson($scope.user);

                  $http({
                    url: '/new-user',
                    method: 'GET',
                    params: {id: $scope.user.hash}
                  });

                  window.location.pathname = '/';
                });

            });
        });
    };

  // auth user
  $scope.login = function (email, passwd) {
    console.log('start login');
    event.preventDefault();

    mongoSitesApi
      .auth(email, passwd)
      .then(function (res) {
        console.log(res);

        window.location.pathname = '/';

      });
  };

}]);

