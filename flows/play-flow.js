var seedrandom = require('seedrandom');
var Probable = require('probable').createProbable;
var scheduleMusic = require('./schedule-music');
var scheduleSpaceAudio = require('./schedule-space-audio');

var controlsSection = document.getElementById('controls-section');
var startButton = document.getElementById('start-button');

var oldStartListener;

function playFlow({ seed, spotifyToken, spotifyPlayer }) {
  var random = seedrandom(seed);
  var probable = Probable({ random });
  initListeners();
  controlsSection.classList.remove('hidden');
  startButton.classList.remove('hidden');

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
    scheduleSpaceAudio({ random });
    startButton.classList.add('hidden');
  }
}

module.exports = playFlow;
