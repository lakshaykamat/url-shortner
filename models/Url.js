const mongoose = require("mongoose");
const shortid = require("shortid");
const QRCode = require("qrcode");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortid.generate,
    unique: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
  },
});

// Pre-save middleware to generate QR code
urlSchema.pre("save", async function (next) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(
      //TODO SERVER URL
      `https://nice-url-shortner.vercel.app/${this.shortUrl}`
    );
    this.qrCode = qrCodeDataUrl;
    next();
  } catch (err) {
    next(err);
  }
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
