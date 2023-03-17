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
exports.ThirdCreatorUseCase = void 0;
const ExistThirdByDocument_service_1 = require("../../../domain/services/third/ExistThirdByDocument.service");
const AlreadyExist_exception_1 = require("../../../domain/exceptions/common/AlreadyExist.exception");
const MissingProperty_exception_1 = require("../../../domain/exceptions/common/MissingProperty.exception");
class ThirdCreatorUseCase {
    constructor(thirdRepository) {
        this._thirdRepository = thirdRepository;
        this._existItemByCode = new ExistThirdByDocument_service_1.ExistThirdByDocumentService(thirdRepository);
    }
    run(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.document === undefined || body.document === '')
                throw new MissingProperty_exception_1.MissingPropertyException('document');
            if (body.documentType === undefined)
                throw new MissingProperty_exception_1.MissingPropertyException('documentType');
            if (body.organizationType === undefined)
                throw new MissingProperty_exception_1.MissingPropertyException('organizationType');
            if (body.liabilityType === undefined)
                throw new MissingProperty_exception_1.MissingPropertyException('liabilityType');
            if (body.regimeType === undefined)
                throw new MissingProperty_exception_1.MissingPropertyException('regimeType');
            if (body.address === undefined)
                throw new MissingProperty_exception_1.MissingPropertyException('address');
            if (body.email === undefined || body.email === '')
                throw new MissingProperty_exception_1.MissingPropertyException('email');
            const existItem = yield this._existItemByCode.run(body.document, body.entityId);
            if (existItem)
                throw new AlreadyExist_exception_1.AlreadyExistException('Third');
            yield this._thirdRepository.save(body);
            return body;
        });
    }
}
exports.ThirdCreatorUseCase = ThirdCreatorUseCase;
