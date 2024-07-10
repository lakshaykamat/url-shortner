require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const Url = require("./models/Url");
const shortid = require("shortid");
const connectDatabase = require("./config/mongo");
const { isValidUrl } = require("./lib/utils");
const QRCode = require("qrcode");

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

// API Routes
app.get("/api", (req, res) => {
  res.render("index", { title: "Home", shortenedUrl: null });
});

// About page
app.get("/api/about", (req, res) => {
  res.render("about");
});

// Route to shorten the long URL
app.post("/api/shorten", async (req, res) => {
  let { originalUrl, shortUrl } = req.body;

  // Validate originalUrl
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: true, message: "Invalid URL" });
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

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(
    `${req.protocol}://${req.get("host")}/${shortUrl}`
  );

  // Save the URL to the database
  const url = new Url({ originalUrl, shortUrl, qrCode: qrCodeDataUrl });
  await url.save();

  res.json({ url });
});

// Route to redirect to the original URL
app.get("/api/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOneAndUpdate(
    { shortUrl },
    { $inc: { clickCount: 1 } },
    { new: true }
  );

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("Page not found");
  }
});

// Route to redirect to the original URL
app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOneAndUpdate(
    { shortUrl },
    { $inc: { clickCount: 1 } },
    { new: true }
  );

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("Page not found");
  }
});

// Route to fetch URL details
app.get("/api/details/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (url) {
    res.json(url);
  } else {
    res.status(404).json({ error: true, message: "URL not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
