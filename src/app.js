/* ---- Imports Section */
import React, { useState, useEffect } from 'react';
import { object, array, bool } from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Signs } from './signs.js';
import { createInstances } from './astro.js';
import { Nav } from './nav.js';
import {
  MOMENTDATA,
  BIRTHDATA,
  MONTHS,
  DAYS,
  HOURS,
  MINUTES,
  ZODIACS,
  HOUSESYSTEMS,
} from './defaultData.js';
import {
  GetPlacementData,
  GetChartRuler,
  GetDateTimeLocationMethods,
  GetSignHouseSets,
} from './getData.js';
import {
  DisplayPlanetData,
  DisplayHouseData,
  DisplayRetrogrades,
} from './displayData';
import './main.css';
/* End ---- */

/* ---- Birth Chart Display ----
  <-- Props
    horoscope
      - Instance of the Horoscope object
      - Contains all info needed to display the Moment Chart to the user
    unknown
      - true  - birth time is not given
      - false - birth time is given
  ----
  Receives horoscope from CreateHoroscope
  Calls components to display the data w/in horoscope to the user
  ----
  Component Calls
    GetDateTimeLocationMethods  -> DisplayDateTimeLocation
                                -> DisplayMethods
    DisplayPlanetData -> DisplayDegreesMinutes
    (if !unknown) DisplayHouseData
    GetSignHouseSets  -> CalculateStellia -> DisplayStellia
*/
const BirthChart = ({ horoscope, unknown }) => {
  /* <-- Initial Logs --> */
  console.log(`%cBirth Chart`, 'border: 1px solid white; padding: 10px ;');
  console.log(horoscope);

  /* <-- Date Logs --> */
  const origin = horoscope.origin;

  /* <-- Planet, Sign, House Logs --> */
  const planets = horoscope._celestialBodies.all;
  const houses = horoscope._houses;
  const acHouse = houses[0];
  // const icHouse = houses[0];
  // const dcHouse = houses[0];
  // const mcHouse = houses[0];
  console.log(`%cHouses`, 'border: 1px solid white; padding: 10px ;');
  console.log(houses);

  return (
    <>
      <article className='birth'>
        <h2>Birth Chart</h2>
        <div>
          <GetDateTimeLocationMethods
            origin={origin}
            zodiac={horoscope._zodiac}
            houseSystem={horoscope._houseSystem}
            unknown={unknown}
          />
        </div>
        <div className='chart'>
          {planets.map((planet) => (
            <React.Fragment key={planet.label}>
              <DisplayPlanetData
                planet={planet}
                unknown={unknown}
              />
            </React.Fragment>
          ))}
        </div>
        {!unknown ? (
          <>
            <h3>House Placements</h3>
            <div className='houses'>
              {houses.map((house) => (
                <React.Fragment key={house.label}>
                  <DisplayHouseData house={house} />
                </React.Fragment>
              ))
              }
            </div>
            <h3>Chart Ruler</h3>
            <div className='stellia'>
              <>
                <GetChartRuler acHouse={acHouse} planets={planets} />
              </>
            </div>
          </>
        ) : (null)}
        <h3>Stellia</h3>
        <div className='stellia'>
          <GetSignHouseSets planets={planets} unknown={unknown} />
        </div>
        <h3>Retrogrades</h3>
        <div className='retrogrades'>
          {planets.map((planet) => (
            <React.Fragment key={planet.label + ' Rx'}>
              <DisplayRetrogrades planet={planet} />
            </React.Fragment>
          ))}
        </div>
      </article>
    </>
  );
}

/* ---- Moment Chart Display ----
  <-- Props
    horoscope
      - Instance of the Horoscope object
      - Contains all info needed to display the Moment Chart to the user
  ----
  Receives horoscope from CreateHoroscope
  Calls components to display the data w/in horoscope to the user
  ----
  Component Calls
    GetDateTimeLocationMethods  -> DisplayDateTimeLocation
                                -> DisplayMethods
    DisplayPlanetData -> DisplayDegreesMinutes
    DisplayHouseData
    GetSignHouseSets  -> CalculateStellia -> DisplayStellia
*/
const ChartOfTheMoment = ({ horoscope }) => {
  /* <-- Initial Logs --> */
  console.log(`%cMoment Chart`, 'border: 1px solid white; padding: 10px ;');
  console.log(horoscope);

  /* <-- Variable Declarations --> */
  const origin = horoscope.origin;
  const planets = horoscope._celestialBodies.all;
  const houses = horoscope._houses;
  console.log(`%cHouses`, 'border: 1px solid white; padding: 10px ;');
  console.log(houses);

  useEffect(() => { GetPlacementData(props.horoscope._celestialBodies?.all, horoscope?._houses, 'moment') },
    [horoscope?._celestialBodies?.all, horoscope?._houses])

  /* <-- Return UI --> */
  return (
    <>
      <article className='moment'>
        <h2>Chart of The Moment</h2>
        <div>
          <GetDateTimeLocationMethods
            origin={origin}
            zodiac={horoscope._zodiac}
            houseSystem={horoscope._houseSystem}
          />
        </div>
        <div id='momentChart'></div>

        <div className='chart'>
          {planets.map((planet) => (
            <React.Fragment key={planet.label}>
              <DisplayPlanetData
                planet={planet}
              />
            </React.Fragment>
          ))}
        </div>
        <h3>Current Houses</h3>
        <div className='houses'>
          {houses.map((house) => (
            <React.Fragment key={house.label}>
              <DisplayHouseData house={house} />
            </React.Fragment>
          ))}
        </div>
        <h3>Current Stellia</h3>
        <div className='stellia'>
          <GetSignHouseSets planets={planets} />
        </div>
        <h3>Current Retrogrades</h3>
        <div className='retrogrades'>
          {planets.map((planet) => (
            <React.Fragment key={planet.label + ' Rx'}>
              <DisplayRetrogrades planet={planet} />
            </React.Fragment>
          ))}
        </div>
      </article>
    </>
  );
}

/* ---- Chart Creation ----
  <-- Props
    chartData
      - MOMENTDATA or BIRTHDATA object
  ----
  Receives chartData from AstroChart
  Creates a new instance of the Horoscope object
  Calls ChartOfTheMoment or BirthChart
*/
const CreateHoroscope = ({ chartData }) => {
  /* <-- Horoscope --> */
  const horoscope = createInstances(
    chartData.year,
    chartData.month,
    chartData.day,
    chartData.hour,
    chartData.minute,
    chartData.latitude,
    chartData.longitude,
    chartData.zodiac,
    chartData.houseSystem
  );
  /* <-- Return UI --> */
  if (chartData.type === 'birth') {
    console.log(`%cBirth Chart`, 'border: 1px solid red; padding: 10px ;');
    console.log(horoscope._celestialBodies.all);
  } else if (chartData.type === 'moment') {
    console.log(`%cMoment Chart`, 'border: 1px solid green; padding: 10px ;');
    console.log(horoscope._celestialBodies.all);
  }
  return (
    <>
      {chartData.type === 'moment' ? (
        <ChartOfTheMoment horoscope={horoscope} />
      ) : (
        <BirthChart
          horoscope={horoscope}
          unknown={chartData.unknown}
        />
      )}
    </>
  );
}

/* ---- Display Zodiac Methods & House Systems ----
  <-- Props
    chartData
      - BIRTHDATA object
    zodiacs, houseSystems
      - Uses the data in their corresponding objects to populate the forms' select list dropdowns
  ----
  <-- Hooks (useState)
    systemValues
      - Holds default data shown on the charts' page load
      - Watches for changes
      - Updates MOMENTDATA & chartData on change
  ----
  <-- Functions
    handleChange
      - Updates systemValues, MOMENTDATA, & birthData on every change
  ----
  Displays select lists for zodiac methods & house systems
  Calls CreateHoroscope (Birth Chart)
  Calls CreateHoroscope (Moment Chart)
  Re-loads on every change to the select lists to update the chart to display the desired calculations
*/
const DisplayMethodsSelect = ({ chartData, zodiacs, houseSystems }) => {
  /* ---- Hooks ---- */
  /* <- State -> */
  const [systemValues, setValues] = useState({
    zodiac: 'sidereal',
    houseSystem: 'placidus',
  });

  /* <- Handle Input Changes & Form Submission -> */
  const handleChange = (e) => {
    setValues({ ...systemValues, [e.target.name]: e.target.value });
    MOMENTDATA[e.target.name] = e.target.value;
    chartData[e.target.name] = e.target.value;
  }

  return (
    <>
      <article>
        <div className="system">
          <label htmlFor='zodiac' className='system'>Zodiac:</label>
          <select id='zodiac' className='system' name='zodiac' value={systemValues.zodiacType} onChange={handleChange}>
            {zodiacs.map((zodiac) => <option key={zodiac.value} value={zodiac.value}>{zodiac.label}</option>)}
          </select>
          <label htmlFor='houseSystem' className='system'>System:</label>
          <select id='houseSystem' className='system' name='houseSystem' value={systemValues.zodiacType} onChange={handleChange}>
            {houseSystems.map((system) => <option key={system.value} value={system.value}>{system.label}</option>)}
          </select>
        </div>
      </article>
      <CreateHoroscope chartData={chartData} />
      <CreateHoroscope chartData={MOMENTDATA} />
    </>
  );
}

/* ---- Form Display ----
  <-- Props
    birthData
      - Updates key:value pairs in the BIRTHDATA object
    months, days, hours, minutes
      - Uses the data in their corresponding objects to populate the forms' select list dropdowns
  ----
  <-- Hooks (useState, useEffect)
    formValues
      - Holds default data shown on the forms' page load
      - useEffect
          - populates birthData w/ defaults on page load
          - watches for changes
          - updates birthData when any changes are made
    unknown
      - Tracks state of the unknown birth time checkbox
      - useEffect
          - watches for changes
          - updates birthData & formValues when toggled
              - true  - birthData: unknown=true, hour/minute=0
                      - formValues: hour/minute=0
              - false - birthData: unknown=false
    useLocation
      - Tracks whether the useLocation feature is true or false
      - useEffect
          - watches for changes
          - updates MOMENTDATA & formValues when toggled
              - true  - uses navigator to get the currentPositions' lat/lon coords & rounds them to .00
                      - MOMENTDATA & formValues: latitude/longitude = lat/lon
              - false - MOMENTDATA & formValues: latitude/longitude = 0.00/0.00
    submit
      - Tracks when user submits the form
      - Calls DisplayMethodsSelect component
  ----
  <-- Functions
    handleChange
      - Updates formValues & birthData on every change
      - Updates MOMENTDATA on changes to zodiac & houseSystem
  ----
  Calls CreateHoroscope (Moment Chart)
  Uses objects to fill out select list dropdowns
  Collects user inputs
  Updates values in objects when appropriate, depending on the inputs/changes that were made
  Calls DisplayMethodsSelect when submitted
*/
const AstroForm = ({ birthData, months, days, hours, minutes }) => {
  /* ---- Hooks ---- */
  /* <- State -> */
  const [formValues, setValues] = useState({
    year: 1998,
    month: 2,
    day: 29,
    hour: 9,
    minute: 10,
    latitude: 0,
    longitude: 0,
  });
  const [unknown, setUnknown] = useState(false);
  const [useLocation, setLocation] = useState(false);
  const [submit, setSubmit] = useState(false);

  /* <- Effect -> */
  // formValues
  useEffect(() => {
    for (let property in formValues) {
      if (Object.prototype.hasOwnProperty.call(formValues, property)) {
        birthData[property] = formValues[property];
      }
    }
  }, [formValues]);

  // unknown
  useEffect(() => {
    if (unknown) {
      // Update birthData
      birthData.unknown = true;
      birthData.hour = 0;
      birthData.minute = 0;
      // Update form
      setValues({
        ...formValues,
        hour: 0,
        minute: 0
      });
    } else {
      birthData.unknown = false;
    }
  }, [unknown]);

  // useLocation
  useEffect(() => {
    if (useLocation) {
      /* <- Use Location -> */
      // Success
      const successFunction = async (position) => {
        // Process Data
        const lat = Math.round((position.coords.latitude + Number.EPSILON) * 100) / 100
        const lon = Math.round((position.coords.longitude + Number.EPSILON) * 100) / 100
        // momentChart
        MOMENTDATA.latitude = lat;
        MOMENTDATA.longitude = lon;
        // birthChart
        setValues({
          ...formValues,
          latitude: lat,
          longitude: lon,
        });
      }
      // Error
      const errorFunction = () => {
        alert('Error in retrieving current location.');
      }
      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
      } else {
        alert('It seems like Geolocation, which is required for this function, is not enabled in your browser.');
      }
    } else {
      /* <- Undo Use Location -> */
      // momentChart
      MOMENTDATA.latitude = 0;
      MOMENTDATA.longitude = 0;
      // birthChart
      setValues({
        ...formValues,
        latitude: 0.00,
        longitude: 0.00
      });
    }
  }, [useLocation]);


  /* <- Handle Input Changes & Form Submission -> */
  const handleChange = (e) => {
    setValues({ ...formValues, [e.target.name]: e.target.value });
  }

  /* <-- Return UI --> */
  return (
    <>
      {!submit ? (
        <>
          <article>
            <h2>Enter Birth Info</h2>
            <form action='' id='birth-data'>
              <div className="date">
                <label htmlFor='year' className='date'>Year:</label>
                <input type='number' id='year' className='date' name='year' value={formValues.year} onChange={handleChange} />
                <label htmlFor='month' className='date'>Month:</label>
                <select id='month' className='date' name='month' value={formValues.month} onChange={handleChange}>
                  {months.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
                </select>
                <label htmlFor='day' className='date'>Day:</label>
                <select id='day' className='date' name='day' value={formValues.day} onChange={handleChange}>
                  {days.map((day) => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div className="time">
                <label htmlFor='hour' className='time'>Hour:</label>
                <select id='hour' className='time' name='hour' value={formValues.hour} onChange={handleChange} disabled={unknown}>
                  {hours.map((hour) => <option key={hour.value} value={hour.value}>{hour.label}</option>)}
                </select>
                <label htmlFor='minute' className='time'>Minute:</label>
                <select id='minute' className='time' name='minute' value={formValues.minute} onChange={handleChange} disabled={unknown}>
                  {minutes.map((min) => <option key={min} value={min}>{min}</option>)}
                </select>
                <label htmlFor='unknown' className='unknown'>Unknown:</label>
                <input type='checkbox' id='unknown' className='unknown' name='unknown' value={unknown} onChange={() => setUnknown(unknown => !unknown)}></input>
              </div>

              <div className="location">
                <label htmlFor='latitude' className='location'>Latitude:</label>
                <input type='number' id='latitude' className='location' name='latitude' min='-90.00' max='90.00' value={formValues.latitude} onChange={handleChange} />
                <label htmlFor='longitude' className='location'>Longitude:</label>
                <input type='number' id='longitude' className='location' name='longitude' min='-90.00' max='90.00' value={formValues.longitude} onChange={handleChange} />
                <button type='button' id='useLocation' className='location' name='useLocation' onClick={() => setLocation(useLocation => !useLocation)}>Use my Location</button>
              </div>
              <button type='button' id='submit' name='submit' onClick={() => setSubmit(true)}>Calculate Chart</button>
            </form>
          </article>
          <CreateHoroscope chartData={MOMENTDATA} />
        </>
      ) : (
        <DisplayMethodsSelect chartData={birthData} zodiacs={ZODIACS} houseSystems={HOUSESYSTEMS} />
      )}
    </>
  );
}

/* <- App() -> */
function App() {
  return (
    <>
      <Nav />
      <AstroForm
        birthData={BIRTHDATA}
        months={MONTHS}
        days={DAYS}
        hours={HOURS}
        minutes={MINUTES}
        zodiacs={ZODIACS}
        houseSystems={HOUSESYSTEMS}
      />
    </>
  );
}
export default App;

/* <- PropTypes -> */
DisplayMethodsSelect.propTypes = {
  chartData: object,
  zodiacs: array,
  houseSystems: array,
}
AstroForm.propTypes = {
  birthData: object,
  months: array,
  days: array,
  hours: array,
  minutes: array,
}
CreateHoroscope.propTypes = {
  chartData: object,
}
ChartOfTheMoment.propTypes = {
  horoscope: object
}
BirthChart.propTypes = {
  horoscope: object,
  unknown: bool,
}