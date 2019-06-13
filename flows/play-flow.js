var seedrandom = require('seedrandom');
var Probable = require('probable').createProbable;
var scheduleMusic = require('./schedule-music');
var scheduleSpaceAudio = require('./schedule-space-audio');
var registerSingleListener = require('../register-single-listener');

var controlsSection = document.getElementById('controls-section');
var startButton = document.getElementById('start-button');

function playFlow({ seed, spotifyToken, spotifyPlayer }) {
  var random = seedrandom(seed);
  var probable = Probable({ random });

  registerSingleListener({
    element: startButton,
    eventName: 'click',
    listener: start
  });
  controlsSection.classList.remove('hidden');
  startButton.classList.remove('hidden');

  function start() {
    if (spotifyPlayer) {
      scheduleMusic({ probable, spotifyPlayer, spotifyToken });
    }
    scheduleSpaceAudio({ random });
    startButton.classList.add('hidden');
  }
}

module.exports = playFlow;
