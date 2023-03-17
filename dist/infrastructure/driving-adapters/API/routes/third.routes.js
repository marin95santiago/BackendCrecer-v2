"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenHandler_middleware_1 = require("../middlewares/tokenHandler.middleware");
const index_1 = require("../controllers/index");
const route = (0, express_1.Router)();
route.post('/', tokenHandler_middleware_1.validateToken, index_1.createThirdController);
route.get('/', tokenHandler_middleware_1.validateToken, index_1.getAllThirdsController);
exports.default = route;
