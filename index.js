const OUTPUT_DIR = "capture";

const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const helmet = require("helmet");
const validator = require("validator");
const app = express();
const port = 3000;

app.use(helmet());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

async function generateScreenshotFile(url) {
  console.log("Generating screenshot file...");

  let browser, page, filePath;

  try {
    // new browser for each call
    browser = await puppeteer.launch({ headless: true });

    // open new page
    page = await browser.newPage();
    page.on("console", msg => console.log(`Page Console: ${msg.text()}`));

    // set view port
    await page.setViewport({ width: 980, height: 1000 });

    // wait until network idle
    await page.goto(url, { waitUntil: "networkidle2" });

    // remove the first, second and last <p>
    await page.evaluate(() => {
      try {
        elements = document.querySelectorAll("body > p");
        elements[0].remove();
        elements[1].remove();
        elements[elements.length - 1].remove();
      } catch (err) {
        console.error(err);
      }
    });

    let ts = new Date().toISOString();
    ts = ts.replace(/:/g, "").replace(/\./g, "");
    const filename = `capture-${ts}.png`;
    filePath = `${OUTPUT_DIR}${path.sep}${filename}`;

    // generate full page screenshot
    await page.screenshot({ path: `${filePath}`, fullPage: true });
  } finally {
    // close the page
    await page.close();

    // close browser
    await browser.close();
  }

  return filePath;
}

app.post("/convert", async(req, res) => {
  try {
    // input validation
    const inputUrl = req.body["url"];
    const validUrl = validator.isURL(inputUrl, {
      protocols: ["http", "https"]
    });

    if (!validUrl) {
      res.status(400);
      res.send("Please input a valid URL!");
      return;
    }

    console.log(`URL: ${inputUrl}`);
    const filePath = await generateScreenshotFile(inputUrl);
    console.log(`File generated at ${filePath}`);

    var options = {
      root: __dirname,
      dotfiles: "deny",
      headers: {
        "X-Timestamp": Date.now(),
        "X-Sent": true
      }
    };

    res.sendFile(filePath, options, (err) => {
      if (err) {
        next(err);
      } else {
        console.log("Sent:", filePath);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(`Error generating screenshot: ${err.message}`);
  }
});

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

module.exports = server;
