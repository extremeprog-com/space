'use strict';

/**
 * Main controller
 * @class angular_module.app.MainCtrl
 * @memberOf angular_module.app
 */
app.controller("MainCtrl", ["$scope", "$rootScope", "User", "Section", "Subsection", "Note", function ($scope, $rootScope, User, Section, Subsection, Note) {

  $scope.user = new User(apply);
  $scope.model = {};
  $scope.data = {};
  $scope.section = new Section(apply);
  $scope.subSection = new Subsection(apply);
  $scope.note = new Note(apply);

  var tempValue = null;


  /**
   * @function
   * @param {object} user
   */
  var getData = function (user) {
    $scope.data = {};
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
  };


  /**
   * @function
   * @memberOf angular_module.app.MainCtrl
   */
  $scope.initApp = function () {
    $scope.user.getUser(function (user) {
      getData(user);
    });
  };


  /**
   * @function
   * @param {string} id
   * @param {object} elem
   */
  function sectionDataUpdate (id, elem) {
    $scope.data[id] = {};
    $scope.data[id].name = elem.innerText;
    $scope.data[id].subsections = [];
  };


  /**
   * @function
   * @param {string} id
   * @param {string} sectionId
   * @param {object} sectionInData
   */
  function subSectionDataUpdate(id, sectionId, sectionInData) {
    var idx = $scope.data[sectionId].subsections + 1;
    sectionInData.subsections[idx] = {};
    sectionInData.subsections[idx].id = id;
    sectionInData.subsections[idx].name = $scope.subSection.tempName;
    sectionInData.subsections[idx].note = "";
    sectionInData.subsections[idx].create_at = Date.now();
  };


  /**
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {string} email
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
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();

        var id0 = Math.random().toString(36).substr(2);
        var id1 = Math.random().toString(36).substr(2);
        var id2 = Math.random().toString(36).substr(2);

        $scope.section.create(email, id0, newLi.innerText)
          .then(function (sectionId) {

            sectionDataUpdate(id0, newLi);
            subSectionDataUpdate(id1, id0, $scope.data[id0]);

            apply();

            return $scope.subSection.create(email, id1, $scope.subSection.tempName, sectionId);
          })
          .then(function (res) {
            var sectionId = res[0];
            var subSectionId = res[1];

            return $scope.note.create(email, id2, sectionId, subSectionId);
          })
          .then(function () {
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
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {string} email
   * @param {string} section
   * @param {object} subtab - subsections' tab controller
   * @param {number} idx
   * @param {number} arrLength - length of subsections' array
   */
  $scope.addSubSection = function (email, section, subtab, idx, arrLength) {

    var parent = document.querySelectorAll(".js-subsection")[idx].querySelector(".js-ul");

    var newLi = document.createElement('li');

    newLi.setAttribute("contenteditable", "true");
    newLi.setAttribute("ng-model", "model.subSectionName");
    newLi.setAttribute("class", "subsections__item subsections__item_add js-li");

    parent.appendChild(newLi);

    newLi.focus();

    function save () {
      if (newLi.innerText === "") {
        newLi.remove();
      } else {
        newLi.remove();
        var id = Math.random().toString(36).substr(2);
        $scope.subSection.create(email, id, newLi.innerText, section)
          .then(function (res) {
            id = Math.random().toString(36).substr(2);
            var sectionId = res[0];
            var subSectionId = res[1];
            return $scope.note.create(email, id, sectionId, subSectionId);
          })
          .then(function () {
            getData($scope.user);
          })
          .then(function (res) {
            var _tab = Math.max(1, arrLength + 1);
            subtab.setTab(_tab);
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
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param event
   */
  $scope.setTempValue = function (event) {
    tempValue = event.srcElement.innerText || event.srcElement.value;
  };


  /**
   * Update a note with new value
   * @function
   * @param {object} noteArea - note's textarea
   * @param {string} subsection - subsections ID
   */
  function updateNote(noteArea, subsection) {
    if (noteArea.value === "" && noteArea.value === " " || noteArea.value === tempValue) {
      console.log("nothing to write");
      return;
    } else {

      var text = noteArea.value;
      $scope.note.update(subsection, text, $scope.user.email)
        .then(function () {
          getData($scope.user);
        });
    }
  };


  /**
   * Intermediate note update
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {object} event
   * @param {string} subsection - subsection ID
   */
  $scope.updateEditableNote = function (event, subsection) {
    var noteArea = event.srcElement;
    console.log(noteArea.value);

    $scope.noteSaveInterval = setInterval(function () {
      console.log(noteArea.value);
      updateNote(noteArea, subsection);
    }, 10000);
  };


  /**
   * Update note's value and clear interval
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {object} event
   * @param {string} subsection - subsection ID
   */
  $scope.clearUpdateNote = function (event, subsection) {
    var noteArea = event.srcElement;
    clearInterval($scope.noteSaveInterval);

    updateNote(noteArea, subsection);
  };


  /**
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {object} event
   * @param {string} section - section ID
   */
  $scope.updateSection = function (event, section) {
    var li = event.srcElement;
    li.setAttribute("contenteditable", "true");
    li.focus();

    li.addEventListener("blur", function () {
      if (li.innerText === "" && li.innerText === " " || li.innerText === tempValue) {
        li.removeAttribute("contenteditable");
        apply();
        return;
      } else {
        li.removeAttribute("contenteditable");
        var name = li.innerText;
        $scope.section.updateName(section, name, getData($scope.user));
      }

    });

    li.addEventListener("keypress", function (e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;

      if (keyCode == '13'){
        li.blur();
      }
    });
  };


  /**
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {object} event
   * @param {string} subsection - subsection ID
   */
  $scope.updateSubSection = function (event, subsection) {
    var li = event.srcElement;

    li.setAttribute("contenteditable", "true");
    li.focus();

    li.addEventListener("blur", function () {
      if (li.innerText === "" && li.innerText === " " || li.innerText === tempValue) {
        li.removeAttribute("contenteditable");
        apply();
        return;
      } else {
        li.removeAttribute("contenteditable");
        var name = li.innerText;
        $scope.subSection.updateName(subsection, name, getData($scope.user));
      }

    });

    li.addEventListener("keypress", function (e) {
      if (!e) e = window.event;
      var keyCode = e.keyCode || e.which;

      if (keyCode == '13'){
        li.blur();
      }
    });
  };


  /**
   * Remove a section, it's subsections and notes
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {string} section - section ID
   * @param {object} tab - sections' tab controller
   */
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


  /**
   * Remove a subsection and it's notes
   * @memberOf angular_module.app.MainCtrl
   * @function
   * @param {string} subsection - subsection ID
   * @param {object} subtab - subsection's tabs controller
   */
  $scope.removeSubSection = function (subsection, subtab) {
    if (confirm("Are you shure you want to delete the subsection and notes?")) {
      $scope.subSection.remove(subsection)
        .then(function (res) {
          return $scope.note.remove(subsection);
        })
        .then(function (res) {
          console.log(res);
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

  /**
   * @function
   */
  function apply () {
    $scope.$$phase || $scope.$apply();
  };

}]);

