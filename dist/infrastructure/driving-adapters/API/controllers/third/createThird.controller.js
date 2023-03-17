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
exports.createThird = void 0;
const DynamoDBThirdRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository");
const ThirdCreator_1 = require("../../../../../application/useCases/ThirdCreator");
const utils_1 = require("../../utils");
const permission_json_1 = __importDefault(require("../../permission.json"));
const PermissionNotAvailable_exception_1 = require("../../../../../domain/exceptions/common/PermissionNotAvailable.exception");
const createThird = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { document, dv, documentType, organizationType, liabilityType, regimeType, businessName, name, lastname, phone, address, email } = req.body;
    const { sessionUser } = req.params;
    const dynamoDBThirdRepository = new DynamoDBThirdRepository_1.DynamoDBThirdRepository();
    const thirdCreatorUseCase = new ThirdCreator_1.ThirdCreatorUseCase(dynamoDBThirdRepository);
    try {
        const session = JSON.parse(sessionUser);
        const doesSuperAdminHavePermission = true;
        const havePermission = (0, utils_1.validatePermission)(permission_json_1.default.third.create, session.data.permissions, doesSuperAdminHavePermission);
        if (!havePermission)
            throw new PermissionNotAvailable_exception_1.PermissionNotAvailableException();
        const thirdCreated = yield thirdCreatorUseCase.run({
            entityId: session.data.entityId,
            document,
            dv,
            documentType,
            organizationType,
            liabilityType,
            regimeType,
            businessName,
            name,
            lastname,
            phone,
            address,
            email
        });
        res.json(thirdCreated);
    }
    catch (error) {
        return next(error);
    }
});
exports.createThird = createThird;
