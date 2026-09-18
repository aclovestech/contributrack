'use client';

import { Button } from '@/components/ui/button';
import generatePdf from '@/lib/pdf-generator';
import { ReportRowData } from '@/types/donations';
import { Printer } from 'lucide-react';

interface PrintAnnualReportProps {
  data: ReportRowData[];
  year: number;
}

export function PrintAnnualReport({ data, year }: PrintAnnualReportProps) {
  function handleOnClick() {
    generatePdf(data, year);
  }

  return (
    <Button onClick={handleOnClick}>
      <Printer aria-hidden="true" />
      Print PDF
    </Button>
  );
}
