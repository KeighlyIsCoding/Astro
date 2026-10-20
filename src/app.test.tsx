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
