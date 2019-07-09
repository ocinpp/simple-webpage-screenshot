# base on the node (LTS) slim image
# https://hub.docker.com/_/node/
FROM node:lts-slim

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# copy additional true type fonts to /usr/share/fonts/truetype/
COPY fonts/* /usr/share/fonts/truetype/

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init
ENTRYPOINT ["dumb-init", "--"]

# create the capture directory in /home/node/app
# create the node_modules subdirectory in /home/node along with the app directory
# set ownership on them to our node user
RUN mkdir -p /home/node/app/capture \
    && mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app

# set the working directory of the application
WORKDIR /home/node/app

# copy the package.json and package-lock.json
COPY package*.json ./

# switch the user to node before running npm install
USER node

# run npm ci to install a project with a clean slate
# https://docs.npmjs.com/cli/ci
RUN npm ci

# copy your application code with the appropriate permissions to the application directory on the container
COPY --chown=node:node . .

# delete fonts directory
RUN rm -r /home/node/app/fonts

# expose the port 80
EXPOSE 80

# start node index.js
CMD [ "node", "index.js" ]