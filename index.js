require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const Url = require("./models/Url");
const shortid = require("shortid");
const connectDatabase = require("./config/mongo");
connectDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.redirect("/api");
});
// Routes
app.get("/api", (req, res) => {
  res.render("index", { title: "Home", shortenedUrl: null });
});
const isValidUrl = (url) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3})|" + // OR ip (v4) address
      "localhost)" + // OR localhost
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!urlPattern.test(url);
};
app.post("/api/shorten", async (req, res) => {
  let { originalUrl, shortUrl } = req.body;

  // Validate originalUrl
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json("Invalid URL");
  }

  // Validate shortUrl format (if provided)
  if (shortUrl && !shortUrl.match(/^[a-zA-Z0-9_-]{3,}$/)) {
    return res.status(400).json({
      error: true,
      message:
        "Invalid short URL format. Use only letters, numbers, underscores, and dashes.",
    });
  }

  // Check if shortUrl is already in use
  if (shortUrl) {
    const existing = await Url.findOne({ shortUrl });
    if (existing) {
      return res
        .status(400)
        .json({ error: true, message: "Short URL already in use" });
    }
  } else {
    // Generate a shortUrl if not provided
    shortUrl = shortid.generate();
  }

  // Save the URL to the database
  const url = new Url({ originalUrl, shortUrl });
  await url.save();
  res.json(url);
});

app.get("/api/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("URL not found");
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
