var randomIA = require('random-internet-archive');
var handleError = require('handle-error-web');
var request = require('basic-browser-request');
var sb = require('standard-bail')();

var soundPlayer = document.getElementById('sound-player');
var soundLink = document.getElementById('sound-link');
var currentlyPlayingSection = document.getElementById(
  'currently-playing-sound'
);

soundPlayer.volume = 0.7;

var oldEndedListener;

function scheduleSpaceAudio({ random }) {
  if (oldEndedListener) {
    soundPlayer.removeEventListener(oldEndedListener);
  }
  var endedListener = playNextIfPossible;
  soundPlayer.addEventListener('ended', endedListener);
  oldEndedListener = endedListener;

  var audioPacks = [];

  getAudioQueueToSize(10);

  function getAudioQueueToSize(size) {
    if (audioPacks.length >= size) {
      return;
    }
    getNextAudio(sb(() => getAudioQueueToSize(size), handleError));
  }

  function getNextAudio(done) {
    randomIA(
      {
        request,
        random,
        proxyBaseURL: 'https://jimkang.com/internet-archive',
        format: 'mp3',
        fileExtensions: ['mp3'],
        collection: 'nasaaudiocollection',
        mediatype: 'audio',
        maxTries: 100
      },
      sb(addToAudioPacks, done)
    );

    function addToAudioPacks(audioPack) {
      audioPacks.push(audioPack);
      playNextIfPossible();
    }
  }

  function playNextIfPossible() {
    if (!soundPlayer.paused || audioPacks.length < 1) {
      return;
    }
    var pack = audioPacks.shift();
    soundPlayer.src = pack.url;
    soundPlayer.play();
    currentlyPlayingSection.classList.remove('hidden');
    soundLink.href = pack.detailsURL;
    soundLink.textContent = pack.title;
    console.log('Just played. Current queue:', audioPacks);
    // Replenish the queue.
    getNextAudio(handleError);
  }
}

module.exports = scheduleSpaceAudio;
