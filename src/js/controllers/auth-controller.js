"use strict";

app.controller('AuthCtrl', ['$scope', 'Section', 'Subsection', 'Note', function ($scope, Section, Subsection, Note) {

  // register new user
  $scope.user = {};
  $scope.section = new Section();
  $scope.subSection = new Subsection();
  $scope.note = new Note();

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


                  return $scope.section.create(email, "Раздел", function (sectionId) {
                    $scope.subSection.create(email, $scope.subSection.tempName, sectionId, function (sectionId, subSectionId) {
                      $scope.note.create(email, sectionId, subSectionId);
                    });
                  });
                })
                .then(function () {

                  window.localStorage.spaceUser = angular.toJson($scope.user);

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

