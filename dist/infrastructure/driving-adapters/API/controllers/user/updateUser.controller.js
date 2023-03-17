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
exports.updateUser = void 0;
const DynamoDBUserRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository");
const UserUpdater_1 = require("../../../../../application/useCases/UserUpdater");
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const dynamoDBUserRepo = new DynamoDBUserRepository_1.DynamoDBUserRepository();
    const userUpdaterUseCase = new UserUpdater_1.UserUpdaterUseCase(dynamoDBUserRepo);
    try {
        const userToUpdate = Object.assign(Object.assign({}, req.body), { id: userId });
        const userUpdated = yield userUpdaterUseCase.run(userToUpdate);
        res.json(userUpdated);
        return;
    }
    catch (e) {
        return next(e);
    }
});
exports.updateUser = updateUser;
