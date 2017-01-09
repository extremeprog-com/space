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
  $scope.data = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);


  $scope.initApp = function () {
    $scope.user.getUser(function (user) {
      $scope.section.getData(user.email, $scope.data)
        .then(function (data) {
          return $scope.subSection.getData(user.email, data)
        })
        .then(function (data) {
          return $scope.note.getData(user.email, data);
        })
        .then(function () {
          apply();
        });
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
        $scope.section.create(email, newLi.innerText, function (sectionId) {
          $scope.subSection.create(email, $scope.subSection.tempName, sectionId, function (sectionId, subSectionId) {
            $scope.note.create(email, sectionId, subSectionId, apply);
          })
        });
      }

    });

  };




  /**
   * @function
   * @param {string} email
   * @param {string} name
   * @param {string} onBind - function which will execute on bind
   */
  $scope.addSubSection = function (email, section, idx) {
    console.log("add subsection");

    // var parent = document.querySelector(".js-subsections");
    var parent = document.querySelectorAll(".js-subsection")[idx].querySelector(".js-ul");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.subSectionName");
    newLi.setAttribute("class", "subsections__item js-li");

    parent.appendChild(newLi);

    newLi.focus();

    console.log("section", section);
    newLi.addEventListener("blur", function () {
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();
          $scope.subSection.create(email, newLi.innerText, section, function (sectionId, subSectionId) {
            $scope.note.create(email, sectionId, subSectionId, apply);
          });
      }

    });

  };




  /**
   * @function
   * @param {string} email
   * @param {string} name
   * @param {string} onBind - function which will execute on bind
   */
  $scope.updateNote = function (event, subsection) {
    var noteArea = event.srcElement;// document.querySelectorAll(".js-notearea-wrpr")[idx].querySelector(".js-notearea");
    // console.log(noteArea.value);
    // console.log(idx);
    // console.log(subsection);

    if (noteArea.value === "" && noteArea.value === " ") {
      console.log("nothing to write");
      return;
    } else {
      var text = noteArea.value;
      console.log(text);
      $scope.note.update(subsection, text, apply);
    }
  };




  $scope.updateSection = function (event, section, idx) {
    var li = event.srcElement;
    li.setAttribute("contenteditable", "true");
    li.focus();


    li.addEventListener("blur", function () {
      if (li.innerText === "" && li.innerText === " ") {
        li.removeAttribute("contenteditable");
        apply();
        return;
      } else {
        li.removeAttribute("contenteditable");
        var name = li.innerText;
        console.log(name);
        $scope.section.updateName(section, name, apply);
      }

    });
  };




  $scope.updateSubSection = function (event, subsection, idx) {
    console.log(event.srcElement);
    var li = event.srcElement;


    li.setAttribute("contenteditable", "true");
    li.focus();


    li.addEventListener("blur", function () {
      if (li.innerText === "" && li.innerText === " ") {
        li.removeAttribute("contenteditable");
        apply();
        return;
      } else {
        li.removeAttribute("contenteditable");
        var name = li.innerText;
        console.log(name);
        $scope.subSection.updateName(subsection, name, apply);
      }

    });
  };




  $scope.removeSubSection = function () {

  }




  $scope.nowSectionID = function (idx) {
   return Object.keys($scope.data)[idx];
  };


  function apply () {
    $scope.$$phase || $scope.$apply();
  };

}]);

