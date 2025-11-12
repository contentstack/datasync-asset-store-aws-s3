"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.setLogger = void 0;
const validations_1 = require("./validations");
const setLogger = (customLogger) => {
    if (exports.logger) {
        return exports.logger;
    }
    else if (!(0, validations_1.validateLogger)(customLogger) && !customLogger) {
        exports.logger = console;
    }
    else {
        exports.logger = customLogger;
    }
    return exports.logger;
};
exports.setLogger = setLogger;
