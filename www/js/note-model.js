"use strict";

app.factory('Note', function() {

  /**
   * subsection model
   * @class Subsection
   */
  var Note = function (apply) {

    var that = this;


    /**
     * Create note
     * @memberOf Note
     * @function
     * @param {string} email
     * @param {function} callback
     */
    that.create = function (email, callback) {

      mongoSitesApi.mgoInterface
        .insert([{ "_type": "Note", "user": email, "content": "" }])
        .then(function(res) {
          console.log(res);

          if (callback) callback();
          apply();

        });
    };
  };


  /**
   * Return the constructor function
   */
  return Note;

});
