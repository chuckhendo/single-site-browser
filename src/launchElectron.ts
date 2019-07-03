import * as electron from 'electron';
import { spawn } from 'child_process';
import * as normalizeUrl from 'normalize-url';

//@ts-ignore
const electronPath: string = electron;

interface IOptions {
  match: string;
}

export default function launchElectron(url: string, passedOptions: IOptions) {
  // const options = { _: [``], siteUrl: url };
  // console.log(oArgv(options));
  const options = [
    `${__dirname}/electron/index.js`,
    `--url=${normalizeUrl(url)}`,
    ...parsePassedOptions(passedOptions)
  ];

  const cwd = (process && process.cwd()) || __dirname;
  return spawn(electronPath, options, { cwd, detached: true });
}

function parsePassedOptions(passedOptions: IOptions): string[] {
  return Object.keys(passedOptions).map(key => {
    return `--${key}=${passedOptions[key]}`;
  });
}
