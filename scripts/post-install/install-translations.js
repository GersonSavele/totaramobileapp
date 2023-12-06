#!/usr/bin/env node

"use strict";

const download = require("download");
const path = require("path");
const yauzl = require("yauzl-promise"),
  fs = require("fs"),
  { pipeline } = require("stream/promises");

const LANGS_FOLDER = path.join(__dirname, "../..", "src/totara/locale/languages/");
const LANGS_URL = "https://download.totaralms.com/lang/T15/";
const ZIP_FILE_NAME = "mobile.json.zip";

const downloadURL = `${LANGS_URL}${ZIP_FILE_NAME}`;

async function main() {
  console.log(`Downloading translations from ${downloadURL}`);
  const fetched = await download(downloadURL, LANGS_FOLDER);

  const zipFile = LANGS_FOLDER + ZIP_FILE_NAME;
  console.log(`Downloaded ${zipFile} with size of ${fetched.length / 1024} KB`);

  const zip = await yauzl.open(zipFile);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.promises.mkdir(`${LANGS_FOLDER}${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(`${LANGS_FOLDER}${entry.filename}`);
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }

  const folder = fs.readdirSync(LANGS_FOLDER);
  const filter = folder.filter(x => path.extname(x).toLowerCase() === ".json" && x !== "all.json");

  console.log(`${filter.length} translations have been found.`);
  console.log(filter);

  const body = {};

  filter.forEach(x => {
    console.log(x);
    const lang = x.split(".")[0];
    const content = fs.readFileSync(LANGS_FOLDER + x, "utf8");
    try {
      body[lang] = JSON.parse(content);
    } catch (e) {
      console.error("Could not parse for json: ", e);
    }
  });

  fs.writeFileSync(`${LANGS_FOLDER}all.json`, JSON.stringify(body, null, 2));
  console.info(`Written all.json to ${LANGS_FOLDER}`);

  fs.unlinkSync(zipFile);
  console.log(`Deleted ${zipFile}`);
}

main();
