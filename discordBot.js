const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const chokidar = require("chokidar");

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Replace with your Discord bot token
const token = "Your_yous_not_mine";

// Function to organize files in a directory
function organizeFiles(directory) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    console.error("Invalid directory path.");
    return;
  }

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const fileExtension = path.extname(file).toLowerCase();
        const targetFolder = getTargetFolder(fileExtension, directory);

        if (!fs.existsSync(targetFolder)) {
          fs.mkdirSync(targetFolder, { recursive: true }); // Create subdirectories recursively
        }

        const newFilePath = path.join(targetFolder, file);
        fs.renameSync(filePath, newFilePath);
        console.log(`Moved: ${file} to ${targetFolder}`);
      }
    });

    console.log("Organizing complete!");
  });
}

// Function to get the target folder based on the file extension
function getTargetFolder(fileExtension, parentDirectory) {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
    ".svg",
    ".ico",
    ".raw",
    ".heif",
    ".heic",
  ];
  const videoExtensions = [".mp4", ".avi", ".mkv", ".mov"];
  const musicExtensions = [".mp3", ".wav", ".flac"];
  const zipExtensions = [".zip", ".rar", ".7z"];
  const appExtensions = [".exe", ".dmg", ".app"];
  const pdfExtensions = [".pdf"];

  if (imageExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "images");
  } else if (videoExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "videos");
  } else if (musicExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "music");
  } else if (zipExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "zips");
  } else if (appExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "apps");
  } else if (pdfExtensions.includes(fileExtension)) {
    return path.join(parentDirectory, "files");
  } else {
    return path.join(parentDirectory, "other");
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!organize")) {
    const args = message.content.split(" ");
    if (args.length === 2) {
      const targetDirectory = args[1];
      organizeFiles(targetDirectory);
    } else {
      message.reply("Usage: !organize <directory>");
    }
  }
});

client.login(token);
