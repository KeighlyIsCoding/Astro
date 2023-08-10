/* ---- Imports Section */
import React from 'react';
import { object, array, bool, string } from 'prop-types';
// eslint-disable-next-line no-unused-vars
const astrology = require('./lib/astrochart.min.js');
import {
  // DisplayChart,
  DisplayStellia,
  DisplayChartRuler,
  DisplayDateTimeLocation,
  DisplayMethods,
} from './displayData';
import './main.css';
import { Signs } from './signs';
/* End ---- */

const GetPlacementData = ({ planets, houses, type }) => {
  console.log("hello from getplacementdata: ", planets)
  if (!planets) return null
  const planetPos = {
    "Sun": [planets[0].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Moon": [planets[1].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Mercury": [planets[2].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Venus": [planets[3].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Mars": [planets[4].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Jupiter": [planets[5].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Saturn": [planets[6].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Uranus": [planets[7].ChartPosition.Ecliptic.ArcDegrees.degrees],
    "Neptune": [planets[8].ChartPosition.Ecliptic.ArcDegrees.degrees, -5],
    "Pluto": [planets[9].ChartPosition.Ecliptic.ArcDegrees.degrees, -0.1],
  };
  const cusps = [
    houses[0].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[1].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[2].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[3].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[4].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[5].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[6].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[7].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[8].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[9].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[10].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
    houses[11].ChartPosition.StartPosition.Ecliptic.ArcDegrees.degrees,
  ];

  if (type == 'moment') {
    const momentChartData = {
      'planets': planetPos,
      'cusps': cusps
    };
    const momentChart = new window.astrology.Chart('momentChart', 700, 700).radix(momentChartData);
    momentChart.addPointsOfInterest({
      "As": [momentChartData.cusps[0]],
      "Ic": [momentChartData.cusps[3]],
      "Ds": [momentChartData.cusps[6]],
      "Mc": [momentChartData.cusps[9]]
    });
    momentChart.aspects();
  }
  return (null);
}

/* ---- Get Data for Display Components Section */
const CalculateStellia = ({ placementArr, placementSet }) => {
  const stellia = [];
  placementSet.forEach(signHouse => {
    let occurrences = placementArr.reduce(function (n, p) {
      return n + (p === signHouse);
    }, 0);
    if (occurrences >= 3) {
      stellia.push(
        { label: signHouse, occurrences: occurrences },
      );
    }
  });

  /* <-- Return UI --> */
  return (
    <DisplayStellia stellia={stellia} />
  );
}
const GetSignHouseSets = ({ planets, unknown }) => {
  /* <-- Variable Declarations --> */
  const placementArr = [];
  const placementSet = new Set();

  /* Add signs & houses w/ planets in them to arrays / sets */
  planets.forEach(planet => {
    /* <-- Variable Declarations --> */
    const sign = planet.Sign.label;
    const house = planet.House.label + ' House';

    /* Avoid adding data from non-planets to the arrays / sets */
    if (planet.label !== 'Chiron' && planet.label !== 'Sirius') {
      placementArr.push(sign);
      placementSet.add(sign);
      if (!unknown || unknown == null) {
        placementArr.push(house);
        placementSet.add(house);
      }
    }
  });

  /* <-- Return Component Call --> */
  return (
    <CalculateStellia placementArr={placementArr} placementSet={placementSet} />
  );
}
const GetDateTimeLocationMethods = ({ origin, zodiac, houseSystem, unknown }) => {
  return (
    <>
      <DisplayDateTimeLocation
        year={origin.year} month={origin.month} day={origin.date}
        hour={origin.hour} minute={origin.minute}
        latitude={origin.latitude} longitude={origin.longitude}
        unknown={unknown}
      />
      <DisplayMethods
        zodiac={zodiac}
        houseSystem={houseSystem}
      />
      {(unknown && unknown != null) ? (
        <>
          <p className='unknown'>* Houses cannot be calculated due to unknown birth time</p>
          <p className='unknown'>* Degrees & Minutes / Seconds are approx. due to unknown birth time</p>
        </>
      ) : (
        null
      )}
    </>
  );
}
const GetChartRuler = ({ acHouse, planets }) => {
  const acSign = Signs.find(sign => sign.name == acHouse.Sign.label);
  let chartTraditionalRuler = acSign.traditionalRuler;
  chartTraditionalRuler = planets.find(planet => planet.label == chartTraditionalRuler);
  let chartModernRuler = acSign.modernRuler;

  chartModernRuler !== '' ? (chartModernRuler = planets.find(planet => planet.label == chartModernRuler))
    : (chartModernRuler = chartTraditionalRuler);

  return (
    <>
      <DisplayChartRuler
        acSign={acSign}
        chartTraditionalRuler={chartTraditionalRuler}
        chartModernRuler={chartModernRuler}
      />
    </>
  );
}
/* End ---- */

/* ---- Exports Section */
export {
  GetPlacementData,
  CalculateStellia,
  GetSignHouseSets,
  GetDateTimeLocationMethods,
  GetChartRuler,
}
/* End ---- */

/* <- PropTypes -> */
GetPlacementData.propTypes = {
  planets: array,
  houses: array,
  type: string,
}
GetSignHouseSets.propTypes = {
  planets: array,
  unknown: bool,
}
CalculateStellia.propTypes = {
  placementArr: array,
  placementSet: object,
}
GetChartRuler.propTypes = {
  acHouse: object,
  planets: array,
}
GetDateTimeLocationMethods.propTypes = {
  origin: object,
  zodiac: string,
  houseSystem: string,
  unknown: bool,
}