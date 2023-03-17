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
exports.UserDeleterUseCase = void 0;
const GetUserById_service_1 = require("../../../domain/services/user/GetUserById.service");
const UserNotFound_exception_1 = require("../../../domain/exceptions/user/UserNotFound.exception");
class UserDeleterUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
        this._getUserByIdService = new GetUserById_service_1.GetUserByIdService(userRepository);
    }
    run(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToUpdate = yield this._getUserByIdService.run(id);
            if (userToUpdate === null)
                throw new UserNotFound_exception_1.UserNotFoundException();
            yield this._userRepository.delete(id);
        });
    }
}
exports.UserDeleterUseCase = UserDeleterUseCase;
