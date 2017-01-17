"use strict";

app.factory('Subsection', function() {

  /**
   * subsection model
   * @class Subsection
   */
  var Subsection = function (apply) {

    var that = this;

    that.list = {};

    that.tempName = "Подраздел ";

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

          if (res.length) {

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


            res.forEach(function (item, idx) {
              var obj = {};
              obj.id = item._id;
              obj.name = item.name;
              obj.create_at = item.create_at;

              data[item.section].subsections.push(obj);
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
    that.create = function (email, id, name, section) {

      return mongoSitesApi.mgoInterface
        .insert([{
          "_id": id,
          "_type": "Subsection",
          "user": email,
          "name": name,
          "section": section,
          "create_at": Date.now()
        }])
        .then(function(res) {

          var subSectionId = res.insertedIds[0];

          return [section, subSectionId];

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
    that.updateName = function (id, name, callback) {

      mongoSitesApi.mgoInterface
        .update(
          {
            "_id": id
          }, {
            "$set": {
              "name": name
            }
          }, {
            "upsert": true
          })
        .then(function(res) {

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
    that.remove = function (id) {
      return mongoSitesApi.mgoInterface
        .remove({ "_id": id})
        .then(function(res) {

          return res;
        });
    };

  };


  /**
   * Return the constructor function
   */
  return Subsection;

});