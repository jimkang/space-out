var randomIA = require('random-internet-archive');
var handleError = require('handle-error-web');
var request = require('basic-browser-request');
var sb = require('standard-bail')();

var soundPlayer = document.getElementById('sound-player');
var soundLink = document.getElementById('sound-link');
var nextSound = document.getElementById('next-sound');
var currentlyPlayingSection = document.getElementById(
  'currently-playing-sound'
);

function scheduleSpaceAudio({ random, firstAudioURL, setListener }) {
  // This is important, as the sound can't change unless things are stopped.
  soundPlayer.pause();

  setListener({
    element: soundPlayer,
    eventName: 'ended',
    listener: playNextIfPossible
  });
  setListener({
    element: nextSound,
    eventName: 'click',
    listener: playNext
  });

  var audioPacks = [];
  if (firstAudioURL) {
    audioPacks.push({ url: firstAudioURL });
  }

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
      done();
    }
  }

  function playNextIfPossible() {
    if (!soundPlayer.paused) {
      return;
    }
    playNext();
  }

  async function playNext() {
    if (audioPacks.length < 1) {
      return;
    }
    var pack = audioPacks.shift();
    soundPlayer.src = pack.url;
    soundPlayer.volume = 0.8;

    soundPlayer.play();
    currentlyPlayingSection.classList.remove('hidden');
    soundLink.href = pack.detailsURL;
    soundLink.textContent = pack.title;
    console.log('Just played. Current queue:', audioPacks);
    // Replenish the queue.
    getAudioQueueToSize(10);
  }
}

module.exports = scheduleSpaceAudio;
