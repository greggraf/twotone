import { exec } from 'child_process';

const deployUser = process.env.DEPLOYUSER;
const deployHost = process.env.DEPLOYHOST;
const deployCommand = `rsync -avz build/ ${deployUser}:${deployHost}/scratch/twotone/`;

exec(deployCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});