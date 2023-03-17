"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backend = void 0;
const Server_1 = require("./Server");
class Backend {
    start() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '2426';
            this.server = new Server_1.Server(port);
            return yield this.server.listen();
        });
    }
    stop() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = this.server) === null || _a === void 0 ? void 0 : _a.stop());
        });
    }
}
exports.Backend = Backend;
