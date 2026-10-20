/* ---- Shared Types ----
  The circular-natal-horoscope-js typings expose most of the Horoscope's data as `any`.
  These interfaces describe the parts of that data this app reads, so the rest of the app
  stays fully typed. They are applied once, in astro.ts, where the Horoscope is created.
*/
import type { Horoscope } from 'circular-natal-horoscope-js';

/* <- Chart Options -> */
export type ChartType = 'birth' | 'moment';
export type Zodiac = 'tropical' | 'sidereal';
export type HouseSystem =
  | 'placidus'
  | 'koch'
  | 'whole-sign'
  | 'equal-house'
  | 'regiomontanus'
  | 'topocentric';

/* <- Chart Input -> */
export interface ChartData {
  type: ChartType;
  year: number;
  month: number; // 0 = Jan, 11 = Dec
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  unknown: boolean;
  zodiac: Zodiac;
  houseSystem: HouseSystem;
}

/* <- Select List Options -> */
export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

/* <- Horoscope Data -> */
export interface ArcDegrees {
  degrees: number;
  minutes: number;
  seconds: number;
}

export interface Position {
  DecimalDegrees: number;
  ArcDegrees: ArcDegrees;
  ArcDegreesFormatted: string;
  ArcDegreesFormatted30: string;
}

export interface ChartPosition {
  Horizon: Position;
  Ecliptic: Position;
}

export interface ZodiacSign {
  key: string;
  label: string;
  zodiac: Zodiac;
  zodiacStart: number;
  zodiacEnd: number;
}

export interface House {
  id: number;
  label: string;
  Sign: ZodiacSign;
  ChartPosition: {
    StartPosition: ChartPosition;
    EndPosition: ChartPosition;
  };
}

export interface CelestialBody {
  key: string;
  label: string;
  Sign: ZodiacSign;
  ChartPosition: ChartPosition;
  House: House;
  isRetrograde?: boolean;
}

export interface Origin {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}

export interface HoroscopeData {
  /** The underlying library instance, kept for debugging / console logs */
  raw: Horoscope;
  origin: Origin;
  zodiac: Zodiac;
  houseSystem: HouseSystem;
  planets: CelestialBody[];
  houses: House[];
}
