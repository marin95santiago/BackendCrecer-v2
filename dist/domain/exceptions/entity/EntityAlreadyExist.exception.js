"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityAlreadyExistException = void 0;
class EntityAlreadyExistException extends Error {
    constructor() {
        super('Entity already exist');
    }
}
exports.EntityAlreadyExistException = EntityAlreadyExistException;
