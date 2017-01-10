'use strict';

/**
 * Main controller
 * @class angular_module.app.MainCtrl
 * @memberof angular_module.app
 */
app.controller("MainCtrl", ["$scope", "User", "Section", "Subsection", "Note", function ($scope, User, Section, Subsection, Note) {

  window.scope = $scope;

  $scope.user = new User(apply);
  $scope.model = {};
  $scope.data = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);


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
        console.log(data);
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
    console.log("add section");

    var parent = document.querySelector(".js-sections");
    var sibling = document.querySelector(".js-li");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.sectionName");
    newLi.setAttribute("class", "sections__item sections__item_add js-li");

    parent.insertBefore(newLi, sibling);

    newLi.focus();

    function save () {
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();
        $scope.section.create(email, newLi.innerText, function (sectionId) {
          $scope.subSection.create(email, $scope.subSection.tempName, sectionId, function (sectionId, subSectionId) {
            $scope.note.create(email, sectionId, subSectionId, getData($scope.user));
          })
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
        save();
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

    var parent = document.querySelectorAll(".js-subsection")[idx].querySelector(".js-ul");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.subSectionName");
    newLi.setAttribute("class", "subsections__item subsections__item_add js-li");

    parent.appendChild(newLi);

    newLi.focus();

    console.log("section", section);
    newLi.addEventListener("blur", function () {
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();
          $scope.subSection.create(email, newLi.innerText, section, function (sectionId, subSectionId) {
            $scope.note.create(email, sectionId, subSectionId, getData($scope.user));
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
    var noteArea = event.srcElement;

    if (noteArea.value === "" && noteArea.value === " ") {
      console.log("nothing to write");
      return;
    } else {
      var text = noteArea.value;
      console.log(text);
      $scope.note.update(subsection, text, getData($scope.user));
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
        console.log(name);
        $scope.section.updateName(section, name, getData($scope.user));
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
        $scope.subSection.updateName(subsection, name, getData($scope.user));
      }

    });
  };





  $scope.removeSection = function (section, tab) {
    if (confirm("Are you shure you want to delete the section with sunsections and notes?")) {
      console.log("Will be delete section: " + section);
      $scope.section.remove(section)
        .then(function (res) {
          if (res.n == 1) {

            var allPromises = $scope.data[section].subsections.map(function (subsection) {
              return $scope.subSection.remove(subsection.id)
                .then(function (res) {
                  console.log(res);
                  return $scope.note.remove(subsection.id);
                });

            });

            return Promise.all(allPromises);

          }
        })
        .then(function () {
          console.log("tab")
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
      console.log("Will be delete subsection: " + subsection);
      $scope.subSection.remove(subsection)
        .then(function (res) {
          console.log(res);
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

