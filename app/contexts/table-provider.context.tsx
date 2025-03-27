// contexts/table-type.context.tsx
'use client';

import { createContext, useContext } from 'react';

export type TableType = 'donors' | 'donations';

const TableTypeContext = createContext<TableType | null>(null);

export function TableTypeProvider({
  children,
  type,
}: {
  children: React.ReactNode;
  type: TableType;
}) {
  return (
    <TableTypeContext.Provider value={type}>
      {children}
    </TableTypeContext.Provider>
  );
}

export function useTableType() {
  const context = useContext(TableTypeContext);
  if (!context) throw new Error('Missing TableTypeProvider');
  return context;
}
