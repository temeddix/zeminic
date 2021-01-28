/* global getCookie setCookie */

window.deleteCookie = function (cookieName) {
  var temp = getCookie(cookieName);
  if (temp) {
    setCookie(cookieName, temp, (new Date(1)));
  }
}