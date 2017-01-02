"use strict";

app.factory('Subsection', function() {

  /**
   * subsection model
   * @class Subsection
   */
  var Subsection = function (apply) {

    var that = this;

    that.list = {};

    that.tempName = "Подраздел " + (that.list.length + 1);

    /**
     * Get a list of subsection
     * @memberOf Subsection
     * @function
     * @param {string} email
     */
    that.getListOfSubsections = function (email) {
      mongoSitesApi.mgoInterface
        .find({ "_type": "Subsection", "user": email})
        .then(function(res) {
          // your code here
          console.log("getListOfSubsections()", res);

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
     * @memberOf Subsection
     * @function
     * @param {string} email
     * @param {object} data
     * @return {promise}
     */
    that.getData = function (email, data) {
      return mongoSitesApi.mgoInterface
        .find({ "_type": "Subsection", "user": email})
        .then(function(res) {

          if (res.length) {

            res.forEach(function (item) {
              console.log(item);
              // TODO: need to fix rewriting
              data[item.section].subsection = {};
              data[item.section].subsection.id = item._id;
              data[item.section].subsection.name = item.name;
            });

            return data;

          }

        });

    };



    /**
     * Create subsection
     * @memberOf Subsection
     * @function
     * @param {string} email
     * @param {string} name
     * @param {function} callback
     */
    that.create = function (email, name, section, callback) {

      mongoSitesApi.mgoInterface
        .insert([{
          "_type": "Subsection",
          "user": email,
          "name": name,
          "section": section,
        }])
        .then(function(res) {
          console.log(res);

          var subSectionId = res.insertedIds[0];

          if (callback) callback(section, subSectionId);

        });
    };



    /**
     * Update subsection name
     * @memberOf Subsection
     * @function
     * @param {string} id
     * @param {string} name
     * @param {function} callback
     */
    that.update = function (id, name, callback) {

      mongoSitesApi.mgoInterface
        .update(
          { "_type": "Subsections",
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
     * Remove subsection
     * @memberOf Subsection
     * @function
     * @param {string} email
     * @param {string} id
     */
    that.removeById = function (id) {
      mongoSitesApi.mgoInterface
        .remove({ "_type": "Subsection", "_id": id})
        .then(function(res) {
          console.log(res);
        });
    };

  };


  /**
   * Return the constructor function
   */
  return Subsection;

});