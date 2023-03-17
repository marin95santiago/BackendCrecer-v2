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
exports.createUser = void 0;
const DynamoDBUserRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBUserRepository");
const UserCreator_1 = require("../../../../../application/useCases/UserCreator");
const uuid_1 = require("uuid");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, lastname, entityId, permissions } = req.body;
    // const { sessionUser } = req.params
    const dynamoDBUserRepo = new DynamoDBUserRepository_1.DynamoDBUserRepository();
    const userCreatorUseCase = new UserCreator_1.UserCreatorUseCase(dynamoDBUserRepo);
    try {
        /*
        const session = JSON.parse(sessionUser)
        const doesSuperAdminHavePermission = true
        const havePermission = validatePermission(permissionsList.user.user_create, session.data.permissions, doesSuperAdminHavePermission)
    
        if (!havePermission) throw new PermissionNotAvailableException()
        */
        const userCreated = yield userCreatorUseCase.run({
            id: (0, uuid_1.v4)(),
            state: 'ACTIVE',
            email,
            password,
            name,
            lastname,
            entityId,
            permissions
        });
        res.json(userCreated);
        return;
    }
    catch (error) {
        return next(error);
    }
});
exports.createUser = createUser;
