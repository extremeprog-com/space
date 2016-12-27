'use strict';

/**
 * Main controller
 * @class angular_module.app.MainCtrl
 * @memberof angular_module.app
 */
app.controller("MainCtrl", ["$scope", "User", "Section", "Subsection", "Note", function ($scope, User, Section, Subsection, Note) {

  window.scope = $scope;
  $scope.apply = apply;

  $scope.user = new User(apply);
  $scope.model = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);


  $scope.initApp = function () {
    $scope.user.getUser(function (user) {
      $scope.section.getListOfSections(user.email);
    });
  };


  /**
   * @function
   * @param {string} email
   * @param {string} name
   * @param {string} onBind - function which will execute on bind
   */
  $scope.addSection = function (email) {
    console.log("add section");

    var parent = document.querySelector(".js-sections");
    var sibling = document.querySelector(".js-li");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.sectionName");
    newLi.setAttribute("class", "sections__item js-li");

    parent.insertBefore(newLi, sibling);

    newLi.focus();

    newLi.addEventListener("blur", function () {
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();
        $scope.section.create(email, newLi.innerText, function () {
          $scope.subSection.create(email, $scope.note.tempName, function () {
            $scope.note.create(email);
          })
        });
        newLi.removeAttribute("contenteditable");
      }

    });

  };


  function apply () {
    $scope.$$phase || $scope.$apply();
  };

}]);

