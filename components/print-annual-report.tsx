'use client';

import { Button } from '@/components/ui/button';
import generatePdf from '@/lib/pdf-generator';
import { ReportRowData } from '@/types/donations';
import { Printer } from 'lucide-react';

interface PrintAnnualReportProps {
  data: ReportRowData[];
  year: number;
  total: number;
}

export function PrintAnnualReport({
  data,
  year,
  total,
}: PrintAnnualReportProps) {
  function handleOnClick() {
    generatePdf(data, year, total);
  }

  return (
    <Button onClick={handleOnClick}>
      <Printer />
      Print
    </Button>
  );
}
