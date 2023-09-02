import axios from "axios";
// fs promises
import { promises as fsPromises } from "fs";
const { readFile } = fsPromises;
import FormData from "form-data";
import convert from "heic-convert";
import dotenv from "dotenv";
dotenv.config();

const convertHEIC = async (inputBuffer, quality = 1.0) => {
  try {
    console.log("Converting HEIC to JPEG with quality = " + quality);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: "JPEG", // output format
      quality: quality, // the jpeg compression quality, between 0 and 1
    });
    return outputBuffer;
  } catch (err) {
    throw new Error("Error converting HEIC to JPEG: " + err);
  }
};

export const uploadToCloudflare = async (filename, file, heicBuffer = null) => {
  try {
    let blob;
    if (!file) {
      blob = await readFile(filename);
    } else {
      blob = file;
    }

    let quality = 0.75;
    while (blob.length.toString().length >= 8 && quality >= 0.25) {
      if (!heicBuffer) {
        throw new Error("HEIC buffer is required to convert to JPEG");
      }
      console.log(
        "File is too large to be sent to Cloudflare -- decreasing quality to " +
          quality
      );
      blob = await convertHEIC(heicBuffer, quality);
      quality -= 0.25;
    }

    if (blob.length.toString().length > 8) {
      throw new Error("File is too large to be sent to Cloudflare");
    }

    console.log(`Uploading file to cloudflare...${filename} :: ${blob.length}`);

    const form = new FormData();
    form.append("file", blob, filename);
    const resp = await axios.post(
      "https://api.cloudflare.com/client/v4/accounts/81f991621b293527970f6b95fd1e3c52/images/v1",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.CF_IMAGE_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return extractURL(resp.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      throw new Error(
        "Error uploading to Cloudflare " + JSON.stringify(error.response)
      );
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
      throw new Error("Error uploading to Cloudflare: " + error);
    }
  }
};

function extractURL(input) {
  try {
    console.log("Extracting URL from CF response");
    var variants = input.result.variants[0];
    return variants;
  } catch (err) {
    console.error(err);
  }
}

// module.exports = {
//   uploadToCloudflare,
//   convertHEIC,
//   archiveOnTimer,
// };

// (async () => {
//   const url = await uploadToCloudflare("image.png");
//   console.log(url);
// })();
