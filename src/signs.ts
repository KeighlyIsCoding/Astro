/* ---- ESLint Disablers ---- */
/* eslint-disable @stylistic/array-bracket-newline */

/* ---- Sign Types ---- */
export type SignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Polarity = 'Masculine' | 'Feminine';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export interface Decan {
  traditionalRuler: PlanetName;
  modernRuler?: PlanetName;
  sign: SignName;
  degStart: 0 | 10 | 20;
}

/* id, name, affirmation, element, polarity, modality, season, traditionalRuler, modernRuler, bodyRulers, attributes, decans */
export interface Sign {
  id: number;
  name: SignName;
  affirmation: string;
  element: Element;
  polarity: Polarity;
  modality: Modality;
  season: Season;
  traditionalRuler: PlanetName;
  /** null when the sign has no separate modern ruler */
  modernRuler: PlanetName | null;
  bodyRulers: readonly string[];
  attributes: readonly string[];
  decans: readonly [Decan, Decan, Decan];
}

/* ---- Sign Array ---- */
export const Signs: readonly Sign[] = [
  /* <- Aries -> */
  {
    id: 1,
    name: 'Aries',
    affirmation: 'I am',
    element: 'Fire',
    polarity: 'Masculine',
    modality: 'Cardinal',
    season: 'Spring',
    traditionalRuler: 'Mars',
    modernRuler: null,
    bodyRulers: ['Head', 'Eyes'],
    attributes: ['Enthusiastic', 'Quick-Tempered'],
    decans: [
      { traditionalRuler: 'Mars', sign: 'Aries', degStart: 0 },
      { traditionalRuler: 'Sun', sign: 'Leo', degStart: 10 },
      { traditionalRuler: 'Jupiter', sign: 'Sagittarius', degStart: 20 },
    ],
  },
  /* <- Taurus -> */
  {
    id: 2,
    name: 'Taurus',
    affirmation: 'I have',
    element: 'Earth',
    polarity: 'Feminine',
    modality: 'Fixed',
    season: 'Spring',
    traditionalRuler: 'Venus',
    modernRuler: null,
    bodyRulers: ['Neck', 'Vocal cords', 'Ears'],
    attributes: ['Patient', 'Stubborn'],
    decans: [
      { traditionalRuler: 'Venus', sign: 'Taurus', degStart: 0 },
      { traditionalRuler: 'Mercury', sign: 'Virgo', degStart: 10 },
      { traditionalRuler: 'Saturn', sign: 'Capricorn', degStart: 20 },
    ],
  },
  /* <- Gemini -> */
  {
    id: 3,
    name: 'Gemini',
    affirmation: 'I think',
    element: 'Air',
    polarity: 'Masculine',
    modality: 'Mutable',
    season: 'Spring',
    traditionalRuler: 'Mercury',
    modernRuler: null,
    bodyRulers: ['Hands', 'Lungs', 'Nerves'],
    attributes: ['Witty', 'Inconsistent'],
    decans: [
      { traditionalRuler: 'Mercury', sign: 'Gemini', degStart: 0 },
      { traditionalRuler: 'Venus', sign: 'Libra', degStart: 10 },
      { traditionalRuler: 'Saturn', modernRuler: 'Uranus', sign: 'Aquarius', degStart: 20 },
    ],
  },
  /* <- Cancer -> */
  {
    id: 4,
    name: 'Cancer',
    affirmation: 'I feel',
    element: 'Water',
    polarity: 'Feminine',
    modality: 'Cardinal',
    season: 'Summer',
    traditionalRuler: 'Moon',
    modernRuler: null,
    bodyRulers: ['Stomach', 'Chest', 'Breasts'],
    attributes: ['Loving', 'Pessimistic'],
    decans: [
      { traditionalRuler: 'Moon', sign: 'Cancer', degStart: 0 },
      { traditionalRuler: 'Mars', modernRuler: 'Pluto', sign: 'Scorpio', degStart: 10 },
      { traditionalRuler: 'Jupiter', modernRuler: 'Neptune', sign: 'Pisces', degStart: 20 },
    ],
  },
  /* <- Leo -> */
  {
    id: 5,
    name: 'Leo',
    affirmation: 'I will',
    element: 'Fire',
    polarity: 'Masculine',
    modality: 'Fixed',
    season: 'Summer',
    traditionalRuler: 'Sun',
    modernRuler: null,
    bodyRulers: ['Heart', 'Spine'],
    attributes: ['Optimistic', 'Egoistic'],
    decans: [
      { traditionalRuler: 'Sun', sign: 'Leo', degStart: 0 },
      { traditionalRuler: 'Jupiter', sign: 'Sagittarius', degStart: 10 },
      { traditionalRuler: 'Mars', sign: 'Aries', degStart: 20 },
    ],
  },
  /* <- Virgo -> */
  {
    id: 6,
    name: 'Virgo',
    affirmation: 'I analyze',
    element: 'Earth',
    polarity: 'Feminine',
    modality: 'Mutable',
    season: 'Summer',
    traditionalRuler: 'Mercury',
    modernRuler: null,
    bodyRulers: ['Abdomen', 'Belly'],
    attributes: ['Reliable', 'Judgemental'],
    decans: [
      { traditionalRuler: 'Mercury', sign: 'Virgo', degStart: 0 },
      { traditionalRuler: 'Saturn', sign: 'Capricorn', degStart: 10 },
      { traditionalRuler: 'Venus', sign: 'Taurus', degStart: 20 },
    ],
  },
  /* <- Libra -> */
  {
    id: 7,
    name: 'Libra',
    affirmation: 'I balance',
    element: 'Air',
    polarity: 'Masculine',
    modality: 'Cardinal',
    season: 'Fall',
    traditionalRuler: 'Venus',
    modernRuler: null,
    bodyRulers: ['Skin', 'Lower back'],
    attributes: ['Just', 'Indecisive'],
    decans: [
      { traditionalRuler: 'Venus', sign: 'Libra', degStart: 0 },
      { traditionalRuler: 'Saturn', modernRuler: 'Uranus', sign: 'Aquarius', degStart: 10 },
      { traditionalRuler: 'Mercury', sign: 'Gemini', degStart: 20 },
    ],
  },
  /* <- Scorpio -> */
  {
    id: 8,
    name: 'Scorpio',
    affirmation: 'I desire',
    element: 'Water',
    polarity: 'Feminine',
    modality: 'Fixed',
    season: 'Fall',
    traditionalRuler: 'Mars',
    modernRuler: 'Pluto',
    bodyRulers: ['Pelvic region', 'Reproductive organs'],
    attributes: ['Ambitious', 'Jealous'],
    decans: [
      { traditionalRuler: 'Mars', modernRuler: 'Pluto', sign: 'Scorpio', degStart: 0 },
      { traditionalRuler: 'Jupiter', modernRuler: 'Neptune', sign: 'Pisces', degStart: 10 },
      { traditionalRuler: 'Moon', sign: 'Cancer', degStart: 20 },
    ],
  },
  /* <- Sagittarius -> */
  {
    id: 9,
    name: 'Sagittarius',
    affirmation: 'I understand',
    element: 'Fire',
    polarity: 'Masculine',
    modality: 'Mutable',
    season: 'Fall',
    traditionalRuler: 'Jupiter',
    modernRuler: null,
    bodyRulers: ['Pelvic region', 'Reproductive organs'],
    attributes: ['Straightforward', 'Careless'],
    decans: [
      { traditionalRuler: 'Jupiter', sign: 'Sagittarius', degStart: 0 },
      { traditionalRuler: 'Mars', sign: 'Aries', degStart: 10 },
      { traditionalRuler: 'Sun', sign: 'Leo', degStart: 20 },
    ],
  },
  /* <- Capricorn -> */
  {
    id: 10,
    name: 'Capricorn',
    affirmation: 'I use',
    element: 'Earth',
    polarity: 'Feminine',
    modality: 'Cardinal',
    season: 'Winter',
    traditionalRuler: 'Saturn',
    modernRuler: null,
    bodyRulers: ['Joints', 'Hair', 'Teeth'],
    attributes: ['Disciplined', 'Shy'],
    decans: [
      { traditionalRuler: 'Saturn', sign: 'Capricorn', degStart: 0 },
      { traditionalRuler: 'Venus', sign: 'Taurus', degStart: 10 },
      { traditionalRuler: 'Mercury', sign: 'Virgo', degStart: 20 },
    ],
  },
  /* <- Aquarius -> */
  {
    id: 11,
    name: 'Aquarius',
    affirmation: 'I know',
    element: 'Air',
    polarity: 'Masculine',
    modality: 'Fixed',
    season: 'Winter',
    traditionalRuler: 'Saturn',
    modernRuler: 'Uranus',
    bodyRulers: ['Calves', 'Ankles'],
    attributes: ['Independent', 'Unpredictable'],
    decans: [
      { traditionalRuler: 'Saturn', modernRuler: 'Uranus', sign: 'Aquarius', degStart: 0 },
      { traditionalRuler: 'Mercury', sign: 'Gemini', degStart: 10 },
      { traditionalRuler: 'Venus', sign: 'Libra', degStart: 20 },
    ],
  },
  /* <- Pisces -> */
  {
    id: 12,
    name: 'Pisces',
    affirmation: 'I believe',
    element: 'Water',
    polarity: 'Feminine',
    modality: 'Mutable',
    season: 'Winter',
    traditionalRuler: 'Jupiter',
    modernRuler: 'Neptune',
    bodyRulers: ['Calves', 'Ankles'],
    attributes: ['Creative', 'Escapist'],
    decans: [
      { traditionalRuler: 'Jupiter', modernRuler: 'Neptune', sign: 'Pisces', degStart: 0 },
      { traditionalRuler: 'Moon', sign: 'Cancer', degStart: 10 },
      { traditionalRuler: 'Mars', modernRuler: 'Pluto', sign: 'Scorpio', degStart: 20 },
    ],
  },
];
