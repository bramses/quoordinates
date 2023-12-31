import { createCanvas, loadImage } from "canvas";
import fetch from "node-fetch";
import fs from "fs";
import Jimp from "jimp";
import { uploadToCloudflare } from "./cloudflare-images.js";

const blur = async (imageUrl) => {
  const image = await Jimp.read(imageUrl);
  const dateNow = Date.now();
  const filename = `blur-${dateNow}.png`;
  image.blur(5).write(filename);
  return filename;
};

async function overlayTextOnImageOverlay(imageUrl, text) {
  try {
    console.log("overlayTextOnImage");
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    // blur image from url
    const blurFile = await blur(imageUrl);
    // wait for blur to finish 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fetch and load the blurred image
    const img = await loadImage(blurFile);
    // const response = await fetch(imageUrl);
    // const imageBuffer = await response.buffer();
    // const img = await loadImage(imageBuffer);

    ctx.drawImage(img, 0, 0, 1024, 1024);

    // Rectangle dimensions (84% of 1024x1024)
    const rectWidth = 1024 * 0.92;
    const rectHeight = 1024 * 0.92;
    const rectX = (1024 - rectWidth) / 2;
    const rectY = (1024 - rectHeight) / 2;

    // Initialize variables
    let fontSize = 80; // Start with a large font size
    ctx.font = `${fontSize}px Georgia`;

    // Word-wrapping
    let lines = [];
    let blockHeight;

    do {
      lines = [];
      const paragraphs = text.split("\n");

      for (const paragraph of paragraphs) {
        let currentLine = "";
        const words = paragraph.split(" ");

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < rectWidth - 40) {
            // 20px padding on each side
            currentLine += (currentLine ? " " : "") + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        lines.push(""); // Empty line to simulate paragraph spacing
      }

      // Remove the last empty line if it exists
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      // Calculate total block height
      blockHeight = lines.length * (fontSize + 10); // 10px line spacing

      if (blockHeight > rectHeight) {
        fontSize -= 5; // Reduce the font size
        ctx.font = `${fontSize}px Georgia`;
      }
    } while (blockHeight > rectHeight);

    // Determine average color of the area where the rectangle will be placed
    const imageData = ctx.getImageData(rectX, rectY, rectWidth, rectHeight);
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }
    const pixelCount = imageData.data.length / 4;
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    // Decide text and background color based on average color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const textColor = brightness > 128 ? "black" : "white";
    // const backgroundColor = brightness > 128 ? 'white' : 'black';
    // make background color of rectangle average color
    const backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Draw background rectangle
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Draw background rectangle for the text block
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(rectX, rectY, rectWidth, blockHeight);

    // Draw colored rectangle to the left of the text block
    const rectangleWidth = 10; // Width of the colored rectangle
    ctx.fillStyle = textColor; // Color of the rectangle
    console.log(lines);
    // find line that starts with --
    const citationLine = lines.find((line) => line.startsWith("--"));
    const citationIndex = lines.indexOf(citationLine);
    const linesBeforeCitation = lines.slice(0, citationIndex);
    const linesAfterCitation = lines.slice(citationIndex);
    const rectangleHeight = (linesBeforeCitation.length - 3) * (fontSize + 10); // Exclude the last line (citation)
    ctx.fillRect(rectX + 15, rectY + 15, rectangleWidth, rectangleHeight);

    // Draw each line of text
    ctx.fillStyle = textColor;
    const textX = rectX + rectangleWidth + 10 + 15; // Start drawing text to the right of the colored rectangle
    const textY = rectY + 20 + fontSize; // Start drawing text 20px from the top of the rectangle
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], textX, textY + i * (fontSize + 10));
    }

    // Convert canvas to buffer
    const buffer = canvas.toBuffer();
    return { buffer, blurFile };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function overlayTextOnImage(imageUrl, text) {
  try {
    const canvas = createCanvas(1024, 2048); // Height is doubled to stack image and text
    const ctx = canvas.getContext("2d");
    ctx.textRendering = "geometricPrecision";


    // Fill the canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rectWidth = 1024 * 0.94; // == 962.56
    const rectHeight = 1024 * 0.92; // == 942.08

    // center the rectangle in the bottom half 1024, 1024 of the canvas
    const rectX = (1024 - rectWidth) / 2;
    const rectY = 1024 + (1024 - rectHeight) / 2; // == 1050.96


  // superimpose the rectangle on the canvas as a 1px red border for debugging
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 1;
    // ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Fetch and load the image
    const img = await loadImage(imageUrl);
    ctx.drawImage(img, 0, 0, 1024, 1024); // Draw the image at the top

    // Word wrapping logic and text rendering
    let fontSize = 72;
    ctx.font = `${fontSize}px Helvetica`;
    let lines = [];
    let blockHeight;

    do {
      lines = [];
      const paragraphs = text.split("\n");

      for (const paragraph of paragraphs) {
        let currentLine = "";
        const words = paragraph.split(" ");

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < rectWidth - 0) {
            // ~80px padding on each side
            currentLine += (currentLine ? " " : "") + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        lines.push(""); // Empty line to simulate paragraph spacing
      }

      // Remove the last empty line
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      // Calculate total block height
      blockHeight = lines.length * (fontSize + 10); // 10px line spacing
      if (blockHeight > rectHeight) {
        fontSize -= 1; // Reduce the font size
        ctx.font = `${fontSize}px Helvetica`; // Maintain the original font for simplicity
      }
    } while (blockHeight > rectHeight);

    const textXStart = 2; // Start drawing text at X=1044 to place it on the right side

    const imageData = ctx.getImageData(0, 0, 1024, 1024);
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }
    const pixelCount = imageData.data.length / 4;
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    // make background color of rectangle average color
    const backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Draw colored rectangle to the left of the text block
    const rectangleWidth = 8; // Width of the colored rectangle
    ctx.fillStyle = backgroundColor; // Color of the rectangle
    // find line that starts with --
    const citationLine = lines.find((line) => line.startsWith("--"));
    const citationIndex = lines.indexOf(citationLine);
    const linesBeforeCitation = lines.slice(0, citationIndex);
    const linesAfterCitation = lines.slice(citationIndex);
    const rectangleHeight = (linesBeforeCitation.length - 3) * (fontSize + 10); // Exclude the last line (citation)
    ctx.fillRect(
      8,
      rectY,
      rectangleWidth,
      rectangleHeight
    );


    // Draw each line of text in the bottom half
    ctx.fillStyle = "black";
    for (let i = 0; i < lines.length; i++) {
      // use rectX and rectY to offset the text
      ctx.fillText(
        lines[i],
        rectX + 0,
        rectY + 0 + fontSize + i * (fontSize + 10)
      );
    }

    


    // Convert canvas to buffer
    const buffer = canvas.toBuffer();
    return { buffer };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function overlayTextOnImageHorizontal(imageUrl, text) {
  try {
    const canvas = createCanvas(2048, 1024); // Width is doubled to accommodate the image and text
    const ctx = canvas.getContext("2d");
    ctx.textRendering = "geometricPrecision";


    // Fill the canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rectWidth = 1024 * 0.92;
    const rectHeight = 1024 * 0.92;
    const rectX = (1024 - rectWidth) / 2;
    const rectY = (1024 - rectHeight) / 2;

    // Fetch and load the image
    const img = await loadImage(imageUrl);

    ctx.drawImage(img, 0, 0, 1024, 1024); // Draw the image on the left side

    // Word wrapping logic and text rendering remain largely the same
    // with the exception of adjusting the X coordinates.

    // const randomFont = ["Palatino", "Georgia", "Helvetica"].sort(
    //   () => 0.5 - Math.random()
    // )[0];

    let fontSize = 80;
    ctx.font = `${fontSize}px Helvetica`;
    let lines = [];
    let blockHeight;

    const textXStart = 1044; // Start drawing text at X=1044 to place it on the right side

    // Word-wrapping

    do {
      lines = [];
      const paragraphs = text.split("\n");

      for (const paragraph of paragraphs) {
        let currentLine = "";
        const words = paragraph.split(" ");

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < rectWidth - 162) {
            // ~80px padding on each side
            currentLine += (currentLine ? " " : "") + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        lines.push(""); // Empty line to simulate paragraph spacing
      }

      // Remove the last empty line if it exists
      if (lines[lines.length - 1] === "") {
        lines.pop();
      }

      // Calculate total block height
      blockHeight = lines.length * (fontSize + 10); // 10px line spacing
      
      if (blockHeight > rectHeight) {
        fontSize -= 1; // Reduce the font size
        ctx.font = `${fontSize}px Helvetica`;
      }
    } while (blockHeight > rectHeight);

    // Determine text color (black)
    ctx.fillStyle = "black";

    // // Draw each line of text on the right side of the canvas
    // for (let i = 0; i < lines.length; i++) {
    //   ctx.fillText(lines[i], textXStart, 20 + i * (fontSize + 10));
    // }

    // Determine average color of the area where the rectangle will be placed
    const imageData = ctx.getImageData(rectX, rectY, rectWidth, rectHeight);
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i + 1];
      b += imageData.data[i + 2];
    }
    const pixelCount = imageData.data.length / 4;
    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    // make background color of rectangle average color
    const backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Draw colored rectangle to the left of the text block
    const rectangleWidth = 8; // Width of the colored rectangle
    ctx.fillStyle = backgroundColor; // Color of the rectangle
    // find line that starts with --
    const citationLine = lines.find((line) => line.startsWith("--"));
    const citationIndex = lines.indexOf(citationLine);
    const linesBeforeCitation = lines.slice(0, citationIndex);
    const linesAfterCitation = lines.slice(citationIndex);
    const rectangleHeight = (linesBeforeCitation.length - 3) * (fontSize + 10); // Exclude the last line (citation)
    ctx.fillRect(
      textXStart + rectX,
      rectY + 15,
      rectangleWidth,
      rectangleHeight
    );

    // Draw each line of text
    ctx.fillStyle = "black";
    const textX = rectX + rectangleWidth + 10 + 15; // Start drawing text to the right of the colored rectangle
    const textY = rectY + 20 + fontSize; // Start drawing text 20px from the top of the rectangle
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(
        lines[i],
        textXStart + textX + 20,
        textY + i * (fontSize + 10)
      );
    }

    // Convert canvas to buffer
    const bufferH = canvas.toBuffer();
    return { bufferH };
  } catch (err) {
    console.error(err);
    return null;
  }
}

// wget -O image.png <API_RESPONSE_URL> in terminal works
async function saveImgFromUrl(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const filename = `${Date.now()}.png`;
    // await writing buffer to file
    fs.writeFileSync(filename, buffer);

    return filename;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteFile(filename) {
  try {
    fs.unlinkSync(filename);
    return "Deleted file: " + filename;
  } catch (err) {
    console.error(err);
  }
}

// Example usage
// overlayTextOnImage(
//   "img-4E6wH8ITwi3WJCGq9txRKb8C.png",
//   `Apparatuses behave better and faster than human beings: they assemble automobiles better, they sew better, dig better, and soon will be able to do their cherry-picking more efficiently. And they think better too: they calculate, draw, and make decisions faster. (They are, curiously, better at calculation than they are at cherry-picking.) From now on, people can concentrate on programming apparatuses. Could that not be the freedom we have sought since history began?

//   -- Does Writing Have a Future? (Electronic Mediations Book 33)`
// ).then((buffer) => {
//   // create a file called image.png and write the buffer data to it
//   fs.writeFileSync("image.png", buffer);
// });

export const sharePicOverlay = async (imageUrl, text) => {
  const dalleFileTemp = await saveImgFromUrl(imageUrl);
  const { buffer, blurFile } = await overlayTextOnImage(dalleFileTemp, text);
  const resultTemp = `${Date.now()}.png`;
  fs.writeFileSync(resultTemp, buffer);
  const result = await uploadToCloudflare(resultTemp);
  console.log(result);
  // delete temp files from disk
  deleteFile(dalleFileTemp);
  deleteFile(blurFile);
  deleteFile(resultTemp);

  return result;
};

export const sharePic = async (imageUrl, text) => {
  try {
    const dalleFileTemp = await saveImgFromUrl(imageUrl);
    
    const { buffer } = await overlayTextOnImage(dalleFileTemp, text);
    const resultTemp = `${Date.now()}.png`;
    fs.writeFileSync(resultTemp, buffer);
    const verticalResult = await uploadToCloudflare(resultTemp);

    

    const { bufferH } = await overlayTextOnImageHorizontal(dalleFileTemp, text);
    const resultTempH = `${Date.now()}.png`;
    fs.writeFileSync(resultTempH, bufferH);
    const horizontalResult = await uploadToCloudflare(resultTempH);
    
    // delete temp files from disk
    deleteFile(dalleFileTemp);
    deleteFile(resultTempH);
    deleteFile(resultTemp);

    return {
      vertical: verticalResult,
      horizontal: horizontalResult
    };
  } catch (err) {
    console.error(err);
    return {
      error: err,
    };
  }
};

// Example usage

async function testMain() {
  try {
    const { buffer } = await overlayTextOnImage(
      "test.png",
      `There, perched on a cot, I pretended to read. My eyes followed the black signs without skipping a single one, and I told myself a story aloud, being careful to utter all the syllables. I was taken by surprise—or saw to it that I was—a great fuss was made, and the family decided that it was time to teach me the alphabet. I was as zealous as a catechumen. I went so far as to give myself private lessons. I would climb up on my cot with Hector Malot’s No Family, which I knew by heart, and, half reciting, half deciphering, I went through every page of it, one after the other. When the last page was turned, I knew how to read. I was wild with joy. —JEAN-PAUL SARTRE In his memoir The Words, Jean-Paul Sartre recounts his first recollection of reading, and the sheer “wild joy” that accompanied this experience. However filtered through the lens of memory, Sartre’s account is similar to the experience of countless children who also half memorize, half decipher a favorite book until suddenly (or so it seems to them) reading is theirs. The reality is that Sartre steadily accumulated multiple, partial sources of knowledge until “suddenly” a threshold was crossed, and he deciphered the secret language of print.
    
-- Does Writing Have a Future? (Electronic Mediations Book 33)`
    );
    // create a file called image.png and write the buffer data to it
    fs.writeFileSync("img2.png", buffer);
  } catch (err) {
    console.error(err);
  }
}

if (process.argv[2] === "test") testMain();

// sharePic(
//   "https://res.cloudinary.com/dtgh01qqo/image/upload/v1624293899/img-4E6wH8ITwi3WJCGq9txRKb8C.png",
//   `Apparatuses behave better and faster than human beings: they assemble automobiles better, they sew better, dig better, and soon will be able to do their cherry-picking more efficiently. And they think better too: they calculate, draw, and make decisions faster. (They are, curiously, better at calculation than they are at cherry-picking.) From now on, people can concentrate on programming apparatuses. Could that not be the freedom we have sought since history began?

//     -- Does Writing Have a Future? (Electronic Mediations Book 33)`
// ).then((buffer) => {
//   // create a file called image.png and write the buffer data to it
//   fs.writeFileSync("image.png", buffer);
// });
