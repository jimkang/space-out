var redirectToAuth = require('./redirect-to-auth');
var config = require('../config');

const scopeString =
  'user-read-playback-state user-modify-playback-state streaming app-remote-control user-read-birthdate user-read-email user-read-private';

function WrapRedirect(routeDict) {
  return wrapRedirect;

  function wrapRedirect() {
    redirectToAuth(routeDict, scopeString, config);
  }
}

module.exports = WrapRedirect;
