# Simple Webpage Screenshot

[![Known Vulnerabilities](https://snyk.io/test/github/ocinpp/simple-webpage-screenshot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ocinpp/simple-webpage-screenshot?targetFile=package.json)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot?ref=badge_shield)
[![Coverage Status](https://coveralls.io/repos/github/ocinpp/simple-webpage-screenshot/badge.svg?branch=master)](https://coveralls.io/github/ocinpp/simple-webpage-screenshot?branch=master)

Using Express and Puppeteer to take screenshot of an URL and produce the image

## Prerequisites

1. Node.js

## Libraries

1. [Puppeteer](https://github.com/GoogleChrome/puppeteer)
1. [express](https://github.com/expressjs/express/)
1. [Helmet](https://github.com/helmetjs/helmet)
1. [validator](https://github.com/chriso/validator.js)
1. [Jest](https://github.com/facebook/jest)
1. [Pixelmatch](https://github.com/mapbox/pixelmatch)
1. [pngjs](https://github.com/lukeapage/pngjs)
1. [SuperTest](https://github.com/visionmedia/supertest)

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
1. A screenshot (width: 980px) is produced
1. The screenshot can also be found in the **capture** directory

## Testing

[Piexlmatch](https://github.com/mapbox/pixelmatch) is used to compare the pixels of the screenshot and the reference screenshot.

To run the tests, type the below command:

```bash
npm test
```

When running **Jest** with **--coverage**, error will be thrown by Puppeteer if the test uses page.$eval, page.$\$eval or page.evaluate ([https://jestjs.io/docs/en/puppeteer](https://jestjs.io/docs/en/puppeteer)).

```txt
Error: Evaluation failed: ReferenceError: cov_2109gx1kfb is not defined
  at __puppeteer_evaluation_script__:3:7
  at ExecutionContext.evaluateHandle (D:\development\nodejs\simple-webpage-screenshot\node_modules\puppeteer\lib\ExecutionContext.js:121:13)
```

### Reference

[https://github.com/facebook/jest/issues/7962#issuecomment-495272339](https://github.com/facebook/jest/issues/7962#issuecomment-495272339)

## Docker

Build the image

```bash
docker build -t <tag> .
```

Start the container, bind port 3000 of the container to port 80

```bash
docker run -p 80:3000 -d <tag>
```

Visit the page at [http://localhost](http://localhost)

Stop the container

```bash
docker stop <container>
```

## Notes

At this moment, we need to add the **--no-sandbox** argument to start Puppeteer to fix the below.

```txt
No usable sandbox! Update your kernel or see https://chromium.googlesource.com/chromium/src/+/master/docs/linux_suid_sandbox_development.md for more information on developing with the SUID sandbox. If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.
```

Also, by default, Docker runs a container with a **/dev/shm** shared memory space 64MB. This is typically too small for Chrome and will cause Chrome to crash when rendering large pages. Launch the browser with the **--disable-dev-shm-usage** flag:

```javascript
const browser = await puppeteer.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});
```

However, running without a sandbox is strongly discouraged. Consider configuring a sandbox instead.

[https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)

## Jest Issue Reference

[https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)

[https://jestjs.io/docs/en/getting-started.html](https://jestjs.io/docs/en/getting-started.html)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Focinpp%2Fsimple-webpage-screenshot?ref=badge_large)
