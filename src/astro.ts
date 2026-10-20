/*
    ---- Imports ----
*/
import { Origin, Horoscope } from 'circular-natal-horoscope-js';
import type {
  CelestialBody,
  ChartData,
  House,
  HoroscopeData,
  HouseSystem,
  Origin as OriginData,
  Zodiac,
} from './types';

/*
    ---- Types ----
*/
type AspectPoint = 'all' | 'bodies' | 'points' | 'angles';
type AspectType = 'major' | 'minor' | 'conjunction' | 'opposition';

interface Orbs {
  conjunction: number;
  opposition: number;
  square: number;
  trine: number;
  sextile: number;
  quintile: number;
  septile: number;
  // octile: number;
  // novile: number;
  semiSextile: number;
  quincunx: number;
  // sesquiquadrate: number;
}

interface OriginInput {
  year: number; // value >= 0 C.E.
  month: number; // 0 = Jan, 11 = Dec
  date: number; // 1...31
  hour: number; // local time - hour value (0...23)
  minute: number; // local time - minute value (0...59)
  latitude: number; // lat. in decimal format (-90.00...90.00)
  longitude: number; // long. in decimal format (-180.00...180.00)
}

interface HoroscopeInput {
  origin: Origin;
  houseSystem: HouseSystem;
  zodiac: Zodiac;
  aspectPoints: AspectPoint[];
  aspectWithPoints: AspectPoint[];
  aspectTypes: AspectType[];
  customOrbs: Record<string, number>;
  language: string;
}

/*
    ---- Create Class Instances ----
*/
const createOrbs = ({ semiSextile, ...orbs }: Orbs): Record<string, number> => ({
  ...orbs,
  'semi-sextile': semiSextile,
});

const createOrigin = (input: OriginInput): Origin => {
  /*
    <- Notes ->
  */
  // This class automatically derives the local timezone from lat. / long. coords
  // Calculates UTC time w/ respect to timezone & historical daylight savings time
  // Works only for C.E. date (> 0)
  return new Origin(input);
};

const createHoroscope = (input: HoroscopeInput): Horoscope => {
  /*
    <- Params ->
  */
  // houseSystem      - placidus, koch, whole-sign, equal-house, regiomontanus, topocentric
  // zodiac           - tropical, sidereal
  // aspectPoints     - bodies, points, angles (array w/ none or all of these options, determine starting points for aspect generation)
  // aspectWithPoints - bodies, points, angles (array w/ none or all of these options, determine starting points for aspect generation)
  // aspectTypes      - major, minor, conjunction, opposition (array w/ none or all of these options, chooses which aspects to calculate)
  // customOrbs       - an obj w/ keys set to override default orbs & set your own for aspect calculation
  // language         - en, es, etc. (return labels & results in a specific language)

  /*
    <- Note ->
  */
  // bodies = planets, points = lunar nodes / lilith, angles = ASC / MC
  // can pass in individual bodies, points, or angles in aspectPoints or aspectWithPoints
  // e.x. -> { aspectPoints: ["sun"], aspectWithPoints: ["moon"], aspectTypes: ["major", "quincunx"] }
  // only calculates sun to moon major or quincunx aspects, if they exist
  // all usable keys found in ./src/constant.js under BODIES, POINTS, ANGLES
  return new Horoscope(input);
};

/*
    ---- Instance Creation ----
*/
export const createInstances = (chartData: ChartData): HoroscopeData => {
  /*
    <- Origin ->
  */
  const origin = createOrigin({
    year: chartData.year,
    month: chartData.month,
    date: chartData.day,
    hour: chartData.hour,
    minute: chartData.minute,
    latitude: chartData.latitude,
    longitude: chartData.longitude,
  });

  /*
    <- Orbs ->
  */
  // Currently passing the default orbs for birth & composite charts ->
  // https://astro-charts.com/blog/2018/how-customize-orbs-your-charts/
  const orbs = createOrbs({
    conjunction: 8,
    opposition: 8,
    square: 7,
    trine: 8,
    sextile: 6,
    quintile: 1,
    septile: 1,
    // octile: 1,
    // novile: 0,
    semiSextile: 1,
    quincunx: 5,
    // sesquiquadrate: 1,
  });

  /*
    <- Horoscope ->
  */
  const horoscope = createHoroscope({
    origin,
    houseSystem: chartData.houseSystem,
    zodiac: chartData.zodiac,
    aspectPoints: ['all'],
    aspectWithPoints: ['all'],
    aspectTypes: ['major', 'minor'],
    customOrbs: orbs,
    language: 'en',
  });

  /* The library types these fields as `any`; narrow them once here */
  const celestialBodies = horoscope._celestialBodies as { all: LibraryCelestialBody[] };
  const houses = horoscope._houses as House[];
  return {
    raw: horoscope,
    origin: horoscope.origin as OriginData,
    zodiac: horoscope._zodiac as Zodiac,
    houseSystem: horoscope._houseSystem as HouseSystem,
    planets: celestialBodies.all.map((body) => withHouse(body, houses)),
    houses,
  };
};

/*
    ---- House Placement ----
*/
/* The library leaves `House` undefined for bodies in the house that spans 0° Aries */
type LibraryCelestialBody = Omit<CelestialBody, 'House'> & { House?: House };

const houseStart = (house: House): number => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees;

/* Finds the house whose cusps contain the given ecliptic position, wrapping past 360° */
export const findHouse = (position: number, houses: readonly House[]): House | undefined =>
  houses.find((house, i) => {
    const next = houses[(i + 1) % houses.length];
    if (!next) return false;
    const span = (houseStart(next) - houseStart(house) + 360) % 360;
    const offset = (position - houseStart(house) + 360) % 360;
    return offset < span;
  });

const withHouse = (body: LibraryCelestialBody, houses: readonly House[]): CelestialBody => {
  const house = body.House ?? findHouse(body.ChartPosition.Ecliptic.DecimalDegrees, houses);
  if (!house) {
    throw new Error(`Unable to determine the house for ${body.label}`);
  }
  return { ...body, House: house };
};

/* Chiron & Sirius are included in the library's celestial bodies, but aren't planets */
const NON_PLANETS: ReadonlySet<string> = new Set(['Chiron', 'Sirius']);
export const isPlanet = (body: CelestialBody): boolean => !NON_PLANETS.has(body.label);

/* The Sun & Moon never retrograde */
const LIGHTS: ReadonlySet<string> = new Set(['Sun', 'Moon']);
export const canRetrograde = (body: CelestialBody): boolean => isPlanet(body) && !LIGHTS.has(body.label);

export const findStellia =<T>(placementsArr: readonly T[], placement: T): number =>
  placementsArr.filter((p) => p === placement).length;
