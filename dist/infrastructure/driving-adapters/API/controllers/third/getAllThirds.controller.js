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
exports.getAllThirds = void 0;
const DynamoDBThirdRepository_1 = require("../../../../implementations/AWS/dynamoDB/DynamoDBThirdRepository");
const ThirdGetter_1 = require("../../../../../application/useCases/ThirdGetter");
const getAllThirds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dynamoDBThirdRepository = new DynamoDBThirdRepository_1.DynamoDBThirdRepository();
    const thirdGetterUseCase = new ThirdGetter_1.ThirdGetterUseCase(dynamoDBThirdRepository);
    try {
        const thirds = yield thirdGetterUseCase.run();
        res.json(thirds);
        return;
    }
    catch (e) {
        return next(e);
    }
});
exports.getAllThirds = getAllThirds;
