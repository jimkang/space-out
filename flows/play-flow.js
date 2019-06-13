var seedrandom = require('seedrandom');
var Probable = require('probable').createProbable;
var scheduleMusic = require('./schedule-music');
var scheduleSpaceAudio = require('./schedule-space-audio');
var registerSingleListener = require('../register-single-listener');
var callNextTick = require('call-next-tick');

var controlsSection = document.getElementById('controls-section');
var startButton = document.getElementById('start-button');
var restartButton = document.getElementById('restart-button');

// startPlaying is for the benefit of restart(). Should not be passed from anything else.
function playFlow({
  seed,
  spotifyToken,
  spotifyPlayer,
  routeState,
  startPlaying
}) {
  var random = seedrandom(seed);
  var probable = Probable({ random });

  registerSingleListener({
    element: startButton,
    eventName: 'click',
    listener: start
  });
  registerSingleListener({
    element: restartButton,
    eventName: 'click',
    listener: restart
  });
  controlsSection.classList.remove('hidden');
  startButton.classList.remove('hidden');

  if (startPlaying) {
    start();
  }

  function start() {
    restartButton.classList.remove('hidden');

    if (spotifyPlayer) {
      scheduleMusic({ probable, spotifyPlayer, spotifyToken });
    }
    scheduleSpaceAudio({ random });
    startButton.classList.add('hidden');
  }

  function restart() {
    var seed = new Date().toISOString();
    // Don't follow the route.
    routeState.addToRoute({ seed }, false);
    callNextTick(playFlow, {
      seed,
      spotifyToken,
      spotifyPlayer,
      routeState,
      startPlaying: true
    });
  }
}

module.exports = playFlow;
