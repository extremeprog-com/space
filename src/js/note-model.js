"use strict";

app.factory('Note', function() {

  /**
   * subsection model
   * @class Subsection
   */
  var Note = function (apply) {

    var that = this;



    /**
     * Get data
     * @memberOf Note
     * @function
     * @param {string} email
     * @param {object} data
     * @return {promise}
     */
    that.getData = function (email, data) {
      return mongoSitesApi.mgoInterface
        .find({ "_type": "Note", "user": email})
        .then(function(res) {

          if (res.length) {

            res.forEach(function (item) {
              if( data[item.section].subsection.id == item.subsection) {
                data[item.section].subsection.note = item.content; }
            });

            return data;

          }

        });

    };



    /**
     * Create note
     * @memberOf Note
     * @function
     * @param {string} email
     * @param {function} callback
     */
    that.create = function (email, section, subsection, callback) {

      mongoSitesApi.mgoInterface
        .insert([{
          "_type": "Note",
          "user": email,
          "section": section,
          "subsection": subsection,
          "content": "" }])
        .then(function(res) {
          console.log(res);

          if (callback) callback();
          apply();

        });
    };



    /**
     * Remove note
     * @memberOf Note
     * @function
     * @param {string} id
     */
    that.removeById = function (id) {
      mongoSitesApi.mgoInterface
        .remove({ "_type": "Note", "_id": id})
        .then(function(res) {
          console.log(res);
        });
    };
  };



  /**
   * Return the constructor function
   */
  return Note;

});
