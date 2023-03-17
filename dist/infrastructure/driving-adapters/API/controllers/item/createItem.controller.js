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
exports.createItem = void 0;
const DynamoDBItemRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository");
const ItemCreator_1 = require("../../../../../application/useCases/ItemCreator");
const utils_1 = require("../../utils");
const permission_json_1 = __importDefault(require("../../permission.json"));
const PermissionNotAvailable_exception_1 = require("../../../../../domain/exceptions/common/PermissionNotAvailable.exception");
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, description, unitMeasure, price } = req.body;
    const { sessionUser } = req.params;
    const dynamoDBItemRepository = new DynamoDBItemRepository_1.DynamoDBItemRepository();
    const itemCreatorUseCase = new ItemCreator_1.ItemCreatorUseCase(dynamoDBItemRepository);
    try {
        const session = JSON.parse(sessionUser);
        const doesSuperAdminHavePermission = true;
        const havePermission = (0, utils_1.validatePermission)(permission_json_1.default.item.create, session.data.permissions, doesSuperAdminHavePermission);
        if (!havePermission)
            throw new PermissionNotAvailable_exception_1.PermissionNotAvailableException();
        const itemCreated = yield itemCreatorUseCase.run({
            entityId: session.data.entityId,
            code,
            description,
            unitMeasure: {
                code: Number(unitMeasure.code),
                description: unitMeasure.description
            },
            price
        });
        res.json(itemCreated);
    }
    catch (error) {
        return next(error);
    }
});
exports.createItem = createItem;
