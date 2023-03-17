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
exports.ElectronicBillCreatorUseCase = void 0;
const BillPlemsi_service_1 = require("../../../domain/services/electronicBill/BillPlemsi.service");
const GetEntityById_service_1 = require("../../../domain/services/entity/GetEntityById.service");
const Unhandled_exception_1 = require("../../../domain/exceptions/common/Unhandled.exception");
const electronicBill_mapper_1 = require("../../../domain/mappers/ElectronicBill/electronicBill.mapper");
class ElectronicBillCreatorUseCase {
    constructor(electronicBillRepository, entityRepository) {
        this._electronicBillRepository = electronicBillRepository;
        this._entityRepository = entityRepository;
        this._billPlemsiService = new BillPlemsi_service_1.BillPlemsiService();
        this._getEntityByIdService = new GetEntityById_service_1.GetEntityByIdService(entityRepository);
    }
    run(bill) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this._getEntityByIdService.run(bill.entityId || '');
                if (entity) {
                    const number = entity.lastElectronicBillNumber ? Number(entity.lastElectronicBillNumber + 1) : 0;
                    bill.number = number;
                    const dataPlemsi = (0, electronicBill_mapper_1.electronicBillPlemsiMapper)(bill, {
                        resolution: (_a = entity.resolution) !== null && _a !== void 0 ? _a : '',
                        resolutionText: (_b = entity.resolutionText) !== null && _b !== void 0 ? _b : ''
                    });
                    yield Promise.all([
                        this._billPlemsiService.run(dataPlemsi, (_c = entity.apiKeyPlemsi) !== null && _c !== void 0 ? _c : ''),
                        this._electronicBillRepository.save(bill),
                        this._entityRepository.update(Object.assign(Object.assign({}, entity), { lastElectronicBillNumber: number }))
                    ]);
                    return bill;
                }
                else {
                    throw 'No se encontró la entidad';
                }
            }
            catch (error) {
                throw new Unhandled_exception_1.UnhandledException(`Problema en el facturador, error: ${error}`);
            }
        });
    }
}
exports.ElectronicBillCreatorUseCase = ElectronicBillCreatorUseCase;
