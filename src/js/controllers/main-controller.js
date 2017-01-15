'use strict';

/**
 * Main controller
 * @class angular_module.app.MainCtrl
 * @memberof angular_module.app
 */
app.controller("MainCtrl", ["$scope", "$rootScope", "User", "Section", "Subsection", "Note", function ($scope, $rootScope, User, Section, Subsection, Note) {

  window.scope = $scope;
  window.rootScope = $rootScope;

  $scope.user = new User(apply);
  $scope.model = {};
  $scope.data = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);
  $scope.isLoading = false;
  $scope.spinnerActive = false;
  $scope.tempId = 0;

  $scope.$watch("isLoading", function (loading) {
    console.log("loading... " + loading)
    $rootScope.spinnerActive = loading;
  });

  $rootScope.spinnerActive = $scope.spinnerActive;


  var getData = function (user) {
    $scope.data = {};
    $scope.section.getData(user.email, $scope.data)
      .then(function (data) {
        return $scope.subSection.getData(user.email, data)
      })
      .then(function (data) {
        return $scope.note.getData(user.email, data);
      })
      .then(function (data) {
        apply();
      });
  };


  $scope.initApp = function () {
    $scope.user.getUser(function (user) {
      getData(user);
    });
  };


  /**
   * @function
   * @param {string} email
   * @param {string} name
   * @param {string} onBind - function which will execute on bind
   */
  $scope.addSection = function (email) {

    var parent = document.querySelector(".js-sections");
    var sibling = document.querySelector(".js-li");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.sectionName");
    newLi.setAttribute("class", "sections__item sections__item_add js-li");

    parent.insertBefore(newLi, sibling);

    newLi.focus();

    function save () {
      $scope.isLoading = true;
      if (newLi.innerText === "") {
        newLi.remove();
        $scope.isLoading = false;
      } else {
        newLi.remove();
        $scope.section.create(email, newLi.innerText, $scope.tempId)
          .then(function (sectionId) {
            return $scope.subSection.create(email, $scope.subSection.tempName, sectionId);
          })
          .then(function (res) {
            var sectionId = res[0];
            var subSectionId = res[1];
            return $scope.note.create(email, sectionId, subSectionId);
          })
          .then(function () {
            $scope.isLoading = false;
            console.log("wait...");
            getData($scope.user);
          });
      }
    };

    newLi.addEventListener("blur", function () {
      save();
    });

    newLi.addEventListener("keypress", function (e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;

      if (keyCode == '13'){
        newLi.blur();
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

    var parent = document.querySelectorAll(".js-subsection")[idx].querySelector(".js-ul");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.subSectionName");
    newLi.setAttribute("class", "subsections__item subsections__item_add js-li");

    parent.appendChild(newLi);

    newLi.focus();


    function save () {
      $scope.isLoading = true;

      if (newLi.innerText === "") {
        newLi.remove();
        $scope.isLoading = false;
      } else {
        newLi.remove();
        $scope.subSection.create(email, newLi.innerText, section)
          .then(function (res) {
            var sectionId = res[0];
            var subSectionId = res[1];
            return $scope.note.create(email, sectionId, subSectionId);
          })
          .then(function () {
            $scope.isLoading = false;
            getData($scope.user);
          });
      }
    };

    newLi.addEventListener("blur", function () {
      save();
    });


    newLi.addEventListener("keypress", function (e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;

      if (keyCode == '13'){
        newLi.blur();
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
    var noteArea = event.srcElement;

    if (noteArea.value === "" && noteArea.value === " ") {
      console.log("nothing to write");
      return;
    } else {
      $scope.isLoading = true;
      var text = noteArea.value;
      $scope.note.update(subsection, text, $scope.user.email)
        .then(function () {
          $scope.isLoading = false;
          getData($scope.user);
        });
    }
  };




  $scope.updateSection = function (event, section) {
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
        $scope.section.updateName(section, name, getData($scope.user));
      }

    });
  };




  $scope.updateSubSection = function (event, subsection, idx) {
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
        $scope.subSection.updateName(subsection, name, getData($scope.user));
      }

    });
  };





  $scope.removeSection = function (section, tab) {
    if (confirm("Are you shure you want to delete the section with sunsections and notes?")) {
      $scope.section.remove(section)
        .then(function (res) {
          if (res.n == 1) {

            var allPromises = $scope.data[section].subsections.map(function (subsection) {
              return $scope.subSection.remove(subsection.id)
                .then(function (res) {
                  return $scope.note.remove(subsection.id);
                });

            });

            return Promise.all(allPromises);

          }
        })
        .then(function () {
          return getData($scope.user);
        })
        .then(function() {
          var _tab = Math.max(1, tab.tab - 1);
          tab.setTab(_tab);
        });
    }
  };



  $scope.removeSubSection = function (subsection, subtab) {
    if (confirm("Are you shure you want to delete the subsection and notes?")) {
      $scope.subSection.remove(subsection)
        .then(function (res) {
         return $scope.note.remove(subsection);
        })
        .then(function (res) {
          if (res.n == 1) {
            getData($scope.user);
          }
        })
        .then(function (res) {
          var _tab = Math.max(1, subtab.tab - 1);
          subtab.setTab(_tab);
        });
    }
  };




  $scope.nowSectionID = function (idx) {
   return Object.keys($scope.data)[idx];
  };


  function apply () {
    $scope.$$phase || $scope.$apply();
  };

}]);

