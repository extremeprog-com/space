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
              data[item._id].subsections = [];
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
    that.create = function (email, id, name, tempId) {

      return mongoSitesApi.mgoInterface
        .insert([{
          "_id": id,
          "_type": "Section",
          "user": email,
          "name": name
        }])
        .then(function(res) {

          var sectionId = res.insertedIds[0];
          apply();

          return sectionId;

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
     * Remove section
     * @memberOf Section
     * @function
     * @param {string} id
     */
    that.remove = function (id) {
      return mongoSitesApi.mgoInterface
        .remove({ "_type": "Section", "_id": id})
        .then(function(res) {
          return res;
        });
    };

  };


  /**
   * Return the constructor function
   */
  return Section;

});
