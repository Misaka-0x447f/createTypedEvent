import path from 'path';
import fs from 'fs';

const packageJsonPath = path.resolve(__dirname, 'package.json');
const distPackageJsonPath = path.resolve(__dirname, 'dist', 'package.json');
console.log('复制 package.json 文件...');
fs.copyFileSync(packageJsonPath, distPackageJsonPath);

const readmePath = path.resolve(__dirname, 'README.md');
const distReadmePath = path.resolve(__dirname, 'dist', 'README.md');
console.log('复制 README.md 文件...');
fs.copyFileSync(readmePath, distReadmePath);
