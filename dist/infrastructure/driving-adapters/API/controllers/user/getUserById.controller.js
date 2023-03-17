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
exports.getUserById = void 0;
const UserGetterById_1 = require("../../../../../application/useCases/UserGetterById");
const DynamoDBUserRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository");
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const dynamoDBUserRepo = new DynamoDBUserRepository_1.DynamoDBUserRepository();
    const userGetterByIdUseCase = new UserGetterById_1.UserGetterByIdUseCase(dynamoDBUserRepo);
    try {
        const user = yield userGetterByIdUseCase.run(userId);
        res.json(user);
        return;
    }
    catch (e) {
        return next(e);
    }
});
exports.getUserById = getUserById;
