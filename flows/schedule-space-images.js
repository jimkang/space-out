var easyR = require('easy-browser-request');
var handleError = require('handle-error-web');
var getAtPath = require('get-at-path');
var squarifyBoard = require('../squarify-board');
var d3 = require('d3-selection');
require('d3-transition');

squarifyBoard();

const imageInterval = 20000; // 30000;
const transitionDuration = 5000;

var underImage = d3.select('#under-image');
var overImage = d3.select('#over-image');

async function scheduleSpaceImages({ probable }) {
  var r = await easyR({
    method: 'GET',
    url: 'https://images-api.nasa.gov/search?q=space&media_type=image',
    json: true
  });
  if (r.error) {
    handleError(r.error);
  } else {
    var items = getAtPath(r, ['body', 'collection', 'items']);
    if (items) {
      let item = probable.pick(items);
      if (item.href) {
        let collectionR = await easyR({
          method: 'GET',
          url: item.href,
          json: true
        });
        if (collectionR.error) {
          handleError(collectionR.error);
        } else {
          renderImage(getBestImage(collectionR.body));
        }
      }
    }
  }
  setTimeout(() => scheduleSpaceImages({ probable }), imageInterval);
}

function getBestImage(images) {
  var url;
  for (var i = 0; i < images.length; ++i) {
    let curURL = images[i];
    if (!url) {
      url = curURL;
    } else if (curURL.includes('large')) {
      url = curURL;
      break;
    } else if (curURL.includes('medium')) {
      url = curURL;
    }
  }
  return url;
}

function renderImage(imageURL) {
  var imageToShow;
  var imageToHide;
  if (+overImage.attr('opacity') === 0) {
    imageToShow = overImage;
    imageToHide = underImage;
  } else {
    imageToShow = underImage;
    imageToHide = overImage;
  }

  imageToShow.attr('xlink:href', imageURL);
  imageToShow
    .transition()
    .duration(transitionDuration)
    .attr('opacity', 1.0);
  imageToHide
    .transition()
    .duration(transitionDuration)
    .attr('opacity', 0.0);
}

module.exports = scheduleSpaceImages;
