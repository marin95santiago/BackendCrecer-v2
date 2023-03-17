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
exports.ItemCreatorUseCase = void 0;
const ExistItemByCode_service_1 = require("../../../domain/services/item/ExistItemByCode.service");
const AlreadyExist_exception_1 = require("../../../domain/exceptions/common/AlreadyExist.exception");
const MissingProperty_exception_1 = require("../../../domain/exceptions/common/MissingProperty.exception");
class ItemCreatorUseCase {
    constructor(itemRepository) {
        this._itemRepository = itemRepository;
        this._existItemByCode = new ExistItemByCode_service_1.ExistItemByCodeService(itemRepository);
    }
    run(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.code === undefined || body.code === '')
                throw new MissingProperty_exception_1.MissingPropertyException('code');
            if (body.description === undefined || body.description === '')
                throw new MissingProperty_exception_1.MissingPropertyException('description');
            const existItem = yield this._existItemByCode.run(body.code, body.entityId);
            if (existItem)
                throw new AlreadyExist_exception_1.AlreadyExistException('Item');
            yield this._itemRepository.save(body);
            return body;
        });
    }
}
exports.ItemCreatorUseCase = ItemCreatorUseCase;
