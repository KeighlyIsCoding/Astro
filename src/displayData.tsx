/* ---- Imports Section */
import { Fragment } from 'react';
import { canRetrograde, isPlanet } from './astro';
import type { Sign } from './signs';
import type { CelestialBody, House, HouseSystem, Zodiac } from './types';
/* End ---- */

/* ---- Types */
export interface Stellium {
  label: string;
  occurrences: number;
}
/* End ---- */

/* ---- Helpers */
const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
const padTwo = (value: number): string => String(value).padStart(2, '0');
/* End ---- */

/* ---- Display Components */
interface DisplayMethodsProps {
  zodiac: Zodiac;
  houseSystem: HouseSystem;
}
export const DisplayMethods = ({ zodiac, houseSystem }: DisplayMethodsProps) => (
  <p>Methods: {capitalize(zodiac)} & {capitalize(houseSystem)}</p>
);

interface DisplayDateTimeLocationProps {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  unknown?: boolean;
}
export const DisplayDateTimeLocation = ({
  year,
  month,
  day,
  hour,
  minute,
  latitude,
  longitude,
  unknown = false,
}: DisplayDateTimeLocationProps) => {
  const date = `${padTwo(day)}-${padTwo(month + 1)}-${year}`;
  const EW = longitude >= 0 ? 'E' : 'W';
  const NS = latitude >= 0 ? 'N' : 'S';
  const location = <>{Math.abs(latitude)}&deg; {NS}, {Math.abs(longitude)}&deg; {EW}</>;

  /* Avoid display & calculations related to birth time if it's unknown */
  if (unknown) {
    return <p>{date} at {location}</p>;
  }
  const time = `${padTwo(hour)}:${minute}${hour < 12 ? 'AM' : 'PM'}`;
  return <p>{date}, {time} at {location}</p>;
};

interface DisplayDegreesMinutesProps {
  degreesFormatted: string;
  retrograde: boolean;
}
const DisplayDegreesMinutes = ({ degreesFormatted, retrograde }: DisplayDegreesMinutesProps) => {
  /* e.g. "14° 35' 1''" -> "14°" & "35' 1''" */
  const [deg = '', ...minSec] = degreesFormatted.trim().split(/\s+/);
  return (
    <p className='degrees'>{deg} {minSec.join(' ')}{retrograde ? ' Rx' : ''}</p>
  );
};

interface DisplayPlanetDataProps {
  planet: CelestialBody;
  unknown?: boolean;
}
export const DisplayPlanetData = ({ planet, unknown = false }: DisplayPlanetDataProps) => {
  /* Skip over non-planets that appear in the array */
  if (!isPlanet(planet)) return null;

  const retrograde = planet.isRetrograde ?? false;
  return (
    <>
      {retrograde ? (
        <p>{planet.label} Rx</p>
      ) : (
        <p className='planet'>{planet.label}</p>
      )}
      <p className='sign'>{planet.Sign.label}</p>
      <DisplayDegreesMinutes
        degreesFormatted={planet.ChartPosition.Ecliptic.ArcDegreesFormatted30}
        retrograde={retrograde}
      />
      {/* Avoid display of houses when birth time is unknown */}
      <p className='house'>{unknown ? '-' : planet.House.id}</p>
    </>
  );
};

interface DisplayHouseDataProps {
  house: House;
}
export const DisplayHouseData = ({ house }: DisplayHouseDataProps) => (
  <>
    <p className='house'>{house.label} House</p>
    <p className='sign'>{house.Sign.label}</p>
  </>
);

interface DisplayChartRulerProps {
  acSign: Sign;
  chartTraditionalRuler: CelestialBody;
  chartModernRuler: CelestialBody;
}
export const DisplayChartRuler = ({ acSign, chartTraditionalRuler, chartModernRuler }: DisplayChartRulerProps) => {
  const sign = acSign.name;
  const traditionalRulerName = chartTraditionalRuler.label;
  const modernRulerName = chartModernRuler.label;

  return (
    <>
      {modernRulerName !== traditionalRulerName && (
        <p className='sign'>{modernRulerName} in {sign}</p>
      )}
      <p className='sign'>{traditionalRulerName} in {sign}</p>
    </>
  );
};

interface DisplayStelliaProps {
  stellia: readonly Stellium[];
}
export const DisplayStellia = ({ stellia }: DisplayStelliaProps) => {
  /* Avoid displaying empty stellia grids */
  if (stellia.length === 0) {
    return <p className='no-stellia'>No stellia found within this chart</p>;
  }
  return (
    <>
      {stellia.map((stellium) => (
        <Fragment key={stellium.label}>
          <p className='label'>{stellium.label}</p>
          <p className='occurrences'>{stellium.occurrences}</p>
        </Fragment>
      ))}
    </>
  );
};

interface DisplayRetrogradesProps {
  planet: CelestialBody;
}
export const DisplayRetrogrades = ({ planet }: DisplayRetrogradesProps) => {
  /* Avoid displaying planets that don't retrograde & non-planet celestial bodies */
  if (!canRetrograde(planet) || !planet.isRetrograde) return null;
  return (
    <>
      <p>{planet.label} Rx</p>
      <p>{planet.Sign.label}</p>
      <p className='house'>{planet.House.id}</p>
    </>
  );
};
/* End ---- */
