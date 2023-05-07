const fs = require('fs').promises;
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const INDEX_FILE = path.join(__dirname, 'index.js');
const DIST_DIR = path.join(__dirname, 'project-dist');
const INDEX_HTML_FILE = path.join(DIST_DIR, 'index.html');
const STYLE_CSS_FILE = path.join(DIST_DIR, 'style.css');

async function copyDir(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  await fs.mkdir(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  // Проверяем наличие папки project-dist
  try {
    await fs.access(DIST_DIR);
    console.log('Папка project-dist уже существует, повторяем скрипт...');
  } catch (err) {
    // Если папки нет, то создаем ее
    await fs.mkdir(DIST_DIR);
    console.log('Создана папка project-dist');
  }

  // Читаем содержимое шаблона страницы
  let html = await fs.readFile(TEMPLATE_FILE, 'utf-8');

  // Получаем список компонентов
  const components = await fs.readdir(COMPONENTS_DIR);

  // Заменяем шаблонные теги в шаблоне страницы на содержимое компонентов
  for (const component of components) {
    const componentName = path.basename(component, '.html');
    const componentPath = path.join(COMPONENTS_DIR, component);
    const componentHtml = await fs.readFile(componentPath, 'utf-8');
    html = html.replace(new RegExp(`{{${componentName}}}`, 'g'), componentHtml);
  }

  // Сохраняем результат в project-dist/index.html
  await fs.writeFile(INDEX_HTML_FILE, html);

  // Собираем в единый файл стили из папки styles
  const styles = await fs.readdir(STYLES_DIR);
  let css = '';
  for (const style of styles) {
    const stylePath = path.join(STYLES_DIR, style);
    const styleCss = await fs.readFile(stylePath, 'utf-8');
    css += styleCss;
  }

  // Помещаем стили в файл project-dist/style.css
  await fs.writeFile(STYLE_CSS_FILE, css);

  // Копируем папку assets в project-dist
  await copyDir(ASSETS_DIR, path.join(DIST_DIR, 'assets'));
}

buildPage();
