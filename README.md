[![Known Vulnerabilities](https://snyk.io/test/github/ocinpp/simple-webpage-screenshot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ocinpp/simple-webpage-screenshot?targetFile=package.json)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot?ref=badge_shield)

# Simple Webpage Screenshot

Using Express and Puppeteer to take screenshot of an URL and produce the image

## Prerequisites

1. Node.js

## How to use

1. Clone the repository
1. Create a directory **capture** to for storing screenshots
1. Install the dependencies

    ```bash
    npm install
    ```

1. Start the app

    ```bash
    node index.js
    ```

1. Open a browser and go to [http://localhost:3000](http://localhost:3000)
1. Enter an **URL** (e.g. [http://www.google.com](http://www.google.com)) you wish to take full screen screenshot
1. Click the **Generate** button
1. A screenshot (width: 800px) is produced
1. The screenshot can also be found in the **capture** directory