module.exports = {
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coverageReporters: ["html", "text"],
  modulePaths:['<rootDir>/src/']
};
