const path = require('path');
const readingMyText = require('fs');

const filePath = path.join(__dirname, 'text.txt');

readingMyText.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});