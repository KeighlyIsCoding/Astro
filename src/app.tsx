/* ---- Imports Section */
import { useMemo, useState, type ChangeEvent } from 'react';
import { createInstances } from './astro';
import { Nav } from './nav';
import {
  BIRTHDATA,
  DAYS,
  DEFAULT_HOUSE_SYSTEM,
  DEFAULT_MOMENT_LOCATION,
  DEFAULT_ZODIAC,
  HOURS,
  HOUSESYSTEMS,
  MINUTES,
  MONTHS,
  ZODIACS,
  createMomentData,
} from './defaultData';
import {
  GetChartRuler,
  GetDateTimeLocationMethods,
  GetSignHouseSets,
  RadixChart,
} from './getData';
import {
  DisplayPlanetData,
  DisplayHouseData,
  DisplayRetrogrades,
} from './displayData';
import type {
  ChartData,
  HoroscopeData,
  HouseSystem,
  SelectOption,
  Zodiac,
} from './types';
import './main.css';
/* End ---- */

/* ---- Types */
interface Coordinates {
  latitude: number;
  longitude: number;
}

type LocationStatus = 'off' | 'locating' | 'on';

interface SystemValues {
  zodiac: Zodiac;
  houseSystem: HouseSystem;
}

/* Form inputs hold strings while the user is typing; they're converted to numbers on submit */
const FORM_FIELDS = [
  'year', 'month', 'day', 'hour', 'minute', 'latitude', 'longitude',
] as const;
type FormField = (typeof FORM_FIELDS)[number];
type FormValues = Record<FormField, string>;

const isFormField = (name: string): name is FormField => (FORM_FIELDS as readonly string[]).includes(name);
/* End ---- */

/* ---- Helpers */
const logHeading = (label: string, color = 'white') => {
  console.log(`%c${label}`, `border: 1px solid ${color}; padding: 10px ;`);
};

/* Stop waiting on the browser / OS location service after this long */
const LOCATION_TIMEOUT_MS = 10_000;

const LOCATION_ERRORS: Record<number, string> = {
  1: 'Location access was denied. Allow location access for this site in your browser settings, then try again.',
  2: 'Your location is currently unavailable. Check that location services are turned on for your device.',
  3: 'Retrieving your location timed out. Please try again.',
};

/* Rounds coords to .00 */
const roundCoord = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

/* Finds the option matching a select's string value, keeping the option's literal type */
const findOption = <T extends string>(options: readonly SelectOption<T>[], value: string): T | undefined =>
  options.find((option) => option.value === value)?.value;

const toFormValues = (data: ChartData): FormValues => ({
  year: String(data.year),
  month: String(data.month),
  day: String(data.day),
  hour: String(data.hour),
  minute: String(data.minute),
  latitude: String(data.latitude),
  longitude: String(data.longitude),
});

const toChartData = (values: FormValues, unknown: boolean): ChartData => ({
  ...BIRTHDATA,
  year: Number(values.year),
  month: Number(values.month),
  day: Number(values.day),
  hour: unknown ? 0 : Number(values.hour),
  minute: unknown ? 0 : Number(values.minute),
  latitude: Number(values.latitude),
  longitude: Number(values.longitude),
  unknown,
});
/* End ---- */

/* ---- Birth Chart Display ----
  <-- Props
    horoscope
      - Typed Horoscope data (see createInstances)
      - Contains all info needed to display the Birth Chart to the user
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
interface BirthChartProps {
  horoscope: HoroscopeData;
  unknown: boolean;
}
const BirthChart = ({ horoscope, unknown }: BirthChartProps) => {
  /* <-- Initial Logs --> */
  logHeading('Birth Chart');
  console.log(horoscope.raw);

  /* <-- Planet, Sign, House Logs --> */
  const { origin, planets, houses } = horoscope;
  const acHouse = houses[0];
  logHeading('Houses');
  console.log(houses);

  return (
    <article className='birth'>
      <h2>Birth Chart</h2>
      <div>
        <GetDateTimeLocationMethods
          origin={origin}
          zodiac={horoscope.zodiac}
          houseSystem={horoscope.houseSystem}
          unknown={unknown}
        />
      </div>
      <div className='chart'>
        {planets.map((planet) => (
          <DisplayPlanetData key={planet.label} planet={planet} unknown={unknown} />
        ))}
      </div>
      {!unknown && (
        <>
          <h3>House Placements</h3>
          <div className='houses'>
            {houses.map((house) => (
              <DisplayHouseData key={house.label} house={house} />
            ))}
          </div>
          <h3>Chart Ruler</h3>
          <div className='stellia'>
            {acHouse && <GetChartRuler acHouse={acHouse} planets={planets} />}
          </div>
        </>
      )}
      <h3>Stellia</h3>
      <div className='stellia'>
        <GetSignHouseSets planets={planets} unknown={unknown} />
      </div>
      <h3>Retrogrades</h3>
      <div className='retrogrades'>
        {planets.map((planet) => (
          <DisplayRetrogrades key={`${planet.label} Rx`} planet={planet} />
        ))}
      </div>
    </article>
  );
};

/* ---- Moment Chart Display ----
  <-- Props
    horoscope
      - Typed Horoscope data (see createInstances)
      - Contains all info needed to display the Moment Chart to the user
  ----
  Receives horoscope from CreateHoroscope
  Calls components to display the data w/in horoscope to the user
  ----
  Component Calls
    GetDateTimeLocationMethods  -> DisplayDateTimeLocation
                                -> DisplayMethods
    RadixChart
    DisplayPlanetData -> DisplayDegreesMinutes
    DisplayHouseData
    GetSignHouseSets  -> CalculateStellia -> DisplayStellia
*/
interface ChartOfTheMomentProps {
  horoscope: HoroscopeData;
}
const ChartOfTheMoment = ({ horoscope }: ChartOfTheMomentProps) => {
  /* <-- Initial Logs --> */
  logHeading('Moment Chart');
  console.log(horoscope.raw);

  /* <-- Variable Declarations --> */
  const { origin, planets, houses } = horoscope;
  logHeading('Houses');
  console.log(houses);

  /* <-- Return UI --> */
  return (
    <article className='moment'>
      <h2>Chart of The Moment</h2>
      <div>
        <GetDateTimeLocationMethods
          origin={origin}
          zodiac={horoscope.zodiac}
          houseSystem={horoscope.houseSystem}
        />
      </div>
      <RadixChart planets={planets} houses={houses} />

      <div className='chart'>
        {planets.map((planet) => (
          <DisplayPlanetData key={planet.label} planet={planet} />
        ))}
      </div>
      <h3>Current Houses</h3>
      <div className='houses'>
        {houses.map((house) => (
          <DisplayHouseData key={house.label} house={house} />
        ))}
      </div>
      <h3>Current Stellia</h3>
      <div className='stellia'>
        <GetSignHouseSets planets={planets} />
      </div>
      <h3>Current Retrogrades</h3>
      <div className='retrogrades'>
        {planets.map((planet) => (
          <DisplayRetrogrades key={`${planet.label} Rx`} planet={planet} />
        ))}
      </div>
    </article>
  );
};

/* ---- Chart Creation ----
  <-- Props
    chartData
      - Moment or birth ChartData
  ----
  Creates the Horoscope (re-calculated only when chartData changes)
  Calls ChartOfTheMoment or BirthChart
*/
interface CreateHoroscopeProps {
  chartData: ChartData;
}
const CreateHoroscope = ({ chartData }: CreateHoroscopeProps) => {
  /* <-- Horoscope --> */
  const horoscope = useMemo(() => createInstances(chartData), [chartData]);

  /* <-- Return UI --> */
  if (chartData.type === 'moment') {
    logHeading('Moment Chart', 'green');
    console.log(horoscope.planets);
    return <ChartOfTheMoment horoscope={horoscope} />;
  }
  logHeading('Birth Chart', 'red');
  console.log(horoscope.planets);
  return <BirthChart horoscope={horoscope} unknown={chartData.unknown} />;
};

/* ---- Display Zodiac Methods & House Systems ----
  <-- Props
    birthData, momentData
      - ChartData for each chart, before the selected zodiac & house system are applied
    zodiacs, houseSystems
      - Uses the data in their corresponding arrays to populate the select list dropdowns
  ----
  <-- Hooks (useState, useMemo)
    systemValues
      - Holds the selected zodiac & house system
      - Applied to both the birth & moment charts
  ----
  Displays select lists for zodiac methods & house systems
  Calls CreateHoroscope (Birth Chart)
  Calls CreateHoroscope (Moment Chart)
  Re-calculates on every change to the select lists to display the desired calculations
*/
interface DisplayMethodsSelectProps {
  birthData: ChartData;
  momentData: ChartData;
  zodiacs: readonly SelectOption<Zodiac>[];
  houseSystems: readonly SelectOption<HouseSystem>[];
}
const DisplayMethodsSelect = ({ birthData, momentData, zodiacs, houseSystems }: DisplayMethodsSelectProps) => {
  /* ---- Hooks ---- */
  /* <- State -> */
  const [systemValues, setSystemValues] = useState<SystemValues>({
    zodiac: DEFAULT_ZODIAC,
    houseSystem: DEFAULT_HOUSE_SYSTEM,
  });

  /* <- Derived Chart Data -> */
  const birthChartData = useMemo(() => ({ ...birthData, ...systemValues }), [birthData, systemValues]);
  const momentChartData = useMemo(() => ({ ...momentData, ...systemValues }), [momentData, systemValues]);

  /* <- Handle Input Changes -> */
  const handleZodiacChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const zodiac = findOption(zodiacs, e.target.value);
    if (zodiac) setSystemValues((values) => ({ ...values, zodiac }));
  };
  const handleHouseSystemChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const houseSystem = findOption(houseSystems, e.target.value);
    if (houseSystem) setSystemValues((values) => ({ ...values, houseSystem }));
  };

  return (
    <>
      <article>
        <div className='system'>
          <label htmlFor='zodiac' className='system'>Zodiac:</label>
          <select id='zodiac' className='system' name='zodiac' value={systemValues.zodiac} onChange={handleZodiacChange}>
            {zodiacs.map((zodiac) => <option key={zodiac.value} value={zodiac.value}>{zodiac.label}</option>)}
          </select>
          <label htmlFor='houseSystem' className='system'>System:</label>
          <select id='houseSystem' className='system' name='houseSystem' value={systemValues.houseSystem} onChange={handleHouseSystemChange}>
            {houseSystems.map((system) => <option key={system.value} value={system.value}>{system.label}</option>)}
          </select>
        </div>
      </article>
      <CreateHoroscope chartData={birthChartData} />
      <CreateHoroscope chartData={momentChartData} />
    </>
  );
};

/* ---- Form Display ----
  <-- Props
    defaultBirthData
      - Values shown on the forms' page load
    months, days, hours, minutes
      - Uses the data in their corresponding arrays to populate the forms' select list dropdowns
    zodiacs, houseSystems
      - Passed through to DisplayMethodsSelect once the form is submitted
  ----
  <-- Hooks (useState, useMemo)
    formValues
      - Holds the birth info entered by the user
    unknown
      - Tracks state of the unknown birth time checkbox
          - true  - formValues: hour/minute=0, hour/minute selects are disabled
    locationStatus / momentLocation
      - Tracks whether the "Use my Location" feature is off, waiting on the browser, or on
          - on  - uses navigator to get the currentPositions' lat/lon coords & rounds them to .00
                - Moment Chart & formValues: latitude/longitude = lat/lon
          - off - Moment Chart: default location, formValues: latitude/longitude = 0.00/0.00
    birthData
      - null until the user submits the form
      - Set to the submitted birth info, which calls DisplayMethodsSelect
  ----
  Calls CreateHoroscope (Moment Chart)
  Uses arrays to fill out select list dropdowns
  Collects user inputs
  Calls DisplayMethodsSelect when submitted
*/
interface AstroFormProps {
  defaultBirthData: ChartData;
  months: readonly SelectOption<number>[];
  days: readonly number[];
  hours: readonly SelectOption<number>[];
  minutes: readonly number[];
  zodiacs: readonly SelectOption<Zodiac>[];
  houseSystems: readonly SelectOption<HouseSystem>[];
}
const AstroForm = ({ defaultBirthData, months, days, hours, minutes, zodiacs, houseSystems }: AstroFormProps) => {
  /* ---- Hooks ---- */
  /* <- State -> */
  const [formValues, setFormValues] = useState<FormValues>(() => toFormValues(defaultBirthData));
  const [unknown, setUnknown] = useState(defaultBirthData.unknown);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('off');
  const [momentLocation, setMomentLocation] = useState<Coordinates>(DEFAULT_MOMENT_LOCATION);
  const [birthData, setBirthData] = useState<ChartData | null>(null);
  /* The moment is captured once, when the page loads */
  const [moment] = useState(createMomentData);

  const momentData = useMemo(() => ({ ...moment, ...momentLocation }), [moment, momentLocation]);

  /* <- Handle Input Changes & Form Submission -> */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (isFormField(name)) {
      setFormValues((values) => ({ ...values, [name]: value }));
    }
  };

  const handleUnknownChange = () => {
    const nextUnknown = !unknown;
    setUnknown(nextUnknown);
    if (nextUnknown) {
      setFormValues((values) => ({ ...values, hour: '0', minute: '0' }));
    }
  };

  const setLocation = ({ latitude, longitude }: Coordinates, momentCoords: Coordinates) => {
    setMomentLocation(momentCoords);
    setFormValues((values) => ({ ...values, latitude: String(latitude), longitude: String(longitude) }));
  };

  const handleUseLocation = () => {
    /* <- Undo Use Location -> */
    if (locationStatus === 'on') {
      setLocationStatus('off');
      setLocation({ latitude: 0, longitude: 0 }, DEFAULT_MOMENT_LOCATION);
      return;
    }

    /* <- Use Location -> */
    if (!('geolocation' in navigator)) {
      alert('It seems like Geolocation, which is required for this function, is not enabled in your browser.');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      // Success
      (position) => {
        const coords = {
          latitude: roundCoord(position.coords.latitude),
          longitude: roundCoord(position.coords.longitude),
        };
        setLocationStatus('on');
        setLocation(coords, coords);
      },
      // Error
      (error) => {
        setLocationStatus('off');
        alert(LOCATION_ERRORS[error.code] ?? 'Error in retrieving current location.');
      },
      /* Without a timeout, the request can wait forever if the OS location service never responds */
      { timeout: LOCATION_TIMEOUT_MS, maximumAge: 60_000 },
    );
  };

  /* <-- Return UI --> */
  if (birthData) {
    return (
      <DisplayMethodsSelect
        birthData={birthData}
        momentData={momentData}
        zodiacs={zodiacs}
        houseSystems={houseSystems}
      />
    );
  }

  return (
    <>
      <article>
        <h2>Enter Birth Info</h2>
        <form action='' id='birth-data'>
          <div className='date'>
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

          <div className='time'>
            <label htmlFor='hour' className='time'>Hour:</label>
            <select id='hour' className='time' name='hour' value={formValues.hour} onChange={handleChange} disabled={unknown}>
              {hours.map((hour) => <option key={hour.value} value={hour.value}>{hour.label}</option>)}
            </select>
            <label htmlFor='minute' className='time'>Minute:</label>
            <select id='minute' className='time' name='minute' value={formValues.minute} onChange={handleChange} disabled={unknown}>
              {minutes.map((min) => <option key={min} value={min}>{min}</option>)}
            </select>
            <label htmlFor='unknown' className='unknown'>Unknown:</label>
            <input type='checkbox' id='unknown' className='unknown' name='unknown' checked={unknown} onChange={handleUnknownChange} />
          </div>

          <div className='location'>
            <label htmlFor='latitude' className='location'>Latitude:</label>
            <input type='number' id='latitude' className='location' name='latitude' min='-90.00' max='90.00' step='0.01' value={formValues.latitude} onChange={handleChange} />
            <label htmlFor='longitude' className='location'>Longitude:</label>
            <input type='number' id='longitude' className='location' name='longitude' min='-180.00' max='180.00' step='0.01' value={formValues.longitude} onChange={handleChange} />
            <button type='button' id='useLocation' className='location' name='useLocation' onClick={handleUseLocation} disabled={locationStatus === 'locating'}>
              {{ off: 'Use my Location', locating: 'Locating…', on: 'Clear my Location' }[locationStatus]}
            </button>
          </div>
          <button type='button' id='submit' name='submit' onClick={() => { setBirthData(toChartData(formValues, unknown)); }}>Calculate Chart</button>
        </form>
      </article>
      <CreateHoroscope chartData={momentData} />
    </>
  );
};

/* <- App() -> */
const App = () => (
  <>
    <Nav />
    <AstroForm
      defaultBirthData={BIRTHDATA}
      months={MONTHS}
      days={DAYS}
      hours={HOURS}
      minutes={MINUTES}
      zodiacs={ZODIACS}
      houseSystems={HOUSESYSTEMS}
    />
  </>
);
export default App;
