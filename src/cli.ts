#!/usr/bin/env node

import * as meow from 'meow';
import launchElectron from './launchElectron';

const cli = meow(
  `
	Usage
	  $ ssb <url>

	Options
    --match Wildcard string to determine what should stay in single site browser or open in default browser
    --screen Index of which screen to put the window on

	Examples
    $ ssb http://localhost:3000
    $ ssb https://google.com --match *.google.com/*
    $ ssb http://localhost:3000 --screen 2

`,
  {
    flags: {
      match: {
        type: 'string'
      },
      screen: {
        type: 'string'
      }
    }
  }
);

if (cli.input.length === 0) {
  cli.showHelp();
  process.exit();
}

const spawnStream = launchElectron(cli.input[0], cli.flags);
process.exit();
