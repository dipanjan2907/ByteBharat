const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + "_refresh";

const ENCRYPTION_KEY = crypto.scryptSync(process.env.JWT_SECRET, "salt", 32);
const IV_LENGTH = 16;

function hashToken(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function dehashToken(text) {
  try {
    if (!text || !text.includes(":")) {
      return text;
    }
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return text;
  }
}

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: "3d" },
  );
  return { accessToken, refreshToken };
}

function setCookies(res, accessToken, refreshToken) {
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15 mins
    sameSite: "strict",
  });
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: "strict",
    });
  }
}

module.exports = {
  hashToken,
  dehashToken,
  generateTokens,
  setCookies,
  REFRESH_SECRET,
};
