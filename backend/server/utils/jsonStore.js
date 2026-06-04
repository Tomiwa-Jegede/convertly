const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

/**
 * Read a JSON array from a data file.
 * Returns an empty array if the file doesn't exist or is empty.
 */
async function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const trimmed = raw.trim();
    if (!trimmed) return [];
    return JSON.parse(trimmed);
  } catch (err) {
    if (err.code === "ENOENT") {
      // File doesn't exist yet — return empty array
      return [];
    }
    throw err;
  }
}

/**
 * Write a JSON array to a data file (pretty-printed, atomic-ish write).
 */
async function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}

module.exports = { readJSON, writeJSON };
