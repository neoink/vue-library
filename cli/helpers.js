const helpers = {};

// Helper to ensure directory exists before writing file to it
helpers.ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return true;
  }

  helpers.ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

module.exports = helpers;
