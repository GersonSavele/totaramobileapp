#!/usr/bin/env node

"use strict";

const fs = require("fs");
const https = require("https");
const path = require("path");
const unzipper = require('unzipper');

const LANGS_FOLDER = path.join(__dirname, "../..", "src/totara/locale/languages/");
const LANGS_URL = "https://download.totaralms.com/lang/T15/";
const ZIP_FILE_NAME = "mobile.json.zip";

const downloadURL = `${LANGS_URL}${ZIP_FILE_NAME}`;

async function main() {
  try {
    console.log(`Downloading translations from ${downloadURL}`);
    const zipFilePath = path.join(LANGS_FOLDER, ZIP_FILE_NAME);

    // Download file
    await download(downloadURL, zipFilePath);

    console.log(
      `Downloaded ${zipFilePath} with size of ${(
        fs.statSync(zipFilePath).size /
        1024
      ).toFixed(2)} KB`
    );

    // Unzip file
    await unzip(zipFilePath, LANGS_FOLDER);

    catalogLanguageFiles(LANGS_FOLDER);

    // Remove zip file
    fs.unlinkSync(zipFilePath);
    console.log(`Deleted ${zipFilePath}`);

  } catch (error) {
    console.error(`Error during download: ${error}`);
  }
}

async function download(url, dest) {
  return await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        // Check if the response is a successful status
        if (response.statusCode !== 200) {
          reject(
            `Failed to get '${url}' (${response.statusCode})`
          );
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        // Delete the file if an error occurs
        fs.unlink(dest, () => reject(err.message));
      });
  });
}

async function unzip(file, dest) {
  const directory = await unzipper.Open.file(file);
  return await directory.extract({ path: dest })
}

function catalogLanguageFiles(langFolder) {
  const folder = fs.readdirSync(langFolder);
  const filter = folder.filter(x => path.extname(x).toLowerCase() === ".json" && x !== "all.json");

  console.log(`${filter.length} translations have been found.`);
  console.log(filter);

  const body = {};

  filter.forEach(x => {
    console.log(x);
    const lang = x.split(".")[0];
    const content = fs.readFileSync(langFolder + x, "utf8");
    try {
      body[lang] = JSON.parse(content);
    } catch (e) {
      console.error("Could not parse for json: ", e);
    }
  });

  fs.writeFileSync(`${langFolder}all.json`, JSON.stringify(body, null, 2));
  console.info(`Written all.json to ${langFolder}`);
}

main();
