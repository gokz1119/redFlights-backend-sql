const crypto = require("crypto");

const secret = "pneumonoultramicroscopicsilicovolcanoconiosis94";

const getHash = (password) => {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");

  return hash;
};

module.exports = getHash;
