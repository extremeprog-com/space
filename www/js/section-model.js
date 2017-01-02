"use strict";

app.factory('Section', function() {

  /**
   * Section model
   * @class Section
   */
  var Section = function (apply) {

    var that = this;

    that.data = {};

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
     * Get data
     * @memberOf Section
     * @function
     * @param {string} email
     * @param {object} data
     * @return {promise}
     */
    that.getData = function (email, data) {
      return mongoSitesApi.mgoInterface
        .find({ "_type": "Section", "user": email})
        .then(function(res) {

          if (res.length) {

            res.forEach(function (item) {
              data[item._id] = {};
              data[item._id].name = item.name;
            });

            return data;

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
        .insert([{
          "_type": "Section",
          "user": email,
          "name": name
        }])
        .then(function(res) {
          console.log(res.insertedIds[0]);
          var sectionId = res.insertedIds[0];

          if (callback) callback(sectionId);
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
            "_id": id
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
    that.updateSubsections = function (id, subsections, callback) {
      var subsections = angular.toJson(subsections);

      mongoSitesApi.mgoInterface
        .update(
          { "_type": "Sections",
            "user": user.email,
            "_id": id
          }, {
            "$set": {
              "subsections": subsections
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
     * Remove section
     * @memberOf Section
     * @function
     * @param {string} id
     */
    that.removeById = function (id) {
      mongoSitesApi.mgoInterface
        .remove({ "_type": "Section", "_id": id})
        .then(function(res) {
          console.log(res);
        });
    };

  };


  /**
   * Return the constructor function
   */
  return Section;

});
