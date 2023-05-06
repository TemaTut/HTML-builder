const fs = require('fs');
const path = require('path');

function copyDir() {
  const files = path.join(__dirname, 'files');
  const filesCopy = path.join(__dirname, 'files-copy');

  fs.mkdir(filesCopy, (err) => {
    if (err && err.code !== 'EEXIST') {
      console.error(`Failed to create directory ${filesCopy}: ${err}`);
      return;
    }

    fs.readdir(filesCopy, (err, destFiles) => {
      if (err) {
        console.error(`Failed to read directory ${filesCopy}: ${err}`);
        return;
      }

      fs.readdir(files, (err, srcFiles) => {
        if (err) {
          console.error(`Failed to read directory ${files}: ${err}`);
          return;
        }

        srcFiles.forEach((file) => {
          const srcPath = path.join(files, file);
          const destPath = path.join(filesCopy, file);

          fs.readFile(srcPath, (err, data) => {
            if (err) {
              console.error(`Failed to read file ${srcPath}: ${err}`);
              return;
            }

            fs.writeFile(destPath, data, (err) => {
              if (err) {
                console.error(`Failed to write file ${destPath}: ${err}`);
                return;
              }
            });
          });
        });

        destFiles.forEach((file) => {
          if (!srcFiles.includes(file)) {
            const destPath = path.join(filesCopy, file);

            fs.unlink(destPath, (err) => {
              if (err) {
                console.error(`Failed to delete file ${destPath}: ${err}`);
                return;
              }
            });
          }
        });
      });
    });
  });
}

copyDir();