"use strict";

app.controller('AuthCtrl', ['$scope', 'Section', 'Subsection', 'Note', function ($scope, Section, Subsection, Note) {

  // register new user
  $scope.user = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);

  function apply () {
    $scope.$$phase || $scope.$apply();
  }

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


                var newSectionName = "Раздел";
                var newSubsectionName = "Подраздел";

                var id0 = Math.random().toString(36).substr(2);
                var id1 = Math.random().toString(36).substr(2);
                var id2 = Math.random().toString(36).substr(2);

                return $scope.section.create(email, id0, newSectionName)
                  .then(function (sectionId) {
                    return $scope.subSection.create(email, id1, newSubsectionName, sectionId);
                  })
                  .then(function (res) {
                    var sectionId = res[0];
                    var subSectionId = res[1];

                    return $scope.note.create(email, id2, sectionId, subSectionId);
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

