const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((filename) => {
    const filePath = path.join(folderPath, filename);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!stats.isFile()) {
        // не обрабатываем папки
        return;
      }

      const ext = path.extname(filename).substring(1);
      const size = stats.size;
      console.log(`${filename}-${ext}-${size} bytes`);
    });
  });
});