"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkObjectAgainstInterface = void 0;
function checkObjectAgainstInterface(obj, iface) {
    for (const propName in iface) {
        const propType = iface[propName];
        // Si la propiedad es opcional y no existe en el objeto, continuamos con la siguiente propiedad
        if (propType.optional && !obj.hasOwnProperty(propName)) {
            continue;
        }
        // Si la propiedad es requerida y no existe en el objeto, retornamos false
        if (!propType.optional && !obj.hasOwnProperty(propName)) {
            return {
                status: false,
                error: {
                    message: `Missing property: ${propName}`
                }
            };
        }
        // Verificamos el tipo de dato de la propiedad
        if (obj.hasOwnProperty(propName) && typeof obj[propName] !== propType.type) {
            return {
                status: false,
                error: {
                    message: `${propName} property has the wrong format`
                }
            };
        }
        // Si la propiedad es un objeto anidado, verificamos las propiedades del objeto recursivamente
        if (propType.interface && typeof obj[propName] === 'object' && !Array.isArray(obj[propName])) {
            const response = checkObjectAgainstInterface(obj[propName], propType.interface);
            if (!response.status) {
                return response;
            }
        }
        // Si la propiedad es un arreglo, verificamos cada elemento del arreglo recursivamente
        if (propType.interface && Array.isArray(obj[propName])) {
            for (const arrayItem of obj[propName]) {
                const response = checkObjectAgainstInterface(arrayItem, propType.interface);
                if (!response.status) {
                    return response;
                }
            }
        }
    }
    return {
        status: true
    };
}
exports.checkObjectAgainstInterface = checkObjectAgainstInterface;
