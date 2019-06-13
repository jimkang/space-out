var redirectToAuth = require('./redirect-to-auth');
var config = require('../config');

const scopeString = 'user-read-playback-state user-modify-playback-state';
//const scopeString =
('user-read-recently-played user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-birthdate user-read-email user-read-private app-remote-control radio-modify radio-read');

function WrapRedirect(routeDict) {
  return wrapRedirect;

  function wrapRedirect() {
    redirectToAuth(routeDict, scopeString, config);
  }
}

module.exports = WrapRedirect;
