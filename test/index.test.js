const request = require("supertest");
const fs = require("fs");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;

const REF_SCREENCAPTURE = "./test/example-com-sample.png";

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

const parsePNG = (response) => {
  return new Promise((resolve, reject) => {
    // parse the response body to a PNG
    const png = new PNG().parse(response.body);
    resolve(png);
  });
};

describe("Check capture of https://example.com", () => {
  test("Responds to /convert", async () => {
    expect.assertions(3);
    await request(server)
      .post("/convert")
      .type("form")
      .send({ url: "https://example.com/" })
      .expect(200)
      .expect("Content-Type", "image/png")
      .expect("X-Sent", "true")
      .then(parsePNG)
      .then(screenCapture => {
        return new Promise((resolve, reject) => {
          const doneReading = () => {
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
            resolve();
          };

          // parse the prepared reference screenshot
          const expectedCapture = fs
            .createReadStream(REF_SCREENCAPTURE)
            .pipe(new PNG())
            .on("parsed", doneReading);
        });
      });
  });
});

describe("Go to invalid domain http://xxxxxxxxxxxxxxyyyzzz.com", () => {
  test("500 cannot resolve domain", async () => {
    await request(server)
      .post("/convert")
      .type("form")
      .send({ url: "http://xxxxxxxxxxxxxxyyyzzz.com" })
      .expect(500)
      .expect("Content-Type", "text/html; charset=utf-8")
      .then(response => {
        expect(response.text).toBe('Error generating screenshot: net::ERR_NAME_NOT_RESOLVED at http://xxxxxxxxxxxxxxyyyzzz.com');
      })
  });
});
