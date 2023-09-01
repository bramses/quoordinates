import { createCanvas, loadImage } from "canvas";
import fetch from "node-fetch";
import fs from "fs";
import Jimp from "jimp";

const blur = async (imageUrl) => {
  const image = await Jimp.read(imageUrl);
  image.blur(5).write("blur1.png");
};

async function overlayTextOnImage(imageUrl, text) {
  console.log("overlayTextOnImage");
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");

  // blur image from url
  await blur(imageUrl);

  // Fetch and load the blurred image
  const img = await loadImage("blur1.png");
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
  console.log(lines)
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
  return buffer;
}

// wget -O image.png <API_RESPONSE_URL> in terminal works
async function saveImgFromUrl(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const filename = `${Date.now()}.jpg`;
  fs.writeFile(filename, buffer, () => {
    // console.log("finished downloading!");
  });

  return filename;
}

// Example usage
overlayTextOnImage(
  "img-4E6wH8ITwi3WJCGq9txRKb8C.png",
  `Apparatuses behave better and faster than human beings: they assemble automobiles better, they sew better, dig better, and soon will be able to do their cherry-picking more efficiently. And they think better too: they calculate, draw, and make decisions faster. (They are, curiously, better at calculation than they are at cherry-picking.) From now on, people can concentrate on programming apparatuses. Could that not be the freedom we have sought since history began?
  
  -- Does Writing Have a Future? (Electronic Mediations Book 33)`
).then((buffer) => {
  // create a file called image.png and write the buffer data to it
  fs.writeFileSync("image.png", buffer);
});
