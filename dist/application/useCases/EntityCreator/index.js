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
exports.EntityCreatorUseCase = void 0;
const ExistEntityByDocument_service_1 = require("../../../domain/services/entity/ExistEntityByDocument.service");
const EntityAlreadyExist_exception_1 = require("../../../domain/exceptions/entity/EntityAlreadyExist.exception");
const MissingProperty_exception_1 = require("../../../domain/exceptions/common/MissingProperty.exception");
class EntityCreatorUseCase {
    constructor(entityRepository) {
        this._entityRepository = entityRepository;
        this._existEntityByDocumentService = new ExistEntityByDocument_service_1.ExistEntityByDocumentService(entityRepository);
    }
    run(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.name === undefined || body.name === '')
                throw new MissingProperty_exception_1.MissingPropertyException('name');
            if (body.entityTypeCode === undefined || body.entityTypeCode === '')
                throw new MissingProperty_exception_1.MissingPropertyException('entityTypeCode');
            if (body.document === undefined || body.document === '')
                throw new MissingProperty_exception_1.MissingPropertyException('document');
            if (body.signatories === undefined || body.signatories.length === 0)
                throw new MissingProperty_exception_1.MissingPropertyException('signatories');
            const existEntity = yield this._existEntityByDocumentService.run(body.document);
            if (existEntity)
                throw new EntityAlreadyExist_exception_1.EntityAlreadyExistException();
            yield this._entityRepository.save(body);
            return body;
        });
    }
}
exports.EntityCreatorUseCase = EntityCreatorUseCase;
