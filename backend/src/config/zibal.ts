// src/services/zibal.js
const Zibal = require("zibal")

const zibal = new Zibal({
  merchant: process.env.ZIBAL_MERCHANT!,
  callbackUrl: `${process.env.ZIBAL_CALLBACK_URL}/api/payment/callback`,
});

export default zibal;