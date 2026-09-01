export type ReconciliationStatus =
  | 'Matched'
  | 'Needs Review'
  | 'Missing BOL'
  | 'Quantity Mismatch'
  | 'Price Mismatch'
  | 'Missing POD';

export interface Reconciliation {
  id: string;
  run: string;
  customer: string;
  supplier: string;
  terminal: string;
  loadedQty: string;
  deliveredQty: string;
  purchaseCost: string;
  freight: string;
  customerPrice: string;
  documents: string;
  status: ReconciliationStatus;
}

export interface ReadyToInvoiceItem {
  id: string;
  customer: string;
  order: string;
  delivery: string;
  deliveredVolume: string;
  purchaseCost: string;
  freight: string;
  customerPrice: string;
  grossMargin: string;
  documents: string;
  status: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Disputed';

export interface Invoice {
  id: string;
  customer: string;
  order: string;
  date: string;
  amount: string;
  dueDate: string;
  status: InvoiceStatus;
  accountingSync: 'Synced' | 'Pending' | 'Failed';
}

export const reconciliations: Reconciliation[] = [
  {
    id: '2841',
    run: 'RN-2841',
    customer: 'Rhein-Main Logistics',
    supplier: 'Mannheim Supply BV',
    terminal: 'Mannheim',
    loadedQty: '32,000 L',
    deliveredQty: '32,000 L',
    purchaseCost: '€39,900',
    freight: '€1,420',
    customerPrice: '€42,440',
    documents: 'BOL ✓ · POD ✓',
    status: 'Matched',
  },
  {
    id: '2844',
    run: 'RN-2844',
    customer: 'Cologne Fuel Co.',
    supplier: 'Antwerp Refining NV',
    terminal: 'Antwerp',
    loadedQty: '24,000 L',
    deliveredQty: '24,000 L',
    purchaseCost: '€29,100',
    freight: '€1,010',
    customerPrice: '€31,120',
    documents: 'BOL ✓ · POD —',
    status: 'Missing POD',
  },
  {
    id: '2839',
    run: 'RN-2839',
    customer: 'Brabant Energy',
    supplier: 'Rotterdam Fuels BV',
    terminal: 'Rotterdam',
    loadedQty: '26,000 L',
    deliveredQty: '25,400 L',
    purchaseCost: '€31,600',
    freight: '€980',
    customerPrice: '€33,900',
    documents: 'BOL ✓ · POD ✓',
    status: 'Quantity Mismatch',
  },
  {
    id: '2854',
    run: 'RN-2854',
    customer: 'Praha Fuels',
    supplier: 'Pardubice Terminal s.r.o.',
    terminal: 'Pardubice',
    loadedQty: '25,000 L',
    deliveredQty: '25,000 L',
    purchaseCost: '€30,400',
    freight: '€890',
    customerPrice: '€32,450',
    documents: 'BOL — · POD ✓',
    status: 'Missing BOL',
  },
  {
    id: '2856',
    run: 'RN-2856',
    customer: 'Uppland Fuels',
    supplier: 'Stockholm Supply AB',
    terminal: 'Stockholm',
    loadedQty: '21,000 L',
    deliveredQty: '21,000 L',
    purchaseCost: '€26,300',
    freight: '€760',
    customerPrice: '€27,400',
    documents: 'BOL ✓ · POD ✓',
    status: 'Price Mismatch',
  },
  {
    id: '2850',
    run: 'RN-2850',
    customer: 'Weser Energy',
    supplier: 'Hamburg Supply GmbH',
    terminal: 'Hamburg',
    loadedQty: '28,000 L',
    deliveredQty: '28,000 L',
    purchaseCost: '€34,200',
    freight: '€1,150',
    customerPrice: '€36,500',
    documents: 'BOL ✓ · POD ✓',
    status: 'Needs Review',
  },
  {
    id: '2819',
    run: 'RN-2819',
    customer: 'Cologne Fuel Co.',
    supplier: 'Antwerp Refining NV',
    terminal: 'Antwerp',
    loadedQty: '31,500 L',
    deliveredQty: '31,500 L',
    purchaseCost: '€38,700',
    freight: '€1,330',
    customerPrice: '€40,950',
    documents: 'BOL ✓ · POD ✓',
    status: 'Matched',
  },
  {
    id: '2812',
    run: 'RN-2812',
    customer: 'Bonn Energy',
    supplier: 'Rotterdam Fuels BV',
    terminal: 'Rotterdam',
    loadedQty: '29,800 L',
    deliveredQty: '29,800 L',
    purchaseCost: '€36,400',
    freight: '€1,260',
    customerPrice: '€38,740',
    documents: 'BOL ✓ · POD ✓',
    status: 'Matched',
  },
];

export const readyToInvoice: ReadyToInvoiceItem[] = [
  {
    id: '2819',
    customer: 'Cologne Fuel Co.',
    order: '#2819',
    delivery: 'DLV-2819',
    deliveredVolume: '31,500 L',
    purchaseCost: '€38,700',
    freight: '€1,330',
    customerPrice: '€40,950',
    grossMargin: '€920',
    documents: 'BOL ✓ · POD ✓',
    status: 'Reconciled',
  },
  {
    id: '2812',
    customer: 'Bonn Energy',
    order: '#2812',
    delivery: 'DLV-2812',
    deliveredVolume: '29,800 L',
    purchaseCost: '€36,400',
    freight: '€1,260',
    customerPrice: '€38,740',
    grossMargin: '€1,080',
    documents: 'BOL ✓ · POD ✓',
    status: 'Reconciled',
  },
  {
    id: '2814',
    customer: 'Flanders Fuels',
    order: '#2814',
    delivery: 'DLV-2814',
    deliveredVolume: '22,000 L',
    purchaseCost: '€26,900',
    freight: '€940',
    customerPrice: '€28,600',
    grossMargin: '€760',
    documents: 'BOL ✓ · POD ✓',
    status: 'Reconciled',
  },
  {
    id: '2820',
    customer: 'Baltic Fuels',
    order: '#2820',
    delivery: 'DLV-2820',
    deliveredVolume: '20,000 L',
    purchaseCost: '€24,500',
    freight: '€860',
    customerPrice: '€26,000',
    grossMargin: '€640',
    documents: 'BOL ✓ · POD ✓',
    status: 'Reconciled',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-2026-1188',
    customer: 'Rhein-Main Logistics',
    order: '#2819',
    date: '18 Aug 2026',
    amount: '€40,950',
    dueDate: '17 Sep 2026',
    status: 'Sent',
    accountingSync: 'Synced',
  },
  {
    id: 'INV-2026-1182',
    customer: 'Cologne Fuel Co.',
    order: '#2814',
    date: '18 Aug 2026',
    amount: '€28,600',
    dueDate: '17 Sep 2026',
    status: 'Draft',
    accountingSync: 'Pending',
  },
  {
    id: 'INV-2026-1175',
    customer: 'Weser Energy',
    order: '#2801',
    date: '12 Aug 2026',
    amount: '€31,400',
    dueDate: '11 Sep 2026',
    status: 'Overdue',
    accountingSync: 'Synced',
  },
  {
    id: 'INV-2026-1170',
    customer: 'Mazovia Fuels',
    order: '#2795',
    date: '10 Aug 2026',
    amount: '€27,800',
    dueDate: '09 Sep 2026',
    status: 'Disputed',
    accountingSync: 'Failed',
  },
  {
    id: 'INV-2026-1162',
    customer: 'Danube Fuels',
    order: '#2788',
    date: '05 Aug 2026',
    amount: '€38,900',
    dueDate: '04 Sep 2026',
    status: 'Paid',
    accountingSync: 'Synced',
  },
  {
    id: 'INV-2026-1155',
    customer: 'Jutland Fuels',
    order: '#2780',
    date: '02 Aug 2026',
    amount: '€24,600',
    dueDate: '01 Sep 2026',
    status: 'Paid',
    accountingSync: 'Synced',
  },
  {
    id: 'INV-2026-1148',
    customer: 'Praha Fuels',
    order: '#2772',
    date: '28 Jul 2026',
    amount: '€29,100',
    dueDate: '27 Aug 2026',
    status: 'Sent',
    accountingSync: 'Synced',
  },
];