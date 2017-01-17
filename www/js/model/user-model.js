/**
 * Created by trean on 20.12.16.
 */

"use strict";

app.factory('User', function() {

  /**
   * User list model
   * @class User
   */
  var User = function (apply) {

    var that = this;

    if (window.localStorage.spaceUser) {
      that.email = angular.fromJson(window.localStorage.spaceUser).email;
      that.hash = angular.fromJson(window.localStorage.spaceUser).hash;
      apply();
    }

    that.domen = window.location.protocol + '//' + window.location.host;

    /**
     * Get user's email and hash from MSA
     * @memberOf User
     * @function
     */
    that.getUser = function (callback) {
      mongoSitesApi
        .auth_check()
        .then(function (res) {
          if (!res) {
            window.location.pathname = '/login.html';
          } else {

            that.email = res._id;
            that.hash = res.hash;
            console.log('User', that.email, that.hash);

            var user = {};
            user.email = that.email;
            user.hash = that.hash;

            window.localStorage.gitGymUser = angular.toJson(user);

            if (callback) callback(user);

            apply();
          }
        });
    };


    /**
     * User logout
     * @memberOf User
     * @function
     */
    that.logout = function (event) {
      event.preventDefault();

      mongoSitesApi
        .auth_logout()
        .then(function (res) {
          console.log(res);

          window.location.pathname = '/login.html';
        });
    };
  };

  /**
   * Return the constructor function
   */
  return User;
});
