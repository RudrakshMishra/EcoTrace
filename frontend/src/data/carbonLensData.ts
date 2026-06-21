export const globalEmissions = {
  total: 37.4, // GT/yr
  yoyChange: 1.1, // %
  tempAnomaly: 1.36, // degrees C
  budgetRemainingYears: 6.5,
  renewableShare: 30.2, // %
  perCapitaAvg: 4.7, // tons
  historicalTrend: [
    { year: 2015, value: 35.5 },
    { year: 2016, value: 35.8 },
    { year: 2017, value: 36.3 },
    { year: 2018, value: 36.8 },
    { year: 2019, value: 37.0 },
    { year: 2020, value: 35.2 }, // COVID dip
    { year: 2021, value: 36.3 },
    { year: 2022, value: 36.8 },
    { year: 2023, value: 37.4 },
    { year: 2024, value: 37.8 }, // Projection
  ],
  sectors: [
    { label: 'Energy', value: 73, color: '#FF4757' },
    { label: 'Agriculture', value: 12, color: '#FFA726' },
    { label: 'Industry', value: 7, color: '#6B7488' },
    { label: 'Buildings', value: 5, color: '#00D9FF' },
    { label: 'Waste', value: 3, color: '#2ED573' },
  ]
};

export const indiaEmissions = {
  total: 2.9, // GT/yr
  yoyChange: 4.2, // %
  netZeroYear: 2070,
  renewableShare: 42.5, // % capacity
  perCapita: 1.9, // tons
  historicalTrend: [
    { year: 2015, value: 2.27 },
    { year: 2016, value: 2.38 },
    { year: 2017, value: 2.43 },
    { year: 2018, value: 2.60 },
    { year: 2019, value: 2.63 },
    { year: 2020, value: 2.44 },
    { year: 2021, value: 2.71 },
    { year: 2022, value: 2.83 },
    { year: 2023, value: 2.90 },
    { year: 2024, value: 3.02 }, // Projection
  ],
  sectors: [
    { label: 'Energy', value: 44, color: '#FF4757' },
    { label: 'Industry', value: 18, color: '#FFA726' },
    { label: 'Agriculture', value: 14, color: '#FF9933' },
    { label: 'Transport', value: 12, color: '#00D9FF' },
    { label: 'Buildings', value: 8, color: '#6B7488' },
    { label: 'Waste', value: 4, color: '#2ED573' },
  ]
};

export const comparisonData = [
  { id: 'IN', country: 'India', total: 2.9, perCapita: 1.9, yoyChange: +4.2, renewableShare: 42.5, netZero: 2070 },
  { id: 'CN', country: 'China', total: 11.4, perCapita: 8.0, yoyChange: +1.5, renewableShare: 31.0, netZero: 2060 },
  { id: 'US', country: 'USA', total: 5.0, perCapita: 14.5, yoyChange: -1.2, renewableShare: 23.0, netZero: 2050 },
  { id: 'EU', country: 'EU-27', total: 2.7, perCapita: 6.0, yoyChange: -3.5, renewableShare: 39.0, netZero: 2050 },
  { id: 'RU', country: 'Russia', total: 1.7, perCapita: 11.8, yoyChange: +0.8, renewableShare: 19.0, netZero: 2060 },
];

export const indiaStateData = [
  { state: 'Maharashtra', total: 280, perCapita: 2.3, driver: 'Industry & Power' },
  { state: 'Gujarat', total: 240, perCapita: 3.5, driver: 'Manufacturing' },
  { state: 'Uttar Pradesh', total: 210, perCapita: 0.9, driver: 'Agriculture' },
  { state: 'Tamil Nadu', total: 150, perCapita: 2.0, driver: 'Transport & Power' },
  { state: 'Rajasthan', total: 120, perCapita: 1.5, driver: 'Energy' },
];

export const insights = [
  {
    tag: 'Policy',
    headline: "India's emissions intensity has fallen 33% since 2005",
    summary: "Even as absolute emissions rose, decoupling is underway. The goal to reduce emissions intensity of its GDP by 45% by 2030 is well within reach.",
    source: "MoEFCC"
  },
  {
    tag: 'Energy',
    headline: "Renewable capacity additions hit record highs in 2023",
    summary: "But coal still supplies ~70% of power generation. The dual challenge of meeting peak demand while retiring thermal plants remains the primary bottleneck.",
    source: "IEA"
  },
  {
    tag: 'Agriculture',
    headline: "Agriculture drives a disproportionate share of India's methane",
    summary: "Rice cultivation and livestock represent massive methane sources—a policy blind spot that is beginning to receive targeted technological intervention.",
    source: "Global Carbon Project"
  },
  {
    tag: 'Global',
    headline: "China + USA + India + EU account for ~55% of global emissions",
    summary: "Climate stabilization relies disproportionately on policy shifts within these top four emitters, making bilateral agreements critical for the 1.5°C pathway.",
    source: "UNEP"
  }
];

export const newsItems = [
  { headline: "India announces new solar manufacturing incentives", source: "Reuters", date: "2026-06-18", tag: "Technology" },
  { headline: "COP30 preliminary outlines on climate finance targets", source: "Bloomberg", date: "2026-06-15", tag: "Policy" },
  { headline: "EU Carbon Border Adjustment Mechanism (CBAM) expands scope", source: "Financial Times", date: "2026-06-12", tag: "Markets" },
  { headline: "Global methane emissions hit new record despite pledges", source: "Nature", date: "2026-06-10", tag: "Science" },
];


// Scenario Modeler Base Data
export const scenarioBaseData = {
  historicalYears: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  projectionYears: [2025, 2030, 2035, 2040, 2045, 2050],
  globalBaseEmissions: [35.5, 35.8, 36.3, 36.8, 37.0, 35.2, 36.3, 36.8, 37.4, 37.8],
  indiaBaseEmissions: [2.27, 2.38, 2.43, 2.60, 2.63, 2.44, 2.71, 2.83, 2.90, 3.02],
  target1Point5C: [37.8, 25.0, 18.0, 10.0, 5.0, 0], // global path to net zero
  indiaTarget1Point5C: [3.02, 3.10, 2.80, 2.00, 1.00, 0], // india path to net zero
  
  // Base parameters
  defaultRenewableGlobal: 30, // %
  defaultGrowthGlobal: 2.5, // %
  
  defaultRenewableIndia: 42, // %
  defaultGrowthIndia: 6.5, // %
};
