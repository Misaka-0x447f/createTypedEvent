import {execSync} from 'child_process';
import path from 'path';
import fs from 'fs';
import * as readline from "node:readline";

const main = async () => {
    console.log('构建...');
    execSync('pnpm tsup', {stdio: 'inherit'});

    execSync('pnpm np --contents=./dist --no-tests --no-publish', {stdio: 'inherit'});

    const packageJsonPath = path.resolve(__dirname, 'package.json');
    const distPackageJsonPath = path.resolve(__dirname, 'dist', 'package.json');
    console.log('复制 package.json 文件...');
    fs.copyFileSync(packageJsonPath, distPackageJsonPath);

    const readmePath = path.resolve(__dirname, 'README.md');
    const distReadmePath = path.resolve(__dirname, 'dist', 'README.md');
    console.log('复制 README.md 文件...');
    fs.copyFileSync(readmePath, distReadmePath);

    const distDir = path.resolve(__dirname, 'dist');
    process.chdir(distDir);

    // 按任意键确认发布
    const waitForAnyKey = async () => {
        console.log('按任意键以确认发布...');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise<void>((resolve) => {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(true);
            }
            process.stdin.resume();
            process.stdin.on('data', () => {
                rl.close();
                resolve();
            });
        });
    };

    await waitForAnyKey();

    // 发布到 npm
    console.log('正在发布...');
    execSync('pnpm publish', {stdio: 'inherit'});
};

main();
