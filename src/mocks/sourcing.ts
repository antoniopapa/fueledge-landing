export type TerminalStatus = 'Operational' | 'Busy' | 'Limited' | 'Issue';

export interface TerminalProduct {
  product: string;
  price: string;
  allocation: string;
}

export interface TerminalPickup {
  time: string;
  order: string;
  volume: string;
}

export interface Terminal {
  id: string;
  name: string;
  city: string;
  country: string;
  status: TerminalStatus;
  products: string[];
  basePrice: string;
  waitTime: string;
  allocation: string;
  cutoff: string;
  otif: string;
  avgWait: string;
  dailyThroughput: string;
  pickups: TerminalPickup[];
  pricing: { product: string; price: string; change: string }[];
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  activeTerminals: string[];
  products: string[];
  contractStatus: string;
  spend: string;
  volume: string;
  allocation: string;
  pricingStatus: string;
}

export interface PricingRecord {
  product: string;
  supplier: string;
  terminal: string;
  basePrice: string;
  contractAdjustment: string;
  effectivePrice: string;
  change: string;
  changeDir: 'up' | 'down' | 'flat';
  updated: string;
  dataSource: string;
}

export interface Contract {
  id: string;
  supplier: string;
  product: string;
  terminals: string[];
  period: string;
  priceDiscount: string;
  commitment: string;
  liftedVolume: string;
  remainingAllocation: string;
  status: string;
}

export type SourceRank = 'Recommended' | 'Available' | 'At Risk' | 'Not Feasible';

export interface SourceCandidate {
  terminal: string;
  terminalId: string;
  country: string;
  fuelPrice: string;
  contractPrice: string;
  discount: string;
  freight: string;
  distance: string;
  allocation: string;
  productAvailable: boolean;
  terminalAvailable: boolean;
  waitTime: string;
  cutoff: string;
  traffic: string;
  truckAvailable: boolean;
  driverAvailable: boolean;
  driverShift: string;
  windowFit: string;
  totalCost: string;
  rank: SourceRank;
  notes: string;
}

export interface SourcingOpportunity {
  order: string;
  route: string;
  volume: string;
  saving: string;
}

export interface PriceMovement {
  product: string;
  terminal: string;
  direction: 'up' | 'down';
  change: string;
}

export interface TerminalIssue {
  terminal: string;
  issue: string;
  severity: 'critical' | 'warning';
}

export interface AllocationWarning {
  terminal: string;
  product: string;
  remaining: string;
}

export interface ContractWarning {
  supplier: string;
  detail: string;
}

export interface AwaitingSourceOrder {
  order: string;
  customer: string;
  destination: string;
  product: string;
  volume: string;
  window: string;
}

export const sourcingKpis = [
  { label: 'Awaiting Sourcing', value: '6', sub: '2 urgent', tone: 'secondary' },
  { label: 'Recommended Opportunities', value: '4', sub: 'avg save €194', tone: 'neutral' },
  { label: 'Potential Savings', value: '€1,210', sub: 'today', tone: 'accent' },
  { label: 'Active Terminals', value: '12', sub: '10 operational', tone: 'neutral' },
  { label: 'At-risk Allocations', value: '3', sub: 'need review', tone: 'secondary' },
];

export const terminals: Terminal[] = [
  {
    id: 'rotterdam',
    name: 'Rotterdam Terminal',
    city: 'Rotterdam',
    country: 'NL',
    status: 'Operational',
    products: ['Diesel EN590', 'Gasoil', 'Petrol 95'],
    basePrice: '€1.299',
    waitTime: '25 min',
    allocation: '68%',
    cutoff: '14:00',
    otif: '96%',
    avgWait: '24 min',
    dailyThroughput: '4.2M L',
    pickups: [
      { time: '13:20', order: '#2839', volume: '26,000 L' },
      { time: '14:05', order: '#2864', volume: '30,000 L' },
      { time: '15:10', order: '#2871', volume: '32,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.299', change: '−0.8%' },
      { product: 'Gasoil', price: '€1.152', change: '−0.5%' },
      { product: 'Petrol 95', price: '€1.378', change: '+0.3%' },
    ],
  },
  {
    id: 'antwerp',
    name: 'Antwerp Terminal',
    city: 'Antwerp',
    country: 'BE',
    status: 'Busy',
    products: ['Diesel EN590', 'Gasoil', 'Heating Oil'],
    basePrice: '€1.291',
    waitTime: '40 min',
    allocation: '82%',
    cutoff: '13:30',
    otif: '93%',
    avgWait: '38 min',
    dailyThroughput: '3.8M L',
    pickups: [
      { time: '12:40', order: '#2844', volume: '24,000 L' },
      { time: '13:50', order: '#2840', volume: '24,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.291', change: '−0.6%' },
      { product: 'Gasoil', price: '€1.148', change: '−0.4%' },
      { product: 'Heating Oil', price: '€1.062', change: '−0.2%' },
    ],
  },
  {
    id: 'mannheim',
    name: 'Mannheim Terminal',
    city: 'Mannheim',
    country: 'DE',
    status: 'Operational',
    products: ['Diesel EN590', 'Petrol 95', 'AdBlue'],
    basePrice: '€1.309',
    waitTime: '20 min',
    allocation: '61%',
    cutoff: '14:30',
    otif: '97%',
    avgWait: '19 min',
    dailyThroughput: '2.9M L',
    pickups: [
      { time: '14:20', order: '#2841', volume: '32,000 L' },
      { time: '15:30', order: '#2861', volume: '28,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.309', change: 'flat' },
      { product: 'Petrol 95', price: '€1.392', change: '+0.4%' },
      { product: 'AdBlue', price: '€0.598', change: 'flat' },
    ],
  },
  {
    id: 'hamburg',
    name: 'Hamburg Terminal',
    city: 'Hamburg',
    country: 'DE',
    status: 'Operational',
    products: ['Diesel EN590', 'Gasoil', 'Heating Oil'],
    basePrice: '€1.295',
    waitTime: '28 min',
    allocation: '74%',
    cutoff: '13:45',
    otif: '94%',
    avgWait: '27 min',
    dailyThroughput: '3.1M L',
    pickups: [
      { time: '12:50', order: '#2850', volume: '28,000 L' },
      { time: '14:40', order: '#2862', volume: '26,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.295', change: '−0.7%' },
      { product: 'Gasoil', price: '€1.150', change: '−0.5%' },
      { product: 'Heating Oil', price: '€1.058', change: '−0.3%' },
    ],
  },
  {
    id: 'lyon',
    name: 'Lyon Terminal',
    city: 'Lyon',
    country: 'FR',
    status: 'Issue',
    products: ['Diesel EN590', 'Petrol 95'],
    basePrice: '€1.302',
    waitTime: '65 min',
    allocation: '58%',
    cutoff: '12:30',
    otif: '88%',
    avgWait: '62 min',
    dailyThroughput: '2.1M L',
    pickups: [
      { time: '13:10', order: '#2865', volume: '31,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.302', change: '+0.2%' },
      { product: 'Petrol 95', price: '€1.386', change: '+0.5%' },
    ],
  },
  {
    id: 'basel',
    name: 'Basel Terminal',
    city: 'Basel',
    country: 'CH',
    status: 'Operational',
    products: ['Diesel EN590', 'Petrol 95'],
    basePrice: '€1.303',
    waitTime: '22 min',
    allocation: '66%',
    cutoff: '14:15',
    otif: '95%',
    avgWait: '21 min',
    dailyThroughput: '1.8M L',
    pickups: [
      { time: '13:30', order: '#2852', volume: '27,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.303', change: 'flat' },
      { product: 'Petrol 95', price: '€1.389', change: '+0.3%' },
    ],
  },
  {
    id: 'gdansk',
    name: 'Gdańsk Terminal',
    city: 'Gdańsk',
    country: 'PL',
    status: 'Operational',
    products: ['Diesel EN590', 'Gasoil'],
    basePrice: '€1.297',
    waitTime: '26 min',
    allocation: '71%',
    cutoff: '13:50',
    otif: '94%',
    avgWait: '25 min',
    dailyThroughput: '2.6M L',
    pickups: [
      { time: '14:00', order: '#2855', volume: '29,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.297', change: '−0.6%' },
      { product: 'Gasoil', price: '€1.149', change: '−0.4%' },
    ],
  },
  {
    id: 'pardubice',
    name: 'Pardubice Terminal',
    city: 'Pardubice',
    country: 'CZ',
    status: 'Limited',
    products: ['Diesel EN590'],
    basePrice: '€1.294',
    waitTime: '55 min',
    allocation: '49%',
    cutoff: '12:45',
    otif: '90%',
    avgWait: '52 min',
    dailyThroughput: '1.2M L',
    pickups: [
      { time: '13:40', order: '#2854', volume: '25,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.294', change: 'flat' },
    ],
  },
  {
    id: 'arad',
    name: 'Arad Terminal',
    city: 'Arad',
    country: 'RO',
    status: 'Operational',
    products: ['Diesel EN590'],
    basePrice: '€1.296',
    waitTime: '24 min',
    allocation: '63%',
    cutoff: '13:20',
    otif: '93%',
    avgWait: '23 min',
    dailyThroughput: '1.9M L',
    pickups: [
      { time: '13:50', order: '#2848', volume: '30,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.296', change: '−0.5%' },
    ],
  },
  {
    id: 'stockholm',
    name: 'Stockholm Terminal',
    city: 'Stockholm',
    country: 'SE',
    status: 'Operational',
    products: ['Diesel EN590', 'Heating Oil'],
    basePrice: '€1.310',
    waitTime: '30 min',
    allocation: '59%',
    cutoff: '13:10',
    otif: '92%',
    avgWait: '29 min',
    dailyThroughput: '1.5M L',
    pickups: [
      { time: '14:10', order: '#2856', volume: '21,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.310', change: '+0.2%' },
      { product: 'Heating Oil', price: '€1.072', change: 'flat' },
    ],
  },
  {
    id: 'aalborg',
    name: 'Aalborg Terminal',
    city: 'Aalborg',
    country: 'DK',
    status: 'Operational',
    products: ['Diesel EN590'],
    basePrice: '€1.308',
    waitTime: '21 min',
    allocation: '55%',
    cutoff: '13:40',
    otif: '95%',
    avgWait: '20 min',
    dailyThroughput: '1.3M L',
    pickups: [
      { time: '13:20', order: '#2858', volume: '23,000 L' },
    ],
    pricing: [
      { product: 'Diesel EN590', price: '€1.308', change: '−0.3%' },
    ],
  },
  {
    id: 'vienna',
    name: 'Vienna Terminal',
    city: 'Vienna',
    country: 'AT',
    status: 'Operational',
    products: ['Diesel EN590', 'Petrol 95'],
    basePrice: '€1.306',
    waitTime: '23 min',
    allocation: '64%',
    cutoff: '14:00',
    otif: '95%',
    avgWait: '22 min',
    dailyThroughput: '1.7M L',
    pickups: [],
    pricing: [
      { product: 'Diesel EN590', price: '€1.306', change: 'flat' },
      { product: 'Petrol 95', price: '€1.390', change: '+0.3%' },
    ],
  },
];

export const suppliers: Supplier[] = [
  {
    id: 'vitol',
    name: 'Vitol Energy',
    country: 'NL',
    activeTerminals: ['Rotterdam', 'Antwerp', 'Hamburg'],
    products: ['Diesel EN590', 'Gasoil', 'Petrol 95'],
    contractStatus: 'Active',
    spend: '€1.84M',
    volume: '1.42M L',
    allocation: '72%',
    pricingStatus: 'Competitive',
  },
  {
    id: 'gunvor',
    name: 'Gunvor Group',
    country: 'CH',
    activeTerminals: ['Basel', 'Mannheim'],
    products: ['Diesel EN590', 'Petrol 95'],
    contractStatus: 'Active',
    spend: '€0.92M',
    volume: '0.71M L',
    allocation: '58%',
    pricingStatus: 'On contract',
  },
  {
    id: 'trafigura',
    name: 'Trafigura',
    country: 'NL',
    activeTerminals: ['Rotterdam', 'Gdańsk'],
    products: ['Diesel EN590', 'Gasoil'],
    contractStatus: 'Renegotiating',
    spend: '€1.21M',
    volume: '0.94M L',
    allocation: '61%',
    pricingStatus: 'Watch',
  },
  {
    id: 'ornlen',
    name: 'Orlen',
    country: 'PL',
    activeTerminals: ['Gdańsk', 'Pardubice'],
    products: ['Diesel EN590'],
    contractStatus: 'Active',
    spend: '€0.78M',
    volume: '0.61M L',
    allocation: '67%',
    pricingStatus: 'Competitive',
  },
  {
    id: 'omv',
    name: 'OMV',
    country: 'AT',
    activeTerminals: ['Vienna', 'Arad'],
    products: ['Diesel EN590', 'Petrol 95'],
    contractStatus: 'Expiring',
    spend: '€0.64M',
    volume: '0.49M L',
    allocation: '52%',
    pricingStatus: 'On contract',
  },
  {
    id: 'mol',
    name: 'MOL Group',
    country: 'HU',
    activeTerminals: ['Arad'],
    products: ['Diesel EN590'],
    contractStatus: 'Active',
    spend: '€0.41M',
    volume: '0.32M L',
    allocation: '60%',
    pricingStatus: 'Competitive',
  },
];

export const pricingRecords: PricingRecord[] = [
  { product: 'Diesel EN590', supplier: 'Vitol Energy', terminal: 'Rotterdam', basePrice: '€1.299', contractAdjustment: '−€0.012', effectivePrice: '€1.287', change: '−0.8%', changeDir: 'down', updated: '08:45', dataSource: 'Platts' },
  { product: 'Diesel EN590', supplier: 'Vitol Energy', terminal: 'Antwerp', basePrice: '€1.291', contractAdjustment: '−€0.010', effectivePrice: '€1.281', change: '−0.6%', changeDir: 'down', updated: '08:45', dataSource: 'Platts' },
  { product: 'Diesel EN590', supplier: 'Gunvor Group', terminal: 'Mannheim', basePrice: '€1.309', contractAdjustment: '−€0.011', effectivePrice: '€1.298', change: 'flat', changeDir: 'flat', updated: '08:30', dataSource: 'Argus' },
  { product: 'Diesel EN590', supplier: 'Gunvor Group', terminal: 'Basel', basePrice: '€1.303', contractAdjustment: '−€0.008', effectivePrice: '€1.295', change: 'flat', changeDir: 'flat', updated: '08:30', dataSource: 'Argus' },
  { product: 'Diesel EN590', supplier: 'Trafigura', terminal: 'Gdańsk', basePrice: '€1.297', contractAdjustment: '−€0.007', effectivePrice: '€1.290', change: '−0.6%', changeDir: 'down', updated: '08:20', dataSource: 'Platts' },
  { product: 'Diesel EN590', supplier: 'Orlen', terminal: 'Pardubice', basePrice: '€1.294', contractAdjustment: '−€0.006', effectivePrice: '€1.288', change: 'flat', changeDir: 'flat', updated: '08:15', dataSource: 'Manual' },
  { product: 'Diesel EN590', supplier: 'OMV', terminal: 'Vienna', basePrice: '€1.306', contractAdjustment: '−€0.008', effectivePrice: '€1.298', change: 'flat', changeDir: 'flat', updated: '08:10', dataSource: 'Argus' },
  { product: 'Diesel EN590', supplier: 'MOL Group', terminal: 'Arad', basePrice: '€1.296', contractAdjustment: '−€0.007', effectivePrice: '€1.289', change: '−0.5%', changeDir: 'down', updated: '08:05', dataSource: 'Manual' },
  { product: 'Petrol 95', supplier: 'Vitol Energy', terminal: 'Rotterdam', basePrice: '€1.378', contractAdjustment: '−€0.010', effectivePrice: '€1.368', change: '+0.3%', changeDir: 'up', updated: '08:45', dataSource: 'Platts' },
  { product: 'Petrol 95', supplier: 'Gunvor Group', terminal: 'Mannheim', basePrice: '€1.392', contractAdjustment: '−€0.011', effectivePrice: '€1.381', change: '+0.4%', changeDir: 'up', updated: '08:30', dataSource: 'Argus' },
];

export const contracts: Contract[] = [
  { id: 'CT-2201', supplier: 'Vitol Energy', product: 'Diesel EN590', terminals: ['Rotterdam', 'Antwerp', 'Hamburg'], period: '01 Jan – 31 Dec 2026', priceDiscount: '−€0.012/L', commitment: '18.0M L', liftedVolume: '9.4M L', remainingAllocation: '8.6M L', status: 'Active' },
  { id: 'CT-2202', supplier: 'Gunvor Group', product: 'Diesel EN590', terminals: ['Basel', 'Mannheim'], period: '01 Feb – 31 Jan 2027', priceDiscount: '−€0.011/L', commitment: '9.0M L', liftedVolume: '3.1M L', remainingAllocation: '5.9M L', status: 'Active' },
  { id: 'CT-2198', supplier: 'Trafigura', product: 'Diesel EN590', terminals: ['Rotterdam', 'Gdańsk'], period: '01 Mar – 28 Feb 2026', priceDiscount: '−€0.010/L', commitment: '12.0M L', liftedVolume: '10.8M L', remainingAllocation: '1.2M L', status: 'Expiring' },
  { id: 'CT-2204', supplier: 'Orlen', product: 'Diesel EN590', terminals: ['Gdańsk', 'Pardubice'], period: '01 Apr – 31 Mar 2027', priceDiscount: '−€0.009/L', commitment: '7.5M L', liftedVolume: '2.2M L', remainingAllocation: '5.3M L', status: 'Active' },
  { id: 'CT-2195', supplier: 'OMV', product: 'Diesel EN590', terminals: ['Vienna', 'Arad'], period: '01 Jan – 30 Jun 2026', priceDiscount: '−€0.008/L', commitment: '6.0M L', liftedVolume: '5.4M L', remainingAllocation: '0.6M L', status: 'At risk' },
  { id: 'CT-2206', supplier: 'MOL Group', product: 'Diesel EN590', terminals: ['Arad'], period: '01 May – 30 Apr 2027', priceDiscount: '−€0.007/L', commitment: '4.0M L', liftedVolume: '0.9M L', remainingAllocation: '3.1M L', status: 'Active' },
];

export const sourceCandidates: SourceCandidate[] = [
  {
    terminal: 'Mannheim Terminal',
    terminalId: 'mannheim',
    country: 'DE',
    fuelPrice: '€1.309',
    contractPrice: '€1.298',
    discount: '−€0.011',
    freight: '€552',
    distance: '92 km',
    allocation: '61%',
    productAvailable: true,
    terminalAvailable: true,
    waitTime: '20 min',
    cutoff: '14:30',
    traffic: 'Light',
    truckAvailable: true,
    driverAvailable: true,
    driverShift: 'Fits 06:00–16:00',
    windowFit: 'On time',
    totalCost: '€42,440',
    rank: 'Recommended',
    notes: 'Best delivered cost; contract discount applies.',
  },
  {
    terminal: 'Rotterdam Terminal',
    terminalId: 'rotterdam',
    country: 'NL',
    fuelPrice: '€1.299',
    contractPrice: '€1.287',
    discount: '−€0.012',
    freight: '€1,140',
    distance: '440 km',
    allocation: '68%',
    productAvailable: true,
    terminalAvailable: true,
    waitTime: '25 min',
    cutoff: '14:00',
    traffic: 'Moderate',
    truckAvailable: true,
    driverAvailable: true,
    driverShift: 'Tight',
    windowFit: 'At risk',
    totalCost: '€42,708',
    rank: 'Available',
    notes: 'Lower price but higher freight and distance.',
  },
  {
    terminal: 'Antwerp Terminal',
    terminalId: 'antwerp',
    country: 'BE',
    fuelPrice: '€1.291',
    contractPrice: '€1.281',
    discount: '−€0.010',
    freight: '€920',
    distance: '310 km',
    allocation: '82%',
    productAvailable: true,
    terminalAvailable: true,
    waitTime: '40 min',
    cutoff: '13:30',
    traffic: 'Heavy',
    truckAvailable: true,
    driverAvailable: false,
    driverShift: 'Conflicts',
    windowFit: 'At risk',
    totalCost: '€42,910',
    rank: 'At Risk',
    notes: 'Allocation high, no available driver.',
  },
  {
    terminal: 'Burghausen Terminal',
    terminalId: 'burghausen',
    country: 'DE',
    fuelPrice: '€1.339',
    contractPrice: '€1.339',
    discount: '—',
    freight: '€1,090',
    distance: '450 km',
    allocation: '38%',
    productAvailable: true,
    terminalAvailable: false,
    waitTime: '70 min',
    cutoff: '12:00',
    traffic: 'Moderate',
    truckAvailable: false,
    driverAvailable: false,
    driverShift: 'Conflicts',
    windowFit: 'Misses window',
    totalCost: '€43,938',
    rank: 'Not Feasible',
    notes: 'Terminal closed for maintenance, misses cutoff.',
  },
];

export const sourcingOpportunities: SourcingOpportunity[] = [
  { order: '#2869', route: 'Debrecen', volume: '22,000 L', saving: '€268' },
  { order: '#2868', route: 'Warsaw', volume: '29,000 L', saving: '€194' },
  { order: '#2867', route: 'Aarhus', volume: '23,000 L', saving: '€152' },
  { order: '#2866', route: 'Győr', volume: '26,000 L', saving: '€137' },
];

export const priceMovements: PriceMovement[] = [
  { product: 'Diesel EN590', terminal: 'Rotterdam', direction: 'down', change: '−€0.010' },
  { product: 'Diesel EN590', terminal: 'Antwerp', direction: 'down', change: '−€0.008' },
  { product: 'Petrol 95', terminal: 'Mannheim', direction: 'up', change: '+€0.006' },
  { product: 'Diesel EN590', terminal: 'Gdańsk', direction: 'down', change: '−€0.007' },
  { product: 'Diesel EN590', terminal: 'Stockholm', direction: 'up', change: '+€0.003' },
];

export const terminalIssues: TerminalIssue[] = [
  { terminal: 'Lyon Terminal', issue: 'Loading bay 3 out of service', severity: 'critical' },
  { terminal: 'Pardubice Terminal', issue: 'Weighbridge queue', severity: 'warning' },
  { terminal: 'Antwerp Terminal', issue: 'Elevated wait times', severity: 'warning' },
];

export const allocationWarnings: AllocationWarning[] = [
  { terminal: 'Antwerp', product: 'Diesel EN590', remaining: '18% left' },
  { terminal: 'Pardubice', product: 'Diesel EN590', remaining: '49% left' },
  { terminal: 'Lyon', product: 'Petrol 95', remaining: '12% left' },
];

export const contractWarnings: ContractWarning[] = [
  { supplier: 'OMV', detail: 'Contract expires in 30 days' },
  { supplier: 'Trafigura', detail: 'Allocation nearly exhausted (1.2M L left)' },
];

export const awaitingSourceOrders: AwaitingSourceOrder[] = [
  { order: '#2869', customer: 'Hajdú Fuels', destination: 'Debrecen', product: 'Diesel EN590', volume: '22,000 L', window: '15:00–18:00' },
  { order: '#2868', customer: 'Mazovia Fuels', destination: 'Warsaw', product: 'Diesel EN590', volume: '29,000 L', window: '17:00–20:00' },
  { order: '#2867', customer: 'Jutland Fuels', destination: 'Aarhus', product: 'Diesel EN590', volume: '23,000 L', window: '16:00–19:00' },
  { order: '#2866', customer: 'Transdanubia Fuels', destination: 'Győr', product: 'Diesel EN590', volume: '26,000 L', window: '08:00–11:00' },
];