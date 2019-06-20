var WrapRedirect = require('../tasks/wrap-redirect');

var loginSection = document.getElementById('login-section');
var controlsSection = document.getElementById('controls-section');
var logInButton = document.getElementById('log-in-button');
var skipMusicButton = document.getElementById('skip-music-button');

function askToLoginFlow({ routeState, routeDict, setListener }) {
  setListener({
    element: logInButton,
    eventName: 'click',
    listener: WrapRedirect(routeDict)
  });
  setListener({
    element: skipMusicButton,
    eventName: 'click',
    listener: routeToSkip
  });
  loginSection.classList.remove('hidden');
  controlsSection.classList.add('hidden');

  function routeToSkip() {
    loginSection.classList.add('hidden');
    routeState.addToRoute({ skipMusic: 'yes' });
  }
}

module.exports = askToLoginFlow;
