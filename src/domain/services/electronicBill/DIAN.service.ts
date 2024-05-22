import fs from 'fs';
import xmlbuilder from 'xmlbuilder';
import { SignedXml } from 'xml-crypto';

interface FormData {
  invoiceNumber: string;
  issueDate: string;
  invoiceTypeCode: string;
  currencyCode: string;
  note: string;
}

// Ruta al archivo que contiene la clave privada del certificado digital
const privateKeyPath = './privateKey.json';

function handleEvent(formData: FormData): void {
  // Transforma el formulario recibido a un objeto XML
  const xmlData = xmlbuilder.create('Invoice')
    .ele('InvoiceHeader')
      .ele('InvoiceNumber', formData.invoiceNumber)
      .ele('IssueDate', formData.issueDate)
      .ele('InvoiceTypeCode', formData.invoiceTypeCode)
      .ele('CurrencyCode', formData.currencyCode)
      .ele('Note', formData.note)
    .end({ pretty: true });

  // Convierte el objeto XML a cadena
  const xmlString = xmlData.toString();

  // Firma digital del XML
  let sig = new SignedXml({ privateKey: fs.readFileSync(privateKeyPath) });
  sig.addReference({
    xpath: "||Invoice||DebitNote||Creditnote||ApplicationResponse||AttachedDocument/ext:UBLExtensions/ext:UBLExtension/ext:ExtensionContent/ds:Signature/ds:SignatureValue",
    digestAlgorithm: "http:/www.w3.org/2001/04/xmlenc#sha256",
    transforms: ["http:/www.w3.org/2000/09/xmldsig#enveloped-signature"],
  });

  sig.canonicalizationAlgorithm = "http:/www.w3.org/TR/2001/RECxml-c14n-20010315";
  sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
  sig.computeSignature( xmlString);
  const signed = sig.getSignedXml();
  fs.writeFileSync("signed.xml", sig.getSignedXml());
  sendToDIAN(signed);
}

function sendToDIAN(xmlData: string): void {
  // Aquí implementarías la lógica para enviar el XML a la DIAN
  // Por ejemplo, usando axios o alguna otra biblioteca para hacer peticiones HTTP
  // Axios example:
  /*
  axios.post('https://api.dian.gov.co/facturaelectronica', xmlData, {
    headers: {
      'Content-Type': 'application/xml',
      'Authorization': 'Bearer tuTokenDeAutenticacion', // Si es necesario
    },
  })
  .then(response => {
    console.log('Respuesta de la DIAN:', response.data);
  })
  .catch(error => {
    console.error('Error al enviar el XML a la DIAN:', error);
  });
  */
}

// Ejemplo de uso
const formData: FormData = {
  invoiceNumber: '123456',
  issueDate: '2024-04-03T12:00:00-05:00',
  invoiceTypeCode: '01',
  currencyCode: 'COP',
  note: 'Factura de prueba',
};

handleEvent(formData);
