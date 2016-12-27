"use strict";

app.factory('Section', function() {

  /**
   * Section model
   * @class Section
   */
  var Section = function (apply) {

    var that = this;

    that.list = [];

    /**
     * Get a list of sections
     * @memberOf Section
     * @function
     * @param {string} email
     */
    that.getListOfSections = function (email) {
      mongoSitesApi.mgoInterface
        .find({ "_type": "Section", "user": email})
        .then(function(res) {
          // your code here
          console.log("getListOfSections()", res);

          if (res.length) {
            console.log("res length");

            res.forEach(function (item) {
              that.list.push(item.name);
            });

            apply();
          }
        });
    };


    /**
     * Create section name
     * @memberOf Section
     * @function
     * @param {string} email
     * @param {string} name
     * @param {function} callback
     */
    that.create = function (email, name, callback) {

      mongoSitesApi.mgoInterface
        .insert([{ "_type": "Section", "user": email, "name": name, "subsections": "[]" }])
        .then(function(res) {
          console.log(res);

          that.list.push(name);

          if (callback) callback();
          apply();

        });
    };


    /**
     * Remove section
     * @memberOf Section
     * @function
     * @param id
     */
    that.remove = function (_id, callback) {
      mongoSitesApi.mgoInterface
        .remove({ "_id": _id})
        .then(function(res) {
          // your code here
          console.log(res);

          if (callback) callback();

          apply();
        });
    };


    /**
     * Update section name
     * @memberOf Section
     * @function
     * @param {string} id
     * @param {string} name
     * @param {function} callback
     */
    that.updateName = function (id, name, callback) {

      mongoSitesApi.mgoInterface
        .update(
          { "_type": "Sections",
            "user": user.email,
            "id": id
          }, {
            "$set": {
              "name": name
            }
          }, {
            "upsert": true
          })
        .then(function(res) {
          console.log(res);

          if (callback) callback();

        });
    };



    /**
     * Update subsections list
     * @memberOf Section
     * @function
     * @param {string} id
     * @param {string} name
     * @param {array} subsections
     * @param {function} callback
     */
    that.updateSubsections = function (id, name, subsections, callback) {
      var subsections = angular.toJson(subsections);

      mongoSitesApi.mgoInterface
        .update(
          { "_type": "Sections",
            "user": user.email,
            "id": id
          }, {
            "$set": {
              "name": name
            }
          }, {
            "upsert": true
          })
        .then(function(res) {
          console.log(res);

          if (callback) callback();

        });
    };

  };


  /**
   * Return the constructor function
   */
  return Section;

});
