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
exports.deleteUser = void 0;
const UserDeleter_1 = require("../../../../../application/useCases/UserDeleter");
const DynamoDBUserRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository");
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const dynamoDBUserRepo = new DynamoDBUserRepository_1.DynamoDBUserRepository();
    const userDeleterUseCase = new UserDeleter_1.UserDeleterUseCase(dynamoDBUserRepo);
    try {
        const userDeleted = yield userDeleterUseCase.run(userId);
        res.json(userDeleted);
        return;
    }
    catch (e) {
        return next(e);
    }
});
exports.deleteUser = deleteUser;
