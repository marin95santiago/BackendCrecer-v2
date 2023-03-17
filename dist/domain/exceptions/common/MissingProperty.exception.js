"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingPropertyException = void 0;
class MissingPropertyException extends Error {
    constructor(property) {
        super(`Missing the property: ${property}`);
    }
}
exports.MissingPropertyException = MissingPropertyException;
