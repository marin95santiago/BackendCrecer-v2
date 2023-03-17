"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionNotAvailableException = void 0;
class PermissionNotAvailableException extends Error {
    constructor() {
        super('Sorry, insufficient permissions');
    }
}
exports.PermissionNotAvailableException = PermissionNotAvailableException;
