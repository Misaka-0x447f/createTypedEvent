import {execSync} from 'child_process';

const main = async () => {
    console.log('构建...');
    execSync('pnpm tsup', {stdio: 'inherit'});
    console.log('发布...');
    execSync('pnpm np --contents=./dist --no-tests', {stdio: 'inherit'});
};

main();
