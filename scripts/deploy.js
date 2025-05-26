import { exec } from 'child_process';

// This script deploys the build to the server
// It expcets a DEPLOYUSER and DEPLOYHOST environment variable
// And it uses rsync to sync the build to the server
// I also set up key based permissions for running the rsync command without having to enter a password
// great, I also assume you want the build to be deployed to scratch/twotone I guess i should change that

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