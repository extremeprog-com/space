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

            res.forEach(function (item, idx) {
              data[item.section].subsections.forEach(function (sub, i) {

                if( sub.id == item.subsection) {
                  data[item.section].subsections[i].note = item.content;
                }
              })
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
     * @param {string} section
     * @param {string} subsection
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
     * Update note
     * @memberOf Note
     * @function
     * @param {string} email
     * @param {string} subsection
     * @param {string} text
     * @param {function} callback
     */
    that.update = function (subsection, text, callback) {

      console.log("Subsection: " + subsection + " text: " + text);
      mongoSitesApi.mgoInterface
        .update(
          {
            "_type": "Note",
            "subsection": subsection
          }, {
            "$set": {
              "content": text
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
     * Remove note
     * @memberOf Note
     * @function
     * @param {string} subsection
     */
    that.remove = function (subsection) {
      mongoSitesApi.mgoInterface
        .remove({ "_type": "Note", "subsection": subsection })
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
