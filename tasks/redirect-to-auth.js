var qs = require('qs');

function redirectToAuth(routeDict, scopesString, config) {
  var redirectURI =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname;

  var originalRoute = qs.stringify(routeDict);
  var authURI =
    'https://accounts.spotify.com/authorize?' +
    'client_id=' +
    config.spotify.clientId +
    '&response_type=token' +
    '&scope=' +
    scopesString +
    '&redirect_uri=' +
    encodeURIComponent(redirectURI) +
    '&state=' +
    encodeURIComponent(originalRoute) +
    '&show_dialog=false';

  window.location.href = authURI;
}

module.exports = redirectToAuth;
