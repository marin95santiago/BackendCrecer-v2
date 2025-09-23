import axios from 'axios';
import { Entity } from '../../entities/Entity.entity';

const URL_PLEMSI = process.env.URL_PLEMSI || '';
const PREFIX_SUPPORT_DOCUMENT_PLEMSI = process.env.PREFIX_SUPPORT_DOCUMENT_PLEMSI || 'DS';

export class PlemsiDocumentService {
  /**
   * Obtiene el listado de facturas electrónicas desde Plemsi
   * @param entity - Entidad con información de la empresa
   * @param page - Número de página
   * @param perPage - Elementos por página
   * @returns Datos de las facturas electrónicas
   */
  async getElectronicInvoices(entity: Entity, page: number = 1, perPage: number = 10) {
    try {
      if (!entity.apiKeyPlemsi) {
        throw new Error('Clave de Plemsi no configurada para esta entidad');
      }

      // Construir la URL con parámetros de paginación
      const url = `${URL_PLEMSI}/billing/invoice?page=${page}&perPage=${perPage}`;
      
      // Realizar la petición a Plemsi
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${entity.apiKeyPlemsi}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.log('Error obteniendo facturas electrónicas:', error);
      throw error;
    }
  }

  /**
   * Obtiene una factura electrónica específica por número
   * @param entity - Entidad con información de la empresa
   * @param invoiceNumber - Número de la factura
   * @returns Datos de la factura electrónica
   */
  async getElectronicInvoice(entity: Entity, invoiceNumber: number) {
    try {
      console.log('🔍 PlemsiDocumentService - getElectronicInvoice called with:', { invoiceNumber, prefix: entity.prefix });
      
      if (!entity.apiKeyPlemsi) {
        throw new Error('Clave de Plemsi no configurada para esta entidad');
      }

      // Construir la URL con parámetros de paginación
      const url = `${URL_PLEMSI}/billing/invoice/one?by=number&value=${invoiceNumber}&prefix=${entity.prefix}`;
      console.log('🔍 PlemsiDocumentService - URL construida:', url);
      
      // Realizar la petición a Plemsi
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${entity.apiKeyPlemsi}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.log('❌ PlemsiDocumentService - Error obteniendo factura electrónica:', error);
      throw error;
    }
  }

  /**
   * Obtiene un documento soporte electrónico por CUDE
   * @param entity - Entidad con información de la empresa
   * @param cude - CUDE del documento soporte
   * @returns Datos del documento soporte electrónico
   */
  async getElectronicSupportDocument(entity: Entity, cude: string) {
    try {
      if (!entity.apiKeyPlemsi) {
        throw new Error('Clave de Plemsi no configurada para esta entidad');
      }

      // Construir la URL para obtener documento soporte por CUDE
      const url = `${URL_PLEMSI}/purchase/invoice/one?by=cude&value=${cude}`;
      
      // Realizar la petición a Plemsi
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${entity.apiKeyPlemsi}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.log('Error obteniendo documento soporte electrónico:', error);
      throw error;
    }
  }

  /**
   * Obtiene el listado de documentos soporte electrónicos desde Plemsi
   * @param entity - Entidad con información de la empresa
   * @param page - Número de página
   * @param perPage - Elementos por página
   * @returns Datos de los documentos soporte electrónicos
   */
  async getElectronicSupportDocuments(entity: Entity, page: number = 1, perPage: number = 10) {
    try {
      if (!entity.apiKeyPlemsi) {
        throw new Error('Clave de Plemsi no configurada para esta entidad');
      }

      // Construir la URL con parámetros de paginación y estado
      const url = `${URL_PLEMSI}/purchase/invoice?page=${page}&perPage=${perPage}&state=Emitted`;
      
      // Realizar la petición a Plemsi
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${entity.apiKeyPlemsi}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.log('Error obteniendo documentos soporte electrónicos:', error);
      throw error;
    }
  }
}
