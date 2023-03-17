"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePermission = void 0;
const permission_json_1 = __importDefault(require("./permission.json"));
/**
 * Validation
 * @param permission Permission to validate
 * @param userPermissions Session user permissions
 * @param doesSuperAdminHavePermission Does the super administrator have permission?
 * @returns if user has the permission: true, otherwise false
 */
const validatePermission = (permission, userPermissions, doesSuperAdminHavePermission) => {
    let havePermission = false;
    if (doesSuperAdminHavePermission) {
        havePermission = userPermissions.some(element => element === permission_json_1.default.super_admin);
        if (havePermission)
            return true;
    }
    havePermission = userPermissions.some(element => element === permission);
    return havePermission;
};
exports.validatePermission = validatePermission;
