import { spawn } from 'child_process';
import * as electron from 'electron';
import * as normalizeUrl from 'normalize-url';

//@ts-ignore
const electronPath: string = electron;

interface Options {
  match?: string;
  screen?: number;
  debug?: boolean;
  debuggingPort?: string;
}

function parsePassedOptions(passedOptions: Options): string[] {
  return Object.keys(passedOptions).map(key => {
    return `--${key}=${passedOptions[key]}`;
  });
}

export function ssb(url: string, passedOptions: Options = {}) {
  const options = [
    `${__dirname}/electron/index.js`,
    `--url=${normalizeUrl(url)}`,
    ...parsePassedOptions(passedOptions)
  ];

  const cwd = (process && process.cwd()) || __dirname;
  return spawn(electronPath, options, { cwd, detached: !passedOptions.debug });
}
