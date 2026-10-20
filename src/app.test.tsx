import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './app';
import { createInstances } from './astro';
import { BIRTHDATA } from './defaultData';

/* Drawing SVG charts isn't needed to test the calculated data */
vi.mock('@astrodraw/astrochart', () => ({
  Chart: class {
    radix() {
      return { addPointsOfInterest: vi.fn(), aspects: vi.fn() };
    }
  },
}));

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

test('createInstances returns typed planets & houses', () => {
  const horoscope = createInstances(BIRTHDATA);
  expect(horoscope.planets.map((planet) => planet.label)).toContain('Sun');
  expect(horoscope.houses).toHaveLength(12);
  expect(horoscope.origin).toMatchObject({ year: 1998, month: 2, date: 29 });
});

test('renders the birth info form & the chart of the moment', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Enter Birth Info' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Chart of The Moment' })).toBeInTheDocument();
});

test('calculates the birth chart on submit & recalculates when the zodiac changes', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Calculate Chart' }));

  const birthChart = screen.getByRole('heading', { name: 'Birth Chart' }).closest('article');
  if (!birthChart) throw new Error('Birth Chart article not found');
  const birth = within(birthChart);
  expect(birth.getByText('29-03-1998, 09:10AM at 0° N, 0° E')).toBeInTheDocument();
  expect(birth.getByText('Methods: Tropical & Placidus')).toBeInTheDocument();

  await user.selectOptions(screen.getByLabelText('Zodiac:'), 'sidereal');
  expect(birth.getByText('Methods: Sidereal & Placidus')).toBeInTheDocument();
});

test('hides houses when the birth time is unknown', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByLabelText('Unknown:'));
  expect(screen.getByLabelText('Hour:')).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Calculate Chart' }));

  expect(screen.queryByRole('heading', { name: 'House Placements' })).not.toBeInTheDocument();
  expect(screen.getByText('* Houses cannot be calculated due to unknown birth time')).toBeInTheDocument();
});

test('every celestial body is placed in a house, including across 0° Aries', () => {
  /* Saturn & Neptune sit in the house spanning 0° Aries for this chart */
  const horoscope = createInstances({
    ...BIRTHDATA,
    year: 2026, month: 9, day: 20, hour: 18, minute: 0,
    latitude: 43.14, longitude: -80.25,
  });
  for (const planet of horoscope.planets) {
    expect(planet.House.id, planet.label).toBeGreaterThan(0);
  }
});

describe('Use my Location', () => {
  const mockGeolocation = (getCurrentPosition: Geolocation['getCurrentPosition']) => {
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition } });
  };

  test('fills the lat/lon textboxes & moves the moment chart', async () => {
    const user = userEvent.setup();
    mockGeolocation((success) => {
      success({ coords: { latitude: 45.4215, longitude: -75.6972 } } as GeolocationPosition);
    });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Use my Location' }));

    expect(screen.getByLabelText('Latitude:')).toHaveValue(45.42);
    expect(screen.getByLabelText('Longitude:')).toHaveValue(-75.7);
    expect(screen.getByText(/at 45\.42° N, 75\.7° W/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear my Location' }));
    expect(screen.getByLabelText('Latitude:')).toHaveValue(0);
  });

  test('explains a denied request & re-enables the button', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    mockGeolocation((_success, error) => {
      error?.({ code: 1 } as GeolocationPositionError);
    });
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Use my Location' }));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Location access was denied'));
    expect(screen.getByRole('button', { name: 'Use my Location' })).toBeEnabled();
  });
});
