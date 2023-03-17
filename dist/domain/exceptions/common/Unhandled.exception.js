"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhandledException = void 0;
/**
 * Build an unhandled error with information about the entity that failed
 * @param entity Entity that failed
 * @return Error
 */
class UnhandledException extends Error {
    constructor(entity) {
        super(`Sorry, something is wrong in ${entity}, please contact technical service`);
    }
}
exports.UnhandledException = UnhandledException;
