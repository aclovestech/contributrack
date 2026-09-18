'use client';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { formatCurrency } from '@/lib/utils';
import { sumAmounts } from '@/lib/reporting';
import { ReportRowData } from '@/types/donations';

// pdfmake's browser bundle exposes the virtual file system through a runtime
// method rather than a strongly typed property in the published declarations.
(pdfMake as any).addVirtualFileSystem(pdfFonts);

export function buildAnnualReportDocument(
  data: readonly ReportRowData[],
  year: number,
): TDocumentDefinitions {
  const total = sumAmounts(data.map((row) => row.amount));

  return {
    info: {
      title: `Annual Donation Summary for ${year}`,
      subject: 'ContribuTrack donor totals',
    },
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [40, 44, 40, 44],
    content: [
      { text: `Annual Donation Summary for ${year}`, style: 'header' },
      {
        text: 'Totals by donor for active donations. Keep this report with your yearly reconciliation.',
        style: 'subheader',
      },
      data.length
        ? {
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Donor', style: 'tableHeader' },
                  { text: 'Total donated', style: 'tableHeader' },
                ],
                ...data.map((donor) => [
                  donor.donorName,
                  formatCurrency(donor.amount),
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
          }
        : {
            text: 'No active donations were recorded for this year.',
            style: 'body',
          },
      {
        text: `Total donated: ${formatCurrency(total)}`,
        style: 'total',
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 14],
      },
      subheader: {
        fontSize: 11,
        color: '#555555',
        margin: [0, 0, 0, 18],
      },
      body: {
        fontSize: 11,
        margin: [0, 0, 0, 12],
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: '#111111',
      },
      total: {
        fontSize: 14,
        bold: true,
        margin: [0, 18, 0, 0],
      },
    },
    defaultStyle: {
      fontSize: 11,
    },
  };
}

export default function generatePdf(data: ReportRowData[], year: number) {
  const documentDefinition = buildAnnualReportDocument(data, year);
  pdfMake.createPdf(documentDefinition).open();
}
