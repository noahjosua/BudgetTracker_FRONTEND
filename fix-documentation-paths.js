const fs = require('fs');
const path = require('path');

const docsDir = 'dist/budget-tracker-frontend/browser/documentation';

function fixPaths(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/href="\.\//g, 'href="/documentation/');
  content = content.replace(/src="\.\//g, 'src="/documentation/');
  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (path.extname(file) === '.html') {
      fixPaths(filePath);
    }
  });
}

walkDir(docsDir);
console.log('Documentation paths fixed!');
