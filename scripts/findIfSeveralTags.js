/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const fetch = require('node-fetch');
// const path = require('path');

const API_URL = 'http://visittampere.fi:80/api/search?type=event&lang=en&limit=1000';
// const FILE = path.resolve(__dirname, '..', 'tags_list.txt');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function parseTags(data) {
  return new Promise((resolve) => {
    const tags = [];

    data.forEach((event) => {
      if (event.tags.length > 1) console.log(`tags: ${event.tags.length}`);
      tags.push(
        ...event.tags
          .filter(tag => !tags.includes(tag))
      );
    });

    resolve(tags);
  });
}

// function writeFile(tags) {
//   const string = tags.join('\n');
//   fs.writeFileSync(FILE, string, 'utf8');
// }

function logResult(tags) {
  console.log(`total tags: ${tags.length}`);
}

fetch(API_URL)
  .then(checkStatus)
  .then(parseJSON)
  .then(parseTags)
  .then(logResult)
  .catch(error => {
    console.error(API_URL, 'request failed', error.toString());
  });
