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
exports.ExistEntityByDocumentService = void 0;
class ExistEntityByDocumentService {
    constructor(entityRepository) {
        this._entityRepository = entityRepository;
    }
    /**
     * Return true or false if email already exist
     * @param document {string}
     * @returns {boolean} true or false
     */
    run(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this._entityRepository.getByDocument(document);
            // exist return true
            if (entity !== null)
                return true;
            return false;
        });
    }
}
exports.ExistEntityByDocumentService = ExistEntityByDocumentService;
