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
  { label: 'dashboard.analytics.labels.revenue', value: '€2.41M', delta: '+4.8% vs prior', icon: 'ri-money-euro-circle-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.grossMargin', value: '€186k', delta: '7.7% of revenue', icon: 'ri-line-chart-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.marginPerLitre', value: '€0.101', delta: '+€0.004 vs prior', icon: 'ri-scales-3-line', tone: 'accent' },
  { label: 'dashboard.analytics.labels.volumeDelivered', value: '1.84M L', delta: '+6.2% vs prior', icon: 'ri-drop-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.onTimeDelivery', value: '94.2%', delta: '+1.1pp vs prior', icon: 'ri-time-line', tone: 'accent' },
];

export const overviewSecondaryMetrics: Metric[] = [
  { label: 'dashboard.analytics.labels.avgDeliveredCost', value: '€1.291/L', delta: '−0.8% vs prior', icon: 'ri-price-tag-3-line', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.runsCompleted', value: '412', delta: '+18 vs prior', icon: 'ri-truck-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.costPerDelivery', value: '€382', delta: '−€9 vs prior', icon: 'ri-calculator-line', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.truckUtilization', value: '78%', delta: '+2pp vs prior', icon: 'ri-speed-up-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.sourcingSavings', value: '€14.2k', delta: '+€2.3k vs prior', icon: 'ri-funds-line', tone: 'accent' },
];

export const overviewCombo: ComboPoint[] = [
  { label: 'dashboard.analytics.labels.aug6', volume: 48, prevVolume: 45, marginPerL: 0.098, revenue: 74, grossMargin: 5.8, runs: 8 },
  { label: 'dashboard.analytics.labels.aug7', volume: 52, prevVolume: 49, marginPerL: 0.101, revenue: 79, grossMargin: 6.1, runs: 9 },
  { label: 'dashboard.analytics.labels.aug8', volume: 55, prevVolume: 51, marginPerL: 0.103, revenue: 83, grossMargin: 6.4, runs: 11 },
  { label: 'dashboard.analytics.labels.aug9', volume: 58, prevVolume: 53, marginPerL: 0.100, revenue: 86, grossMargin: 6.3, runs: 10 },
  { label: 'dashboard.analytics.labels.aug10', volume: 54, prevVolume: 55, marginPerL: 0.099, revenue: 81, grossMargin: 6.0, runs: 12 },
  { label: 'dashboard.analytics.labels.aug11', volume: 60, prevVolume: 54, marginPerL: 0.102, revenue: 89, grossMargin: 6.6, runs: 13 },
  { label: 'dashboard.analytics.labels.aug12', volume: 63, prevVolume: 56, marginPerL: 0.104, revenue: 93, grossMargin: 6.9, runs: 11 },
  { label: 'dashboard.analytics.labels.aug13', volume: 61, prevVolume: 57, marginPerL: 0.101, revenue: 90, grossMargin: 6.5, runs: 14 },
  { label: 'dashboard.analytics.labels.aug14', volume: 59, prevVolume: 58, marginPerL: 0.097, revenue: 87, grossMargin: 6.1, runs: 12 },
  { label: 'dashboard.analytics.labels.aug15', volume: 64, prevVolume: 56, marginPerL: 0.106, revenue: 95, grossMargin: 7.1, runs: 15 },
  { label: 'dashboard.analytics.labels.aug16', volume: 66, prevVolume: 58, marginPerL: 0.108, revenue: 98, grossMargin: 7.4, runs: 14 },
  { label: 'dashboard.analytics.labels.aug17', volume: 62, prevVolume: 59, marginPerL: 0.103, revenue: 92, grossMargin: 6.8, runs: 13 },
  { label: 'dashboard.analytics.labels.aug18', volume: 65, prevVolume: 57, marginPerL: 0.107, revenue: 96, grossMargin: 7.2, runs: 15 },
  { label: 'dashboard.analytics.labels.aug19', volume: 68, prevVolume: 60, marginPerL: 0.111, revenue: 101, grossMargin: 7.6, runs: 16 },
];

export interface ProductMixRow extends DonutSlice {
  marginPerL: string;
  grossMargin: string;
}

export const overviewProductMix: ProductMixRow[] = [
  { label: 'dashboard.analytics.labels.dieselEn590', value: 72, marginPerL: '€0.094', grossMargin: '€124k', tone: 'primary' },
  { label: 'dashboard.analytics.labels.petrol95', value: 14, marginPerL: '€0.128', grossMargin: '€33k', tone: 'accent' },
  { label: 'dashboard.analytics.labels.gasoil', value: 8, marginPerL: '€0.112', grossMargin: '€16k', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.hvo100', value: 4, marginPerL: '€0.157', grossMargin: '€11k', tone: 'primarySoft' },
  { label: 'dashboard.analytics.labels.adblue', value: 2, marginPerL: '€0.086', grossMargin: '€2k', tone: 'foreground' },
];

// ---------------------------------------------------------------------------
// Sourcing
// ---------------------------------------------------------------------------
export const sourcingMetrics: Metric[] = [
  { label: 'dashboard.analytics.labels.sourcingSavings', value: '€14.2k', delta: 'last 30 days', icon: 'ri-funds-line', tone: 'accent' },
  { label: 'dashboard.analytics.labels.acceptanceRate', value: '82%', delta: 'of recommendations', icon: 'ri-thumb-up-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.overrideRate', value: '18%', delta: 'of recommendations', icon: 'ri-arrow-go-back-line', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.avgDeliveredCost', value: '€1.291/L', delta: '−0.8% vs prior', icon: 'ri-price-tag-3-line', tone: 'neutral' },
];

export const overrideReasons: DonutSlice[] = [
  { label: 'dashboard.analytics.labels.priceMismatch', value: 38, tone: 'primary' },
  { label: 'dashboard.analytics.labels.allocationLimits', value: 26, tone: 'accent' },
  { label: 'dashboard.analytics.labels.distanceFreight', value: 19, tone: 'secondary' },
  { label: 'dashboard.analytics.labels.supplierPreference', value: 11, tone: 'primarySoft' },
  { label: 'dashboard.analytics.labels.other', value: 6, tone: 'foreground' },
];

export const spendBySupplier: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.vitolEnergy', value: '€840k', amount: 840 },
  { label: 'dashboard.analytics.labels.trafigura', value: '€560k', amount: 560 },
  { label: 'dashboard.analytics.labels.gunvorGroup', value: '€360k', amount: 360 },
  { label: 'dashboard.analytics.labels.orlen', value: '€240k', amount: 240 },
  { label: 'dashboard.analytics.labels.omv', value: '€130k', amount: 130 },
  { label: 'dashboard.analytics.labels.molGroup', value: '€50k', amount: 50 },
];

export const volumeBySupplier: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.vitolEnergy', value: '0.71M L', amount: 710 },
  { label: 'dashboard.analytics.labels.trafigura', value: '0.47M L', amount: 470 },
  { label: 'dashboard.analytics.labels.gunvorGroup', value: '0.30M L', amount: 300 },
  { label: 'dashboard.analytics.labels.orlen', value: '0.20M L', amount: 200 },
  { label: 'dashboard.analytics.labels.omv', value: '0.11M L', amount: 110 },
  { label: 'dashboard.analytics.labels.molGroup', value: '0.05M L', amount: 50 },
];

export const volumeByTerminal: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.rotterdam', value: '0.31M L', amount: 310 },
  { label: 'dashboard.analytics.labels.antwerp', value: '0.26M L', amount: 260 },
  { label: 'dashboard.analytics.labels.hamburg', value: '0.22M L', amount: 220 },
  { label: 'dashboard.analytics.labels.mannheim', value: '0.18M L', amount: 180 },
  { label: 'dashboard.analytics.labels.gdansk', value: '0.16M L', amount: 160 },
  { label: 'dashboard.analytics.labels.arad', value: '0.12M L', amount: 120 },
  { label: 'dashboard.analytics.labels.basel', value: '0.10M L', amount: 100 },
  { label: 'dashboard.analytics.labels.lyon', value: '0.09M L', amount: 90 },
  { label: 'dashboard.analytics.labels.stockholm', value: '0.08M L', amount: 80 },
  { label: 'dashboard.analytics.labels.pardubice', value: '0.07M L', amount: 70 },
  { label: 'dashboard.analytics.labels.aalborg', value: '0.06M L', amount: 60 },
  { label: 'dashboard.analytics.labels.vienna', value: '0.05M L', amount: 50 },
];

export const priceTrend: SeriesPoint[] = [
  { label: 'dashboard.analytics.labels.week1', value: 1318 },
  { label: 'dashboard.analytics.labels.week2', value: 1312 },
  { label: 'dashboard.analytics.labels.week3', value: 1305 },
  { label: 'dashboard.analytics.labels.week4', value: 1298 },
  { label: 'dashboard.analytics.labels.week5', value: 1302 },
  { label: 'dashboard.analytics.labels.week6', value: 1295 },
  { label: 'dashboard.analytics.labels.week7', value: 1291 },
  { label: 'dashboard.analytics.labels.week8', value: 1288 },
];

export const allocationUtilization: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.antwerp', value: '82%', amount: 82 },
  { label: 'dashboard.analytics.labels.hamburg', value: '74%', amount: 74 },
  { label: 'dashboard.analytics.labels.gdansk', value: '71%', amount: 71 },
  { label: 'dashboard.analytics.labels.rotterdam', value: '68%', amount: 68 },
  { label: 'dashboard.analytics.labels.basel', value: '66%', amount: 66 },
  { label: 'dashboard.analytics.labels.vienna', value: '64%', amount: 64 },
  { label: 'dashboard.analytics.labels.arad', value: '63%', amount: 63 },
  { label: 'dashboard.analytics.labels.mannheim', value: '61%', amount: 61 },
  { label: 'dashboard.analytics.labels.stockholm', value: '59%', amount: 59 },
  { label: 'dashboard.analytics.labels.lyon', value: '58%', amount: 58 },
  { label: 'dashboard.analytics.labels.aalborg', value: '55%', amount: 55 },
  { label: 'dashboard.analytics.labels.pardubice', value: '49%', amount: 49 },
];

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------
export const operationsMetrics: Metric[] = [
  { label: 'dashboard.analytics.labels.runsPerDay', value: '13.7', delta: 'avg over 30 days', icon: 'ri-truck-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.onTimeDelivery', value: '94.2%', delta: '+1.1pp vs prior', icon: 'ri-time-line', tone: 'accent' },
  { label: 'dashboard.analytics.labels.avgDeliveryDuration', value: '3h 42m', delta: '−8 min vs prior', icon: 'ri-hourglass-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.driverUtilization', value: '82%', delta: '+3pp vs prior', icon: 'ri-user-star-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.truckUtilization', value: '78%', delta: '+2pp vs prior', icon: 'ri-speed-up-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.distancePerRun', value: '214 km', delta: '−6 km vs prior', icon: 'ri-route-line', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.terminalWaitTime', value: '28 min', delta: '−3 min vs prior', icon: 'ri-timer-line', tone: 'secondary' },
];

export const runsPerDayTrend: SeriesPoint[] = [
  { label: 'dashboard.analytics.labels.aug6', value: 8 },
  { label: 'dashboard.analytics.labels.aug7', value: 9 },
  { label: 'dashboard.analytics.labels.aug8', value: 11 },
  { label: 'dashboard.analytics.labels.aug9', value: 10 },
  { label: 'dashboard.analytics.labels.aug10', value: 12 },
  { label: 'dashboard.analytics.labels.aug11', value: 13 },
  { label: 'dashboard.analytics.labels.aug12', value: 11 },
  { label: 'dashboard.analytics.labels.aug13', value: 14 },
  { label: 'dashboard.analytics.labels.aug14', value: 12 },
  { label: 'dashboard.analytics.labels.aug15', value: 15 },
  { label: 'dashboard.analytics.labels.aug16', value: 14 },
  { label: 'dashboard.analytics.labels.aug17', value: 13 },
  { label: 'dashboard.analytics.labels.aug18', value: 15 },
  { label: 'dashboard.analytics.labels.aug19', value: 16 },
];

export const delaysByReason: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.traffic', value: '14', amount: 14 },
  { label: 'dashboard.analytics.labels.terminalDelay', value: '9', amount: 9 },
  { label: 'dashboard.analytics.labels.driver', value: '4', amount: 4 },
  { label: 'dashboard.analytics.labels.truck', value: '3', amount: 3 },
  { label: 'dashboard.analytics.labels.weather', value: '2', amount: 2 },
  { label: 'dashboard.analytics.labels.other', value: '2', amount: 2 },
];

export const terminalWaitTime: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.rotterdam', value: '24 min', amount: 24 },
  { label: 'dashboard.analytics.labels.antwerp', value: '38 min', amount: 38 },
  { label: 'dashboard.analytics.labels.mannheim', value: '19 min', amount: 19 },
  { label: 'dashboard.analytics.labels.hamburg', value: '27 min', amount: 27 },
  { label: 'dashboard.analytics.labels.lyon', value: '62 min', amount: 62 },
  { label: 'dashboard.analytics.labels.basel', value: '21 min', amount: 21 },
  { label: 'dashboard.analytics.labels.gdansk', value: '25 min', amount: 25 },
  { label: 'dashboard.analytics.labels.pardubice', value: '52 min', amount: 52 },
  { label: 'dashboard.analytics.labels.arad', value: '23 min', amount: 23 },
  { label: 'dashboard.analytics.labels.stockholm', value: '29 min', amount: 29 },
  { label: 'dashboard.analytics.labels.aalborg', value: '20 min', amount: 20 },
  { label: 'dashboard.analytics.labels.vienna', value: '22 min', amount: 22 },
];

// ---------------------------------------------------------------------------
// Financial
// ---------------------------------------------------------------------------
export const financialMetrics: Metric[] = [
  { label: 'dashboard.analytics.labels.revenue', value: '€2.41M', delta: '+4.8% vs prior', icon: 'ri-money-euro-circle-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.purchaseCost', value: '€2.02M', delta: '83.8% of revenue', icon: 'ri-shopping-bag-3-line', tone: 'neutral' },
  { label: 'dashboard.analytics.labels.freightCost', value: '€204k', delta: '8.5% of revenue', icon: 'ri-truck-line', tone: 'secondary' },
  { label: 'dashboard.analytics.labels.grossMargin', value: '€186k', delta: '7.7% of revenue', icon: 'ri-line-chart-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.marginPerRun', value: '€451', delta: '+€12 vs prior', icon: 'ri-scales-3-line', tone: 'primary' },
  { label: 'dashboard.analytics.labels.marginPerLitre', value: '€0.101', delta: '+€0.004 vs prior', icon: 'ri-percent-line', tone: 'accent' },
];

export const revenueTrend: SeriesPoint[] = [
  { label: 'dashboard.analytics.labels.aug6', value: 62 },
  { label: 'dashboard.analytics.labels.aug7', value: 71 },
  { label: 'dashboard.analytics.labels.aug8', value: 78 },
  { label: 'dashboard.analytics.labels.aug9', value: 74 },
  { label: 'dashboard.analytics.labels.aug10', value: 82 },
  { label: 'dashboard.analytics.labels.aug11', value: 85 },
  { label: 'dashboard.analytics.labels.aug12', value: 80 },
  { label: 'dashboard.analytics.labels.aug13', value: 88 },
  { label: 'dashboard.analytics.labels.aug14', value: 84 },
  { label: 'dashboard.analytics.labels.aug15', value: 91 },
  { label: 'dashboard.analytics.labels.aug16', value: 87 },
  { label: 'dashboard.analytics.labels.aug17', value: 90 },
  { label: 'dashboard.analytics.labels.aug18', value: 94 },
  { label: 'dashboard.analytics.labels.aug19', value: 97 },
];

export const marginByCustomer: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.rheinMainLogistics', value: '€32k', amount: 32 },
  { label: 'dashboard.analytics.labels.mazoviaFuels', value: '€24k', amount: 24 },
  { label: 'dashboard.analytics.labels.jutlandFuels', value: '€21k', amount: 21 },
  { label: 'dashboard.analytics.labels.cologneFuelCo', value: '€19k', amount: 19 },
  { label: 'dashboard.analytics.labels.transdanubiaFuels', value: '€15k', amount: 15 },
  { label: 'dashboard.analytics.labels.weserEnergy', value: '€12k', amount: 12 },
  { label: 'dashboard.analytics.labels.others', value: '€63k', amount: 63 },
];

export const marginByProduct: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.dieselEn590', value: '€148k', amount: 148 },
  { label: 'dashboard.analytics.labels.petrol95', value: '€21k', amount: 21 },
  { label: 'dashboard.analytics.labels.gasoil', value: '€9k', amount: 9 },
  { label: 'dashboard.analytics.labels.hvo100', value: '€6k', amount: 6 },
  { label: 'dashboard.analytics.labels.adblue', value: '€2k', amount: 2 },
];

export const marginByTerminal: NamedAmount[] = [
  { label: 'dashboard.analytics.labels.rotterdam', value: '€28k', amount: 28 },
  { label: 'dashboard.analytics.labels.antwerp', value: '€24k', amount: 24 },
  { label: 'dashboard.analytics.labels.hamburg', value: '€21k', amount: 21 },
  { label: 'dashboard.analytics.labels.mannheim', value: '€19k', amount: 19 },
  { label: 'dashboard.analytics.labels.gdansk', value: '€17k', amount: 17 },
  { label: 'dashboard.analytics.labels.basel', value: '€12k', amount: 12 },
  { label: 'dashboard.analytics.labels.others', value: '€65k', amount: 65 },
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