/* eslint-env node, es6 */
const fs = require('fs');
const path = require('path');

const localesPath = path.resolve(__dirname, '..', 'locales');
const outputPath = path.resolve(__dirname, '..', 'translation.json');
const json = {};
const list = fs.readdirSync(localesPath, 'utf8');

list.forEach((directory) => {
  const tempFile = path.join(localesPath, directory);
  const stat = fs.statSync(tempFile);
  if (stat && stat.isDirectory()) {
    const fileList = fs.readdirSync(tempFile, 'utf8');
    fileList.forEach((file) => {
      const moduleName = file.split('.json')[0];
      if (!json[directory]) json[directory] = {};
      const data = fs.readFileSync(path.join(tempFile, file), 'utf8');
      json[directory][moduleName] = JSON.parse(data);
    });
  }
});

fs.writeFileSync(outputPath, JSON.stringify(json, null, 2), 'utf8');
