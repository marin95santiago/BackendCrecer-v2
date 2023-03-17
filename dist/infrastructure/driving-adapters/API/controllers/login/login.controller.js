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
exports.login = void 0;
const DynamoDBUserRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository");
const Login_1 = require("../../../../../application/useCases/Login");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '';
    const dynamoDBUserRepo = new DynamoDBUserRepository_1.DynamoDBUserRepository();
    const loginUseCase = new Login_1.LoginUseCase(dynamoDBUserRepo);
    try {
        const result = yield loginUseCase.run(email, password, secret);
        res.json(result);
    }
    catch (error) {
        return next(error);
    }
});
exports.login = login;
