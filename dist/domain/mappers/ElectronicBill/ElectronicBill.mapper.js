"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxesPlemsiMapper = exports.itemsPlemsiMapper = exports.electronicBillPlemsiMapper = void 0;
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({
    path: path_1.default.resolve(__dirname, '../../../../.env')
});
const prefixPlemsi = (_a = process.env.PREFIX_PLEMSI) !== null && _a !== void 0 ? _a : 'SETT';
function electronicBillPlemsiMapper(bill, entityData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return {
        date: (_a = bill.date) !== null && _a !== void 0 ? _a : '',
        time: "12:21:00",
        prefix: prefixPlemsi,
        number: (_b = bill.number) !== null && _b !== void 0 ? _b : 0,
        orderReference: {
            id_order: bill.orderReference
        },
        send_email: true,
        customer: {
            identification_number: (_c = bill.third.document) !== null && _c !== void 0 ? _c : '',
            dv: (_d = bill.third.dv) !== null && _d !== void 0 ? _d : undefined,
            name: (_e = (bill.third.name !== undefined ? `${bill.third.name} ${bill.third.lastname}` : bill.third.businessName)) !== null && _e !== void 0 ? _e : '',
            phone: (_f = bill.third.phone) !== null && _f !== void 0 ? _f : '',
            address: (_g = bill.third.address) !== null && _g !== void 0 ? _g : '',
            email: (_h = bill.third.email) !== null && _h !== void 0 ? _h : '',
            type_document_identification_id: (_j = Number(bill.third.documentType.code)) !== null && _j !== void 0 ? _j : 0,
            type_organization_id: (_k = Number(bill.third.organizationType.code)) !== null && _k !== void 0 ? _k : 0,
            type_liability_id: (_l = Number(bill.third.liabilityType.code)) !== null && _l !== void 0 ? _l : 0,
            municipality_id: 635,
            type_regime_id: Number(bill.third.regimeType.code)
        },
        payment: {
            payment_form_id: (_m = Number(bill.wayToPay.code)) !== null && _m !== void 0 ? _m : 0,
            payment_method_id: (_o = Number(bill.paymentMethod.code)) !== null && _o !== void 0 ? _o : 0,
            payment_due_date: (_p = bill.paymentDueDate) !== null && _p !== void 0 ? _p : ''
        },
        items: itemsPlemsiMapper(bill.items),
        resolution: entityData.resolution,
        resolutionText: entityData.resolutionText,
        notes: (_q = bill.note) !== null && _q !== void 0 ? _q : '',
        invoiceBaseTotal: (_r = Number(bill.total)) !== null && _r !== void 0 ? _r : 0,
        invoiceTaxExclusiveTotal: (_s = Number(bill.total)) !== null && _s !== void 0 ? _s : 0,
        invoiceTaxInclusiveTotal: (_t = Number(bill.totalToPay)) !== null && _t !== void 0 ? _t : 0,
        allTaxTotals: taxesPlemsiMapper(bill.taxes),
        totalToPay: (_u = Number(bill.totalToPay)) !== null && _u !== void 0 ? _u : 0,
        finalTotalToPay: (_v = Number(bill.totalToPay)) !== null && _v !== void 0 ? _v : 0
    };
}
exports.electronicBillPlemsiMapper = electronicBillPlemsiMapper;
function itemsPlemsiMapper(items) {
    let response = [];
    items.forEach(item => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        response.push({
            unit_measure_id: (_b = Number((_a = item.unitMeasure) === null || _a === void 0 ? void 0 : _a.code)) !== null && _b !== void 0 ? _b : 0,
            line_extension_amount: (_c = Number(item.total)) !== null && _c !== void 0 ? _c : 0,
            free_of_charge_indicator: false,
            description: (_d = item.description) !== null && _d !== void 0 ? _d : '',
            code: (_e = item.code) !== null && _e !== void 0 ? _e : '',
            type_item_identification_id: (_f = Number(item.itemType.code)) !== null && _f !== void 0 ? _f : 0,
            price_amount: (_g = Number(item.price)) !== null && _g !== void 0 ? _g : 0,
            base_quantity: (_h = Number(item.quantity)) !== null && _h !== void 0 ? _h : 0,
            invoiced_quantity: (_j = Number(item.quantity)) !== null && _j !== void 0 ? _j : 0,
            tax_totals: taxesPlemsiMapper(item.taxes)
        });
    });
    return response;
}
exports.itemsPlemsiMapper = itemsPlemsiMapper;
function taxesPlemsiMapper(taxes) {
    let response = [];
    taxes.forEach(tax => {
        var _a, _b, _c, _d;
        response.push({
            tax_id: (_a = Number(tax.code)) !== null && _a !== void 0 ? _a : 0,
            percent: (_b = Number(tax.percent)) !== null && _b !== void 0 ? _b : 0,
            tax_amount: (_c = Number(tax.taxAmount)) !== null && _c !== void 0 ? _c : 0,
            taxable_amount: (_d = Number(tax.taxableAmount)) !== null && _d !== void 0 ? _d : 0
        });
    });
    return response;
}
exports.taxesPlemsiMapper = taxesPlemsiMapper;
