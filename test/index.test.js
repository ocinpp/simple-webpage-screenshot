const request = require("supertest");
const fs = require("fs");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;

const REF_SCREENCAPTURE = "./test/example-com-sample.png";
const REF_URL = "https://example.com";

let server;

beforeEach(() => {
  server = require("../index");
});

afterEach(() => {
  server.close();
});

describe("Loading express", () => {
  test("Responds to /", done => {
    request(server)
      .get("/")
      .expect(200, done);
  });
  test("404 everything else", done => {
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  });
});

const parsePNG = response => {
  return new Promise((resolve, reject) => {
    // parse the response body to a PNG and resolve the promise in the callback
    new PNG().parse(response.body, (error, data) => {
      resolve(data);
    });
  });
};

describe("Checking capture", () => {
  // set the timeout to 60 seconds
  test(`Responds to /convert with input as ${REF_URL}`, async () => {
    expect.assertions(3);
    await request(server)
      .post("/convert")
      .type("form")
      .send({ url: REF_URL })
      .expect(200)
      .expect("Content-Type", "image/png")
      .expect("X-Sent", "true")
      .then(parsePNG)
      .then(screenCapture => {
        // parse the prepared reference screenshot using sync API
        const expectedCaptureData = fs.readFileSync(REF_SCREENCAPTURE);
        const expectedCapture = PNG.sync.read(expectedCaptureData);

        expect(screenCapture.width).toBe(expectedCapture.width);
        expect(screenCapture.height).toBe(expectedCapture.height);

        // call pixelmatch to check the pixel difference
        const diffPixels = pixelmatch(
          screenCapture.data,
          expectedCapture.data,
          null,
          screenCapture.width,
          screenCapture.height,
          { threshold: 0.1 }
        );

        expect(diffPixels).toBe(0);
      });
  }, 60000);
});

describe("Going to invalid domain http://xxxxxxxxxxxxxxyyyzzz.com", () => {
  // set the timeout to 60 seconds
  test("500 cannot resolve domain", async () => {
    await request(server)
      .post("/convert")
      .type("form")
      .send({ url: "http://xxxxxxxxxxxxxxyyyzzz.com" })
      .expect(500)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then(response => {
        expect(response.text).toBe(
          "Error generating screenshot: net::ERR_NAME_NOT_RESOLVED at http://xxxxxxxxxxxxxxyyyzzz.com"
        );
      });
  }, 60000);
});

describe("Going to invalid URL", () => {
  // set the timeout to 60 seconds
  test("400 invalid URL", async () => {
    await request(server)
      .post("/convert")
      .type("form")
      .send({ url: "http:///sss" })
      .expect(400)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then(response => {
        expect(response.text).toBe(
          "Please input a valid URL!"
        );
      });
  }, 60000);
});
