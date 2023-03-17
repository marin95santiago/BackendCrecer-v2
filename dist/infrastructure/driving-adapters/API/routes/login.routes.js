"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/index");
const route = (0, express_1.Router)();
route.post('', index_1.loginController);
exports.default = route;
