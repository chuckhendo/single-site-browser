import { spawn } from 'child_process';
import * as electron from 'electron';
import * as normalizeUrl from 'normalize-url';

//@ts-ignore
const electronPath: string = electron;

interface IOptions {
  match: string;
  screen: number;
  debug: boolean;
}

export default function launchElectron(url: string, passedOptions: IOptions) {
  const options = [
    `${__dirname}/electron/index.js`,
    `--url=${normalizeUrl(url)}`,
    ...parsePassedOptions(passedOptions)
  ];

  const cwd = (process && process.cwd()) || __dirname;
  return spawn(electronPath, options, { cwd, detached: !passedOptions.debug });
}

function parsePassedOptions(passedOptions: IOptions): string[] {
  return Object.keys(passedOptions).map(key => {
    return `--${key}=${passedOptions[key]}`;
  });
}
