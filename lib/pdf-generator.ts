import { ReportRowData } from '@/types/donations';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

export default function generatePdf(
  data: ReportRowData[],
  year: number,
  total: number,
) {
  const documentDefinition: TDocumentDefinitions = {
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    content: [
      { text: `Annual Donation Summary for ${year}`, style: 'header' },
      {
        text: 'This report provides a breakdown of total donations from each unique contributor.',
        style: 'subheader',
      },
      {
        table: {
          body: [
            [
              { text: 'Donor Name', style: 'tableHeader' },
              { text: 'Total Amount Donated', style: 'tableHeader' },
            ],
            ...data.map((donor) => [
              donor.donorName,
              donor.amount.toLocaleString('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            ]),
          ],
        },
      },
      { text: '', margin: [0, 0, 0, 15] },
      {
        text: `Total Amount Donated: ${total.toLocaleString('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} CAD`,
        style: 'subheader',
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      body: {
        fontSize: 12,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
      },
    },
  };

  pdfMake.createPdf(documentDefinition).open();

  return;
}
