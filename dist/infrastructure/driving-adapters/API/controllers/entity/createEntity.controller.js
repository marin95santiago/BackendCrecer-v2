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
exports.createEntity = void 0;
const DynamoDBEntityRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository");
const EntityCreator_1 = require("../../../../../application/useCases/EntityCreator");
const utils_1 = require("../../utils");
const permission_json_1 = __importDefault(require("../../permission.json"));
const PermissionNotAvailable_exception_1 = require("../../../../../domain/exceptions/common/PermissionNotAvailable.exception");
const uuid_1 = require("uuid");
const createEntity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, entityTypeCode, document, signatories, address, email, phone, apiKeyPlemsi, state, resolution, resolutionText, lastElectronicBillNumber } = req.body;
    const { sessionUser } = req.params;
    const dynamoDBEntityRepository = new DynamoDBEntityRepository_1.DynamoDBEntityRepository();
    const entityCreatorUseCase = new EntityCreator_1.EntityCreatorUseCase(dynamoDBEntityRepository);
    try {
        const session = JSON.parse(sessionUser);
        const doesSuperAdminHavePermission = true;
        const havePermission = (0, utils_1.validatePermission)(permission_json_1.default.entity.create, session.data.permissions, doesSuperAdminHavePermission);
        if (!havePermission)
            throw new PermissionNotAvailable_exception_1.PermissionNotAvailableException();
        const entityCreated = yield entityCreatorUseCase.run({
            id: (0, uuid_1.v4)(),
            name,
            entityTypeCode,
            document,
            signatories,
            address,
            email,
            phone,
            apiKeyPlemsi,
            state: state || 'ACTIVE',
            resolution,
            resolutionText,
            lastElectronicBillNumber
        });
        res.json(entityCreated);
    }
    catch (error) {
        return next(error);
    }
});
exports.createEntity = createEntity;
