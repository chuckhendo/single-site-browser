# single-site-browser

Command line utility to open a website in a dedicated Chrome/Electron window. Clicking a link that would take you off-site opens the site in the system's default web browser. Useful for web development

## Installation

`npm i -g @chuckhendo/single-site-browser`

or

`yarn global add @chuckhendo/single-site-browser`

## Usage Examples

- `ssb localhost:3000` - open http://localhost:3000. All links clicked on that will go somewhere other than localhost:3000 will open in the default browser.
  For example, clicking on a link that takes you to http://localhost:3000/subpage will stay inside the single site browser; clicking on a link for http://github.com will open in the default browser.
- `ssb localhost.com --match *localhost.com/**` - Match option changes how links are determined to be external or not.
  In this case, links that will stay internal include www.localhost.com and subdomain.localhost.com/subpage.
- `ssb localhost:3000 --screen 2` - opens the browser on your second display, and is sized to use the entire screen
- `ssb localhost:3000 --debugging-port 9222` - enables Chrome's remote debugging for VSCode debugger integration and Puppeteer

## Keyboard shortcuts

- `cmd+left arrow`: back
- `cmd+right arrow`: forward
- `cmd+shift+h`: back to original url that you entered on command line

## Programmatic Use

This package can also be used in Node. Just install the package locally with `npm install @chuckhendo/single-site-browser` or `yarn add @chuckhendo/single-site-browser`.

```javascript
const { ssb } = require('@chuckhendo/single-site-browser');

ssb('localhost.com', { screen: 2, match: '*localhost.com/**' });
```

## VSCode Debugger setup
1. Ensure Chrome debugger extension is installed in Code: https://github.com/microsoft/vscode-chrome-debug
2. Open ssb with remote debugging enabled: `ssb localhost:3000 --debugging-port 9222`
3. Setup a `.vscode/launch.json` with the following config (read more [here](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations))
    ```json
    {
      "name": "Attach to SSB",
      "type": "chrome",
      "request": "attach",
      "port": 9222,
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
    }
    ```
4. Launch debugger by going to the Debug view and pressing "Start Debugging" 
