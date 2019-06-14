var easyR = require('easy-browser-request');
var handleError = require('handle-error-web');
var getAtPath = require('get-at-path');
var squarifyBoard = require('../squarify-board');
var d3 = require('d3-selection');
require('d3-transition');

const imageInterval = 20000; // 30000;
const transitionDuration = 5000;

squarifyBoard();

var imageLink = d3.select('#image-link');
var currentImageSection = d3.select('#current-image');

var keywordTable = [
  [1, 'Orion'],
  [2, 'Telescope'],
  [1, 'Galileo'],
  [2, 'WISE'],
  [3, 'Spitzer'],
  [3, 'Hubble'],
  [2, 'Jupiter'],
  [1, 'Voyager'],
  [1, 'Sun'],
  [1, 'Nebula'],
  [1, 'Herschel'],
  [1, 'GALEX'],
  [2, 'space']
];

var underImage = d3.select('#under-image');
var overImage = d3.select('#over-image');

async function scheduleSpaceImages({ probable }) {
  var keyword = probable.createTableFromSizes(keywordTable).roll();

  var r = await easyR({
    method: 'GET',
    url: `https://images-api.nasa.gov/search?q=&media_type=image&keywords=${keyword}`,
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
          renderImage({
            imageURL: getBestImage(collectionR.body),
            name: getAtPath(item, ['data', '0', 'title']),
            detailsURL: `https://images.nasa.gov/details-${getAtPath(item, [
              'data',
              '0',
              'nasa_id'
            ])}.html`
          });
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

function renderImage({ name, imageURL, detailsURL }) {
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

  currentImageSection.classed('hidden', false);

  imageLink.attr('href', detailsURL).text(name);
}

module.exports = scheduleSpaceImages;
