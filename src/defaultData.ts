import type { ChartData, HouseSystem, SelectOption, Zodiac } from './types';

/* <- Defaults -> */
export const DEFAULT_ZODIAC: Zodiac = 'tropical';
export const DEFAULT_HOUSE_SYSTEM: HouseSystem = 'placidus';

/* Location used for the Moment Chart until the user shares their own */
export const DEFAULT_MOMENT_LOCATION = { latitude: 43.14, longitude: -80.25 } as const;

/* Chart of the moment, calculated from the current date & time */
export const createMomentData = (moment = new Date()): ChartData => ({
  type: 'moment',
  year: moment.getFullYear(),
  month: moment.getMonth(),
  day: moment.getDate(),
  hour: moment.getHours(),
  minute: moment.getMinutes(),
  unknown: false,
  ...DEFAULT_MOMENT_LOCATION,
  zodiac: DEFAULT_ZODIAC,
  houseSystem: DEFAULT_HOUSE_SYSTEM,
});

/* Values shown on the birth info form's page load */
export const BIRTHDATA: ChartData = {
  type: 'birth',
  year: 1998,
  month: 2,
  day: 29,
  hour: 9,
  minute: 10,
  unknown: false,
  latitude: 0,
  longitude: 0,
  zodiac: DEFAULT_ZODIAC,
  houseSystem: DEFAULT_HOUSE_SYSTEM,
};

/* <-- Populate Select Lists --> */
export const MONTHS: readonly SelectOption<number>[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, value) => ({ label, value }));

export const DAYS: readonly number[] = Array.from({ length: 31 }, (_, i) => i + 1);

export const HOURS: readonly SelectOption<number>[] = Array.from({ length: 24 }, (_, i) => ({
  label: `${i} ${i < 12 ? 'AM' : 'PM'}`,
  value: i,
}));

export const MINUTES: readonly number[] = Array.from({ length: 60 }, (_, i) => i);

export const ZODIACS: readonly SelectOption<Zodiac>[] = [
  { label: 'Tropical', value: 'tropical' },
  { label: 'Sidereal', value: 'sidereal' },
];

export const HOUSESYSTEMS: readonly SelectOption<HouseSystem>[] = [
  { label: 'Placidus', value: 'placidus' },
  { label: 'Whole Sign', value: 'whole-sign' },
  { label: 'Equal House', value: 'equal-house' },
  { label: 'Koch', value: 'koch' },
  { label: 'Regiomontanus', value: 'regiomontanus' },
  { label: 'Topocentric', value: 'topocentric' },
];
