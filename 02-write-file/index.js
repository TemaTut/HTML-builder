const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

console.log('Введите текст (для выхода введите "exit"):');

process.stdin.on('data', data => {
  const input = data.toString().trim();
  if (input === 'exit') {
    console.log('До свидания!');
    process.exit();
  } else {
    fs.appendFile(filePath, input + '\n', err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Текст "${input}" успешно записан в файл.`);
      }
    });
  }
});