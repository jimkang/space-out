var WrapRedirect = require('../tasks/wrap-redirect');

var loginSection = document.getElementById('login-section');
var controlsSection = document.getElementById('controls-section');
var logInButton = document.getElementById('log-in-button');
var skipMusicButton = document.getElementById('skip-music-button');

var oldLogInListener;
var oldSkipMusicListener;

function askToLoginFlow({ routeState, routeDict }) {
  initListeners();
  loginSection.classList.remove('hidden');
  controlsSection.classList.add('hidden');

  function initListeners() {
    if (oldLogInListener) {
      logInButton.removeEventListener('click', oldLogInListener);
    }
    var logInListener = WrapRedirect(routeDict);
    logInButton.addEventListener('click', logInListener);
    oldLogInListener = logInListener;

    if (oldSkipMusicListener) {
      skipMusicButton.removeEventListener('click', oldSkipMusicListener);
    }
    skipMusicButton.addEventListener('click', routeToSkip);
    oldSkipMusicListener = routeToSkip;
  }

  function routeToSkip() {
    loginSection.classList.add('hidden');
    routeState.addToRoute({ skipMusic: 'yes' });
  }
}

module.exports = askToLoginFlow;
