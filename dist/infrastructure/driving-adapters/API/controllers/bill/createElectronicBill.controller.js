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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElectronicBill = void 0;
const DynamoDBElectronicBillRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBElectronicBillRepository");
const DynamoDBEntityRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBEntityRepository");
const ElectronicBillCreator_1 = require("../../../../../application/useCases/ElectronicBillCreator");
const utils_1 = require("../../utils");
const permission_json_1 = __importDefault(require("../../permission.json"));
const PermissionNotAvailable_exception_1 = require("../../../../../domain/exceptions/common/PermissionNotAvailable.exception");
const prefixPlemsi = (_a = process.env.PREFIX_PLEMSI) !== null && _a !== void 0 ? _a : 'SETT';
const createElectronicBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, orderReference, third, wayToPay, paymentMethod, paymentDueDate, municipality, note, items, taxes, total, totalTaxes, totalToPay, } = req.body;
    const { sessionUser } = req.params;
    const dynamoDBElectronicBillRepository = new DynamoDBElectronicBillRepository_1.DynamoDBElectronicBillRepository();
    const dynamoDBEntityRepository = new DynamoDBEntityRepository_1.DynamoDBEntityRepository();
    const electronicBillCreatorUseCase = new ElectronicBillCreator_1.ElectronicBillCreatorUseCase(dynamoDBElectronicBillRepository, dynamoDBEntityRepository);
    try {
        const session = JSON.parse(sessionUser);
        const doesSuperAdminHavePermission = true;
        const havePermission = (0, utils_1.validatePermission)(permission_json_1.default.electronic_bill.create, session.data.permissions, doesSuperAdminHavePermission);
        if (!havePermission)
            throw new PermissionNotAvailable_exception_1.PermissionNotAvailableException();
        const billCreated = yield electronicBillCreatorUseCase.run({
            entityId: session.data.entityId,
            userId: session.data.id,
            date,
            orderReference,
            third,
            wayToPay,
            paymentMethod,
            paymentDueDate,
            municipality,
            note,
            items,
            taxes,
            total,
            totalTaxes,
            totalToPay
        });
        res.json(billCreated);
    }
    catch (error) {
        return next(error);
    }
});
exports.createElectronicBill = createElectronicBill;
