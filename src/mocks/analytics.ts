export type MetricTone = 'neutral' | 'primary' | 'accent' | 'secondary' | 'danger';

export interface Metric {
  label: string;
  value: string;
  delta: string;
  icon: string;
  tone: MetricTone;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface NamedAmount {
  label: string;
  value: string;
  amount: number;
}

export interface ComboPoint {
  label: string;
  volume: number;
  prevVolume: number;
  marginPerL: number;
  revenue: number;
  grossMargin: number;
  runs: number;
}

export interface DonutSlice {
  label: string;
  value: number;
  tone: 'primary' | 'accent' | 'secondary' | 'primarySoft' | 'accentSoft' | 'secondarySoft' | 'foreground';
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
export const overviewPrimaryMetrics: Metric[] = [
  { label: 'Revenue', value: '€2.41M', delta: '+4.8% vs prior', icon: 'ri-money-euro-circle-line', tone: 'primary' },
  { label: 'Gross Margin', value: '€186k', delta: '7.7% of revenue', icon: 'ri-line-chart-line', tone: 'primary' },
  { label: 'Margin / Litre', value: '€0.101', delta: '+€0.004 vs prior', icon: 'ri-scales-3-line', tone: 'accent' },
  { label: 'Volume Delivered', value: '1.84M L', delta: '+6.2% vs prior', icon: 'ri-drop-line', tone: 'neutral' },
  { label: 'On-time Delivery', value: '94.2%', delta: '+1.1pp vs prior', icon: 'ri-time-line', tone: 'accent' },
];

export const overviewSecondaryMetrics: Metric[] = [
  { label: 'Avg Delivered Cost', value: '€1.291/L', delta: '−0.8% vs prior', icon: 'ri-price-tag-3-line', tone: 'secondary' },
  { label: 'Runs Completed', value: '412', delta: '+18 vs prior', icon: 'ri-truck-line', tone: 'neutral' },
  { label: 'Cost / Delivery', value: '€382', delta: '−€9 vs prior', icon: 'ri-calculator-line', tone: 'secondary' },
  { label: 'Truck Utilization', value: '78%', delta: '+2pp vs prior', icon: 'ri-speed-up-line', tone: 'neutral' },
  { label: 'Sourcing Savings', value: '€14.2k', delta: '+€2.3k vs prior', icon: 'ri-funds-line', tone: 'accent' },
];

export const overviewCombo: ComboPoint[] = [
  { label: '6 Aug', volume: 48, prevVolume: 45, marginPerL: 0.098, revenue: 74, grossMargin: 5.8, runs: 8 },
  { label: '7 Aug', volume: 52, prevVolume: 49, marginPerL: 0.101, revenue: 79, grossMargin: 6.1, runs: 9 },
  { label: '8 Aug', volume: 55, prevVolume: 51, marginPerL: 0.103, revenue: 83, grossMargin: 6.4, runs: 11 },
  { label: '9 Aug', volume: 58, prevVolume: 53, marginPerL: 0.100, revenue: 86, grossMargin: 6.3, runs: 10 },
  { label: '10 Aug', volume: 54, prevVolume: 55, marginPerL: 0.099, revenue: 81, grossMargin: 6.0, runs: 12 },
  { label: '11 Aug', volume: 60, prevVolume: 54, marginPerL: 0.102, revenue: 89, grossMargin: 6.6, runs: 13 },
  { label: '12 Aug', volume: 63, prevVolume: 56, marginPerL: 0.104, revenue: 93, grossMargin: 6.9, runs: 11 },
  { label: '13 Aug', volume: 61, prevVolume: 57, marginPerL: 0.101, revenue: 90, grossMargin: 6.5, runs: 14 },
  { label: '14 Aug', volume: 59, prevVolume: 58, marginPerL: 0.097, revenue: 87, grossMargin: 6.1, runs: 12 },
  { label: '15 Aug', volume: 64, prevVolume: 56, marginPerL: 0.106, revenue: 95, grossMargin: 7.1, runs: 15 },
  { label: '16 Aug', volume: 66, prevVolume: 58, marginPerL: 0.108, revenue: 98, grossMargin: 7.4, runs: 14 },
  { label: '17 Aug', volume: 62, prevVolume: 59, marginPerL: 0.103, revenue: 92, grossMargin: 6.8, runs: 13 },
  { label: '18 Aug', volume: 65, prevVolume: 57, marginPerL: 0.107, revenue: 96, grossMargin: 7.2, runs: 15 },
  { label: '19 Aug', volume: 68, prevVolume: 60, marginPerL: 0.111, revenue: 101, grossMargin: 7.6, runs: 16 },
];

export interface ProductMixRow extends DonutSlice {
  marginPerL: string;
  grossMargin: string;
}

export const overviewProductMix: ProductMixRow[] = [
  { label: 'Diesel EN590', value: 72, marginPerL: '€0.094', grossMargin: '€124k', tone: 'primary' },
  { label: 'Petrol 95', value: 14, marginPerL: '€0.128', grossMargin: '€33k', tone: 'accent' },
  { label: 'Gasoil', value: 8, marginPerL: '€0.112', grossMargin: '€16k', tone: 'secondary' },
  { label: 'HVO100', value: 4, marginPerL: '€0.157', grossMargin: '€11k', tone: 'primarySoft' },
  { label: 'AdBlue', value: 2, marginPerL: '€0.086', grossMargin: '€2k', tone: 'foreground' },
];

// ---------------------------------------------------------------------------
// Sourcing
// ---------------------------------------------------------------------------
export const sourcingMetrics: Metric[] = [
  { label: 'Sourcing Savings', value: '€14.2k', delta: 'last 30 days', icon: 'ri-funds-line', tone: 'accent' },
  { label: 'Acceptance Rate', value: '82%', delta: 'of recommendations', icon: 'ri-thumb-up-line', tone: 'primary' },
  { label: 'Override Rate', value: '18%', delta: 'of recommendations', icon: 'ri-arrow-go-back-line', tone: 'secondary' },
  { label: 'Avg Delivered Cost', value: '€1.291/L', delta: '−0.8% vs prior', icon: 'ri-price-tag-3-line', tone: 'neutral' },
];

export const overrideReasons: DonutSlice[] = [
  { label: 'Price mismatch', value: 38, tone: 'primary' },
  { label: 'Allocation limits', value: 26, tone: 'accent' },
  { label: 'Distance / freight', value: 19, tone: 'secondary' },
  { label: 'Supplier preference', value: 11, tone: 'primarySoft' },
  { label: 'Other', value: 6, tone: 'foreground' },
];

export const spendBySupplier: NamedAmount[] = [
  { label: 'Vitol Energy', value: '€840k', amount: 840 },
  { label: 'Trafigura', value: '€560k', amount: 560 },
  { label: 'Gunvor Group', value: '€360k', amount: 360 },
  { label: 'Orlen', value: '€240k', amount: 240 },
  { label: 'OMV', value: '€130k', amount: 130 },
  { label: 'MOL Group', value: '€50k', amount: 50 },
];

export const volumeBySupplier: NamedAmount[] = [
  { label: 'Vitol Energy', value: '0.71M L', amount: 710 },
  { label: 'Trafigura', value: '0.47M L', amount: 470 },
  { label: 'Gunvor Group', value: '0.30M L', amount: 300 },
  { label: 'Orlen', value: '0.20M L', amount: 200 },
  { label: 'OMV', value: '0.11M L', amount: 110 },
  { label: 'MOL Group', value: '0.05M L', amount: 50 },
];

export const volumeByTerminal: NamedAmount[] = [
  { label: 'Rotterdam', value: '0.31M L', amount: 310 },
  { label: 'Antwerp', value: '0.26M L', amount: 260 },
  { label: 'Hamburg', value: '0.22M L', amount: 220 },
  { label: 'Mannheim', value: '0.18M L', amount: 180 },
  { label: 'Gdańsk', value: '0.16M L', amount: 160 },
  { label: 'Arad', value: '0.12M L', amount: 120 },
  { label: 'Basel', value: '0.10M L', amount: 100 },
  { label: 'Lyon', value: '0.09M L', amount: 90 },
  { label: 'Stockholm', value: '0.08M L', amount: 80 },
  { label: 'Pardubice', value: '0.07M L', amount: 70 },
  { label: 'Aalborg', value: '0.06M L', amount: 60 },
  { label: 'Vienna', value: '0.05M L', amount: 50 },
];

export const priceTrend: SeriesPoint[] = [
  { label: 'W1', value: 1318 },
  { label: 'W2', value: 1312 },
  { label: 'W3', value: 1305 },
  { label: 'W4', value: 1298 },
  { label: 'W5', value: 1302 },
  { label: 'W6', value: 1295 },
  { label: 'W7', value: 1291 },
  { label: 'W8', value: 1288 },
];

export const allocationUtilization: NamedAmount[] = [
  { label: 'Antwerp', value: '82%', amount: 82 },
  { label: 'Hamburg', value: '74%', amount: 74 },
  { label: 'Gdańsk', value: '71%', amount: 71 },
  { label: 'Rotterdam', value: '68%', amount: 68 },
  { label: 'Basel', value: '66%', amount: 66 },
  { label: 'Vienna', value: '64%', amount: 64 },
  { label: 'Arad', value: '63%', amount: 63 },
  { label: 'Mannheim', value: '61%', amount: 61 },
  { label: 'Stockholm', value: '59%', amount: 59 },
  { label: 'Lyon', value: '58%', amount: 58 },
  { label: 'Aalborg', value: '55%', amount: 55 },
  { label: 'Pardubice', value: '49%', amount: 49 },
];

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------
export const operationsMetrics: Metric[] = [
  { label: 'Runs per Day', value: '13.7', delta: 'avg over 30 days', icon: 'ri-truck-line', tone: 'neutral' },
  { label: 'On-time Delivery', value: '94.2%', delta: '+1.1pp vs prior', icon: 'ri-time-line', tone: 'accent' },
  { label: 'Avg Delivery Duration', value: '3h 42m', delta: '−8 min vs prior', icon: 'ri-hourglass-line', tone: 'neutral' },
  { label: 'Driver Utilization', value: '82%', delta: '+3pp vs prior', icon: 'ri-user-star-line', tone: 'primary' },
  { label: 'Truck Utilization', value: '78%', delta: '+2pp vs prior', icon: 'ri-speed-up-line', tone: 'neutral' },
  { label: 'Distance per Run', value: '214 km', delta: '−6 km vs prior', icon: 'ri-route-line', tone: 'secondary' },
  { label: 'Terminal Wait Time', value: '28 min', delta: '−3 min vs prior', icon: 'ri-timer-line', tone: 'secondary' },
];

export const runsPerDayTrend: SeriesPoint[] = [
  { label: '6 Aug', value: 8 },
  { label: '7 Aug', value: 9 },
  { label: '8 Aug', value: 11 },
  { label: '9 Aug', value: 10 },
  { label: '10 Aug', value: 12 },
  { label: '11 Aug', value: 13 },
  { label: '12 Aug', value: 11 },
  { label: '13 Aug', value: 14 },
  { label: '14 Aug', value: 12 },
  { label: '15 Aug', value: 15 },
  { label: '16 Aug', value: 14 },
  { label: '17 Aug', value: 13 },
  { label: '18 Aug', value: 15 },
  { label: '19 Aug', value: 16 },
];

export const delaysByReason: NamedAmount[] = [
  { label: 'Traffic', value: '14', amount: 14 },
  { label: 'Terminal delay', value: '9', amount: 9 },
  { label: 'Driver', value: '4', amount: 4 },
  { label: 'Truck', value: '3', amount: 3 },
  { label: 'Weather', value: '2', amount: 2 },
  { label: 'Other', value: '2', amount: 2 },
];

export const terminalWaitTime: NamedAmount[] = [
  { label: 'Rotterdam', value: '24 min', amount: 24 },
  { label: 'Antwerp', value: '38 min', amount: 38 },
  { label: 'Mannheim', value: '19 min', amount: 19 },
  { label: 'Hamburg', value: '27 min', amount: 27 },
  { label: 'Lyon', value: '62 min', amount: 62 },
  { label: 'Basel', value: '21 min', amount: 21 },
  { label: 'Gdańsk', value: '25 min', amount: 25 },
  { label: 'Pardubice', value: '52 min', amount: 52 },
  { label: 'Arad', value: '23 min', amount: 23 },
  { label: 'Stockholm', value: '29 min', amount: 29 },
  { label: 'Aalborg', value: '20 min', amount: 20 },
  { label: 'Vienna', value: '22 min', amount: 22 },
];

// ---------------------------------------------------------------------------
// Financial
// ---------------------------------------------------------------------------
export const financialMetrics: Metric[] = [
  { label: 'Revenue', value: '€2.41M', delta: '+4.8% vs prior', icon: 'ri-money-euro-circle-line', tone: 'neutral' },
  { label: 'Purchase Cost', value: '€2.02M', delta: '83.8% of revenue', icon: 'ri-shopping-bag-3-line', tone: 'neutral' },
  { label: 'Freight Cost', value: '€204k', delta: '8.5% of revenue', icon: 'ri-truck-line', tone: 'secondary' },
  { label: 'Gross Margin', value: '€186k', delta: '7.7% of revenue', icon: 'ri-line-chart-line', tone: 'primary' },
  { label: 'Margin per Run', value: '€451', delta: '+€12 vs prior', icon: 'ri-scales-3-line', tone: 'primary' },
  { label: 'Margin per Litre', value: '€0.101', delta: '+€0.004 vs prior', icon: 'ri-percent-line', tone: 'accent' },
];

export const revenueTrend: SeriesPoint[] = [
  { label: '6 Aug', value: 62 },
  { label: '7 Aug', value: 71 },
  { label: '8 Aug', value: 78 },
  { label: '9 Aug', value: 74 },
  { label: '10 Aug', value: 82 },
  { label: '11 Aug', value: 85 },
  { label: '12 Aug', value: 80 },
  { label: '13 Aug', value: 88 },
  { label: '14 Aug', value: 84 },
  { label: '15 Aug', value: 91 },
  { label: '16 Aug', value: 87 },
  { label: '17 Aug', value: 90 },
  { label: '18 Aug', value: 94 },
  { label: '19 Aug', value: 97 },
];

export const marginByCustomer: NamedAmount[] = [
  { label: 'Rhein-Main Logistics', value: '€32k', amount: 32 },
  { label: 'Mazovia Fuels', value: '€24k', amount: 24 },
  { label: 'Jutland Fuels', value: '€21k', amount: 21 },
  { label: 'Cologne Fuel Co.', value: '€19k', amount: 19 },
  { label: 'Transdanubia Fuels', value: '€15k', amount: 15 },
  { label: 'Weser Energy', value: '€12k', amount: 12 },
  { label: 'Others', value: '€63k', amount: 63 },
];

export const marginByProduct: NamedAmount[] = [
  { label: 'Diesel EN590', value: '€148k', amount: 148 },
  { label: 'Petrol 95', value: '€21k', amount: 21 },
  { label: 'Gasoil', value: '€9k', amount: 9 },
  { label: 'HVO100', value: '€6k', amount: 6 },
  { label: 'AdBlue', value: '€2k', amount: 2 },
];

export const marginByTerminal: NamedAmount[] = [
  { label: 'Rotterdam', value: '€28k', amount: 28 },
  { label: 'Antwerp', value: '€24k', amount: 24 },
  { label: 'Hamburg', value: '€21k', amount: 21 },
  { label: 'Mannheim', value: '€19k', amount: 19 },
  { label: 'Gdańsk', value: '€17k', amount: 17 },
  { label: 'Basel', value: '€12k', amount: 12 },
  { label: 'Others', value: '€65k', amount: 65 },
];

// ---------------------------------------------------------------------------
// Terminals
// ---------------------------------------------------------------------------
export interface TerminalMetric {
  name: string;
  city: string;
  avgWait: string;
  onTimeLoading: string;
  volumeSourced: string;
  priceCompetitiveness: string;
  reliability: string;
  delays: number;
  cancelledPickups: number;
  predictedWait: string;
  actualWait: string;
}

export const terminalAnalytics: TerminalMetric[] = [
  { name: 'Rotterdam Terminal', city: 'Rotterdam', avgWait: '24 min', onTimeLoading: '96%', volumeSourced: '0.31M L', priceCompetitiveness: 'A', reliability: '96%', delays: 2, cancelledPickups: 0, predictedWait: '20 min', actualWait: '24 min' },
  { name: 'Antwerp Terminal', city: 'Antwerp', avgWait: '38 min', onTimeLoading: '90%', volumeSourced: '0.26M L', priceCompetitiveness: 'A', reliability: '92%', delays: 6, cancelledPickups: 1, predictedWait: '32 min', actualWait: '38 min' },
  { name: 'Mannheim Terminal', city: 'Mannheim', avgWait: '19 min', onTimeLoading: '97%', volumeSourced: '0.18M L', priceCompetitiveness: 'B', reliability: '97%', delays: 1, cancelledPickups: 0, predictedWait: '18 min', actualWait: '19 min' },
  { name: 'Hamburg Terminal', city: 'Hamburg', avgWait: '27 min', onTimeLoading: '94%', volumeSourced: '0.22M L', priceCompetitiveness: 'A', reliability: '94%', delays: 3, cancelledPickups: 0, predictedWait: '24 min', actualWait: '27 min' },
  { name: 'Lyon Terminal', city: 'Lyon', avgWait: '62 min', onTimeLoading: '84%', volumeSourced: '0.09M L', priceCompetitiveness: 'C', reliability: '86%', delays: 8, cancelledPickups: 2, predictedWait: '45 min', actualWait: '62 min' },
  { name: 'Basel Terminal', city: 'Basel', avgWait: '21 min', onTimeLoading: '95%', volumeSourced: '0.10M L', priceCompetitiveness: 'B', reliability: '95%', delays: 2, cancelledPickups: 0, predictedWait: '20 min', actualWait: '21 min' },
  { name: 'Gdańsk Terminal', city: 'Gdańsk', avgWait: '25 min', onTimeLoading: '94%', volumeSourced: '0.16M L', priceCompetitiveness: 'A', reliability: '94%', delays: 3, cancelledPickups: 0, predictedWait: '23 min', actualWait: '25 min' },
  { name: 'Pardubice Terminal', city: 'Pardubice', avgWait: '52 min', onTimeLoading: '88%', volumeSourced: '0.07M L', priceCompetitiveness: 'C', reliability: '89%', delays: 5, cancelledPickups: 1, predictedWait: '40 min', actualWait: '52 min' },
  { name: 'Arad Terminal', city: 'Arad', avgWait: '23 min', onTimeLoading: '93%', volumeSourced: '0.12M L', priceCompetitiveness: 'B', reliability: '93%', delays: 2, cancelledPickups: 0, predictedWait: '22 min', actualWait: '23 min' },
  { name: 'Stockholm Terminal', city: 'Stockholm', avgWait: '29 min', onTimeLoading: '92%', volumeSourced: '0.08M L', priceCompetitiveness: 'C', reliability: '92%', delays: 3, cancelledPickups: 0, predictedWait: '26 min', actualWait: '29 min' },
  { name: 'Aalborg Terminal', city: 'Aalborg', avgWait: '20 min', onTimeLoading: '95%', volumeSourced: '0.06M L', priceCompetitiveness: 'B', reliability: '95%', delays: 1, cancelledPickups: 0, predictedWait: '19 min', actualWait: '20 min' },
  { name: 'Vienna Terminal', city: 'Vienna', avgWait: '22 min', onTimeLoading: '95%', volumeSourced: '0.05M L', priceCompetitiveness: 'B', reliability: '95%', delays: 2, cancelledPickups: 0, predictedWait: '21 min', actualWait: '22 min' },
];