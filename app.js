var RouteState = require('route-state');
var handleError = require('handle-error-web');
var { version } = require('./package.json');
var spotifyTokenFlow = require('./flows/spotify-token-flow');
var playFlow = require('./flows/play-flow');
var askToLoginFlow = require('./flows/ask-to-log-in-flow');
var OLPE = require('one-listener-per-element');

var { setListener } = OLPE();

var routeState = RouteState({
  followRoute,
  windowObject: window
});

(function go() {
  renderVersion();
  routeState.routeFromHash();
  window.onerror = reportTopLevelError;
})();

function followRoute(routeDict) {
  var { access_token, state, seed, skipMusic, firstAudioURL } = routeDict;
  if (!seed) {
    seedWithDate();
    return;
  }
  if (!skipMusic && (access_token || state)) {
    spotifyTokenFlow(routeDict, routeState, setListener);
    return;
  } else if (skipMusic === 'yes') {
    playFlow({ seed, routeState, firstAudioURL, setListener });
  } else {
    askToLoginFlow({ routeState, routeDict, setListener });
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function seedWithDate() {
  routeState.addToRoute({ seed: new Date().toISOString() });
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
