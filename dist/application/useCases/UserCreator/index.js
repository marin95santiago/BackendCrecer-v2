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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreatorUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ExistUserByEmail_service_1 = require("../../../domain/services/user/ExistUserByEmail.service");
const UserAlreadyExist_exception_1 = require("../../../domain/exceptions/user/UserAlreadyExist.exception");
const MissingProperty_exception_1 = require("../../../domain/exceptions/common/MissingProperty.exception");
class UserCreatorUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
        this._existUserByEmailService = new ExistUserByEmail_service_1.ExistUserByEmailService(userRepository);
    }
    run(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield this._existUserByEmailService.run(body.email);
            if (existUser)
                throw new UserAlreadyExist_exception_1.UserAlreadyExistException();
            if (body.password === undefined || body.password === '')
                throw new MissingProperty_exception_1.MissingPropertyException('password');
            if (body.email === undefined || body.email === '')
                throw new MissingProperty_exception_1.MissingPropertyException('email');
            if (body.name === undefined || body.name === '')
                throw new MissingProperty_exception_1.MissingPropertyException('name');
            if (body.lastname === undefined || body.lastname === '')
                throw new MissingProperty_exception_1.MissingPropertyException('lastname');
            if (body.entityId === undefined || body.entityId === '')
                throw new MissingProperty_exception_1.MissingPropertyException('entityId');
            // Encrypt password
            const SALT = 12;
            bcrypt_1.default.hash(body.password, SALT, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                if (err !== undefined)
                    throw new Error('error');
                body.password = hash;
                yield this._userRepository.save(body);
            }));
            // Protect password
            delete body.password;
            return body;
        });
    }
}
exports.UserCreatorUseCase = UserCreatorUseCase;
