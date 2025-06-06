import path from 'path';
import fs from 'fs';

const cwd = process.cwd();

const packageJsonPath = path.resolve(cwd, 'package.json');
const distPackageJsonPath = path.resolve(cwd, 'dist', 'package.json');
console.log('复制 package.json 文件...');
fs.copyFileSync(packageJsonPath, distPackageJsonPath);

const readmePath = path.resolve(cwd, 'README.md');
const distReadmePath = path.resolve(cwd, 'dist', 'README.md');
console.log('复制 README.md 文件...');
fs.copyFileSync(readmePath, distReadmePath);
