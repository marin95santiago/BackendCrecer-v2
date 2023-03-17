"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const login_routes_1 = __importDefault(require("./login.routes"));
const bill_routes_1 = __importDefault(require("./bill.routes"));
const entity_routes_1 = __importDefault(require("./entity.routes"));
const item_routes_1 = __importDefault(require("./item.routes"));
const third_routes_1 = __importDefault(require("./third.routes"));
const UserAlreadyExist_exception_1 = require("../../../../domain/exceptions/user/UserAlreadyExist.exception");
const UserNotFound_exception_1 = require("../../../../domain/exceptions/user/UserNotFound.exception");
const LoginWrongPassword_exception_1 = require("../../../../domain/exceptions/user/LoginWrongPassword.exception");
const PermissionNotAvailable_exception_1 = require("../../../../domain/exceptions/common/PermissionNotAvailable.exception");
const MissingProperty_exception_1 = require("../../../../domain/exceptions/common/MissingProperty.exception");
const EntityAlreadyExist_exception_1 = require("../../../../domain/exceptions/entity/EntityAlreadyExist.exception");
const Unhandled_exception_1 = require("../../../../domain/exceptions/common/Unhandled.exception");
const AlreadyExist_exception_1 = require("../../../../domain/exceptions/common/AlreadyExist.exception");
const route = (0, express_1.Router)();
route.use('/api/v2/user', user_routes_1.default);
route.use('/api/v2/login', login_routes_1.default);
route.use('/api/v2/bill', bill_routes_1.default);
route.use('/api/v2/entity', entity_routes_1.default);
route.use('/api/v2/item', item_routes_1.default);
route.use('/api/v2/third', third_routes_1.default);
route.use((err, req, res, next) => {
    if (err instanceof UserAlreadyExist_exception_1.UserAlreadyExistException) {
        res.status(400).json({
            message: err.message
        });
    }
    else if (err instanceof UserNotFound_exception_1.UserNotFoundException) {
        res.status(400).json({
            message: err.message
        });
    }
    else if (err instanceof LoginWrongPassword_exception_1.LoginWrongPasswordException) {
        res.status(400).json({
            message: err.message
        });
    }
    else if (err instanceof PermissionNotAvailable_exception_1.PermissionNotAvailableException) {
        res.status(403).json({
            message: err.message
        });
    }
    else if (err instanceof MissingProperty_exception_1.MissingPropertyException) {
        res.status(400).json({
            message: err.message
        });
    }
    else if (err instanceof EntityAlreadyExist_exception_1.EntityAlreadyExistException) {
        res.status(400).json({
            message: err.message
        });
    }
    else if (err instanceof Unhandled_exception_1.UnhandledException) {
        res.status(500).json({
            message: err.message
        });
    }
    else if (err instanceof AlreadyExist_exception_1.AlreadyExistException) {
        res.status(400).json({
            message: err.message
        });
    }
    else {
        next(err);
    }
});
route.use((err, req, res, next) => {
    console.log(err);
    res.status(500);
    res.json({
        error: err
    });
});
exports.default = route;
