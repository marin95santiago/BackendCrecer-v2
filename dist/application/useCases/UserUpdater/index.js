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
exports.UserUpdaterUseCase = void 0;
const GetUserById_service_1 = require("../../../domain/services/user/GetUserById.service");
const UserNotFound_exception_1 = require("../../../domain/exceptions/user/UserNotFound.exception");
class UserUpdaterUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
        this._getUserByIdService = new GetUserById_service_1.GetUserByIdService(userRepository);
    }
    run(body) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            const userToUpdate = yield this._getUserByIdService.run(body === null || body === void 0 ? void 0 : body.id);
            if (userToUpdate === null)
                throw new UserNotFound_exception_1.UserNotFoundException();
            userToUpdate.email = (_a = body.email) !== null && _a !== void 0 ? _a : userToUpdate.email;
            userToUpdate.password = (_b = body.password) !== null && _b !== void 0 ? _b : userToUpdate.password;
            userToUpdate.name = (_c = body.name) !== null && _c !== void 0 ? _c : userToUpdate.name;
            userToUpdate.lastname = (_d = body.lastname) !== null && _d !== void 0 ? _d : userToUpdate.lastname;
            userToUpdate.entityId = (_e = body.entityId) !== null && _e !== void 0 ? _e : userToUpdate.entityId;
            userToUpdate.state = (_f = body.state) !== null && _f !== void 0 ? _f : userToUpdate.state;
            userToUpdate.permissions = (_g = body.permissions) !== null && _g !== void 0 ? _g : userToUpdate.permissions;
            const userUpdated = yield this._userRepository.update(userToUpdate);
            return userUpdated;
        });
    }
}
exports.UserUpdaterUseCase = UserUpdaterUseCase;
