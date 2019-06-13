var seedrandom = require('seedrandom');
var Probable = require('probable').createProbable;
var scheduleMusic = require('./schedule-music');

var controlsSection = document.getElementById('controls-section');
var startButton = document.getElementById('start-button');

var oldStartListener;

function playFlow({ seed, spotifyToken, spotifyPlayer }) {
  var probable = Probable({ random: seedrandom(seed) });
  initListeners();
  controlsSection.classList.remove('hidden');

  function initListeners() {
    if (oldStartListener) {
      startButton.removeEventListener('click', oldStartListener);
    }
    var startListener = start;
    startButton.addEventListener('click', startListener);
    oldStartListener = startListener;
  }

  function start() {
    if (spotifyPlayer) {
      scheduleMusic({ probable, spotifyPlayer, spotifyToken });
    }
  }
}

module.exports = playFlow;
