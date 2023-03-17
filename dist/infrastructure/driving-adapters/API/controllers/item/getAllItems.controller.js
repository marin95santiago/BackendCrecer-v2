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
exports.getAllItems = void 0;
const DynamoDBItemRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBItemRepository");
const ItemGetter_1 = require("../../../../../application/useCases/ItemGetter");
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dynamoDBItemRepository = new DynamoDBItemRepository_1.DynamoDBItemRepository();
    const itemGetterUseCase = new ItemGetter_1.ItemGetterUseCase(dynamoDBItemRepository);
    try {
        const items = yield itemGetterUseCase.run();
        res.json(items);
        return;
    }
    catch (e) {
        return next(e);
    }
});
exports.getAllItems = getAllItems;
