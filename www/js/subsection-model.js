"use strict";

app.factory('Subsection', function() {

  /**
   * subsection model
   * @class Subsection
   */
  var Subsection = function (apply) {

    var that = this;

    that.list = [];

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
     * Create subsection
     * @memberOf Subsection
     * @function
     * @param {string} email
     * @param {string} name
     * @param {function} callback
     */
    that.create = function (email, name, callback) {

      mongoSitesApi.mgoInterface
        .insert([{ "_type": "Subsection", "user": email, "name": name, "notes": "[]" }])
        .then(function(res) {
          console.log(res);

          that.list.push(name);

          if (callback) callback();

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

  };


  /**
   * Return the constructor function
   */
  return Subsection;

});
