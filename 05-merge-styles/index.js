const fs = require('fs').promises;
const path = require('path');

const styles = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');
const bundle = path.join(projectDir, 'bundle.css');

async function mergeStyles() {
  try {

    const cssFiles = (await fs.readdir(styles)).filter(file => {
      return path.extname(file) === '.css';
    });

    const bundleCssContent = await cssFiles.reduce(async (contentPromise, file) => {
      const cssFilePath = path.join(styles, file);
      const cssFileContent = await fs.readFile(cssFilePath, 'utf8');
      const content = await contentPromise;
      return content + cssFileContent;
    }, '');

    await fs.writeFile(bundle, bundleCssContent);

    console.log('Выполнено! Стили собраны!');
  } catch (err) {
    console.error(err);
  }
}

mergeStyles();