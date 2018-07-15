const isProd = process.env.NODE_ENV === "production";

exports.rules = {
  prettier: {
    severity: isProd ? "error" : "warning"
  },
  "variable-name": [
    true,
    "ban-keywords",
    "check-format",
    "allow-leading-underscore",
    "allow-pascal-case"
  ],
  "cyclomatic-complexity": {
    severity: isProd ? "error" : "warning"
  },
  "prefer-const": {
    severity: isProd ? "error" : "warning"
  },
  "no-console": {
    severity: isProd ? "error" : "warning",
    options: ["debug", "info", "log", "time", "timeEnd", "trace"]
  },
  "no-debugger": {
    severity: isProd ? "error" : "warning"
  },
  "no-duplicate-super": true,
  "no-duplicate-switch-case": true,
  "no-return-await": true,
  "no-string-throw": true,
  "no-this-assignment": [true, { "allow-destructuring": true }],
  "no-unsafe-finally": true,
  "no-var-keyword": true
};
