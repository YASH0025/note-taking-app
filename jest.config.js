module.exports = {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": [".*\\.spec\\.ts$", ".*\\.e2e-spec\\.ts$"],
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "testSequencer": "E:\\Note-Taking App api\\test-sequencer.js"
  };