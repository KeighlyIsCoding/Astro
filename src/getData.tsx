/* ---- Imports Section */
import { Chart } from '@astrodraw/astrochart';
import { useEffect, useId, useRef } from 'react';
import { isPlanet } from './astro';
import {
  DisplayStellia,
  DisplayChartRuler,
  DisplayDateTimeLocation,
  DisplayMethods,
  type Stellium,
} from './displayData';
import { Signs } from './signs';
import type { CelestialBody, House, HouseSystem, Origin, Zodiac } from './types';
/* End ---- */

/* ---- Types */
type AstroData = Parameters<Chart['radix']>[0];
/* End ---- */

/* ---- Chart Drawing Section */
const CHART_SIZE = 700;

/* Converts horoscope data into the format expected by astrochart */
const toAstroData = (planets: readonly CelestialBody[], houses: readonly House[]): AstroData => ({
  planets: Object.fromEntries(
    planets.filter(isPlanet).map((planet) => [
      planet.label,
      /* [position, velocity] - a negative velocity marks the planet as retrograde */
      [planet.ChartPosition.Ecliptic.DecimalDegrees, planet.isRetrograde ? -1 : 1],
    ]),
  ),
  cusps: houses.map((house) => house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees),
});

interface RadixChartProps {
  planets: readonly CelestialBody[];
  houses: readonly House[];
}
export const RadixChart = ({ planets, houses }: RadixChartProps) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const data = toAstroData(planets, houses);
    /* Angles sit on the 1st, 4th, 7th, & 10th house cusps */
    const [
      as, , , ic, , , ds, , , mc,
    ] = data.cusps;
    const radix = new Chart(id, CHART_SIZE, CHART_SIZE).radix(data);
    if (as !== undefined && ic !== undefined && ds !== undefined && mc !== undefined) {
      radix.addPointsOfInterest({ As: [as], Ic: [ic], Ds: [ds], Mc: [mc] });
    }
    radix.aspects();

    /* Remove the drawn SVG so re-renders don't stack charts on top of each other */
    return () => {
      container.replaceChildren();
    };
  }, [
    id, planets, houses,
  ]);

  return <div id={id} ref={containerRef} className='radix-chart' />;
};
/* End ---- */

/* ---- Get Data for Display Components Section */
interface CalculateStelliaProps {
  placementArr: readonly string[];
  placementSet: ReadonlySet<string>;
}
export const CalculateStellia = ({ placementArr, placementSet }: CalculateStelliaProps) => {
  const stellia: Stellium[] = [...placementSet]
    .map((signHouse) => ({
      label: signHouse,
      occurrences: placementArr.filter((p) => p === signHouse).length,
    }))
    .filter(({ occurrences }) => occurrences >= 3);

  /* <-- Return UI --> */
  return <DisplayStellia stellia={stellia} />;
};

interface GetSignHouseSetsProps {
  planets: readonly CelestialBody[];
  unknown?: boolean;
}
export const GetSignHouseSets = ({ planets, unknown = false }: GetSignHouseSetsProps) => {
  /* <-- Variable Declarations --> */
  const placementArr: string[] = [];

  /* Add signs & houses w/ planets in them to the array, avoiding data from non-planets */
  planets.filter(isPlanet).forEach((planet) => {
    placementArr.push(planet.Sign.label);
    if (!unknown) {
      placementArr.push(`${planet.House.label} House`);
    }
  });

  /* <-- Return Component Call --> */
  return <CalculateStellia placementArr={placementArr} placementSet={new Set(placementArr)} />;
};

interface GetDateTimeLocationMethodsProps {
  origin: Origin;
  zodiac: Zodiac;
  houseSystem: HouseSystem;
  unknown?: boolean;
}
export const GetDateTimeLocationMethods = ({
  origin,
  zodiac,
  houseSystem,
  unknown = false,
}: GetDateTimeLocationMethodsProps) => (
  <>
    <DisplayDateTimeLocation
      year={origin.year} month={origin.month} day={origin.date}
      hour={origin.hour} minute={origin.minute}
      latitude={origin.latitude} longitude={origin.longitude}
      unknown={unknown}
    />
    <DisplayMethods zodiac={zodiac} houseSystem={houseSystem} />
    {unknown && (
      <>
        <p className='unknown'>* Houses cannot be calculated due to unknown birth time</p>
        <p className='unknown'>* Degrees & Minutes / Seconds are approx. due to unknown birth time</p>
      </>
    )}
  </>
);

interface GetChartRulerProps {
  acHouse: House;
  planets: readonly CelestialBody[];
}
export const GetChartRuler = ({ acHouse, planets }: GetChartRulerProps) => {
  const acSign = Signs.find((sign) => sign.name === acHouse.Sign.label);
  if (!acSign) return null;

  const findPlanet = (name: string) => planets.find((planet) => planet.label === name);
  const chartTraditionalRuler = findPlanet(acSign.traditionalRuler);
  if (!chartTraditionalRuler) return null;
  const chartModernRuler = (acSign.modernRuler && findPlanet(acSign.modernRuler)) ?? chartTraditionalRuler;

  return (
    <DisplayChartRuler
      acSign={acSign}
      chartTraditionalRuler={chartTraditionalRuler}
      chartModernRuler={chartModernRuler}
    />
  );
};
/* End ---- */
