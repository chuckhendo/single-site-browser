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
