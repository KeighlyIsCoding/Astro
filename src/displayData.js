/* ---- Imports Section */
import React from 'react';
import { object, array, bool, string, number } from 'prop-types';
// eslint-disable-next-line no-unused-vars
// const astrology = require('./lib/astrochart.min.js');
// import { Signs } from './signs';
/* End ---- */

// const DisplayChart = ({ planetPos, cusps, type }) => {

//   if (type == 'moment') {
//     const momentChartData = {
//       'planets': planetPos,
//       'cusps': cusps
//     };
//     const momentChart = new window.astrology.Chart('momentChart', 600, 600).radix(momentChartData);
//     momentChart.addPointsOfInterest({
//       "As": [momentChartData.cusps[0]],
//       "Ic": [momentChartData.cusps[3]],
//       "Ds": [momentChartData.cusps[6]],
//       "Mc": [momentChartData.cusps[9]]
//     });
//     momentChart.aspects();
//   }
//   return (null);
// }

/* ---- Display Components */
const DisplayMethods = ({ zodiac, houseSystem }) => {
  const method = zodiac.charAt(0).toUpperCase() + zodiac.slice(1);
  const system = houseSystem.charAt(0).toUpperCase() + houseSystem.slice(1);
  return (
    <p>Methods: {method} & {system}</p>
  );
}
const DisplayDateTimeLocation = ({ year, month, day, hour, minute, latitude, longitude, unknown }) => {
  const dd = (day < 10) ? `0${day}` : `${day}`;
  const mm = ((month + 1) < 10) ? `0${month + 1}` : `${month + 1}`;
  const date = `${dd}-${mm}-${year}`;
  const EW = (longitude >= 0) ? `E` : `W`;
  const NS = (latitude >= 0) ? `N` : `S`;

  /* Avoid display & calculations related to birth time if it's unknown */
  if (!unknown || unknown == null) {
    let time = (hour < 10) ? `0${hour}:${minute}` : `${hour}:${minute}`;
    time = (hour < 12) ? time += `AM` : time += `PM`;
    return (<p>{date}, {time} at {Math.abs(latitude)}&deg; {NS}, {Math.abs(longitude)}&deg; {EW}</p>);
  } else {
    return (<p>{date} at {Math.abs(latitude)}&deg; {NS}, {Math.abs(longitude)}&deg; {EW}</p>);
  }
}

const DisplayPlanetData = ({ planet, unknown }) => {
  /* Skip over non-planets that appear in the array */
  /* Avoid display of houses when birth time is unknown */
  if (planet.label !== 'Chiron' && planet.label !== 'Sirius') {
    return (
      <>
        {planet.isRetrograde ? (
          <>
            <p>{planet.label} Rx</p>
          </>
        ) : (
          <>
            <p className='planet'>{planet.label}</p>
          </>
        )}
        <p className='sign'>{planet.Sign.label}</p>
        <DisplayDegreesMinutes
          planet={planet.label}
          degreesFormatted={planet.ChartPosition.Ecliptic.ArcDegreesFormatted30}
          retrograde={planet.isRetrograde}
        />

        {(!unknown || unknown == null) ? (
          <p className='house'>{planet.House.id}</p>
        ) : (
          <p className='house'>-</p>
        )}
      </>
    );
  } else {
    return (null);
  }
}
const DisplayDegreesMinutes = ({ degreesFormatted, retrograde }) => {
  const deg = degreesFormatted.slice(0, 4).trim();
  const minSec = degreesFormatted.slice(deg.length + 1, degreesFormatted.length).trim();
  return (
    <>
      {(retrograde) ? (
        <p className='degrees'>{deg} {minSec} Rx</p>
      ) : (
        <p className='degrees'>{deg} {minSec}</p>
      )}
    </>
  );
}
const DisplayHouseData = ({ house }) => {
  return (
    <>
      <p className='house'>{house.label} House</p>
      <p className='sign'>{house.Sign.label}</p>
    </>
  );
}
const DisplayChartRuler = ({ acSign, chartTraditionalRuler, chartModernRuler }) => {

  const sign = acSign.name;
  const traditionalRulerName = chartTraditionalRuler.label;
  const modernRulerName = chartModernRuler.label;

  return (
    <>
      {(modernRulerName !== traditionalRulerName) ? (
        <>
          <p className='sign'>{modernRulerName} in {sign}</p>
          <p className='sign'>{traditionalRulerName} in {sign}</p>
        </>
      ) : (
        <>
          <p className='sign'>{traditionalRulerName} in {sign}</p>
        </>
      )}
    </>
  );
}
const DisplayStellia = ({ stellia }) => {
  /* <-- Return UI --> */
  /* Avoid displaying empty stellia grids */
  return (
    <>
      {stellia.length != 0 ? (
        <>
          {stellia.map((stellium) => (
            <React.Fragment key={stellium.label}>
              <p className='label'>{stellium.label} {stellium.id}</p>
              <p className='occurrences'>{stellium.occurrences}</p>
            </React.Fragment>
          ))}
        </>
      ) : (
        <p className='no-stellia'>No stellia found within this chart</p>
      )}
    </>
  );
}
const DisplayRetrogrades = ({ planet }) => {
  /* Avoid displaying planets that don't retrograde & non-planet celestial bodies */
  return (
    <>
      {(planet.label !== 'Sun' && planet.label !== 'Moon' && planet.label !== 'Chiron' && planet.label !== 'Sirius') ? (
        <>
          {planet.isRetrograde ? (
            <>
              <p>{planet.label} Rx</p>
              <p>{planet.Sign.label}</p>
              <p className='house'>{planet.House.id}</p>
            </>
          ) : (null)}
        </>
      ) : (null)}
    </>
  );
}
/* End ---- */

/* ---- Exports Section */
export {
  // DisplayChart,
  DisplayMethods,
  DisplayDateTimeLocation,
  DisplayPlanetData,
  DisplayHouseData,
  DisplayChartRuler,
  DisplayStellia,
  DisplayRetrogrades,
}
/* End ---- */

/* <- PropTypes -> */
// DisplayChart.propTypes = {
//   planetPos: object,
//   cusps: array,
//   type: string,
// }
DisplayMethods.propTypes = {
  zodiac: string,
  houseSystem: string,
}
DisplayDateTimeLocation.propTypes = {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  latitude: number,
  longitude: number,
  unknown: bool,
}
DisplayPlanetData.propTypes = {
  planet: object,
  unknown: bool,
}
DisplayHouseData.propTypes = {
  house: object,
}
DisplayChartRuler.propTypes = {
  acSign: object,
  chartTraditionalRuler: object,
  chartModernRuler: object,
}
DisplayDegreesMinutes.propTypes = {
  degreesFormatted: string,
  retrograde: bool,
}
DisplayStellia.propTypes = {
  stellia: array,
}
DisplayRetrogrades.propTypes = {
  planet: object,
}