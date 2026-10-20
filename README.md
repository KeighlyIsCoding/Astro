# Astro
## Astrology Web App

### Development
Built with React, TypeScript (strict), & Vite. Requires Node `^20.19.0 || >=22.12.0`.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Type-check & build for production into `build/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check without building |
| `npm run lint` | Lint with ESLint (typescript-eslint, strict type-checked) |
| `npm test` | Run tests with Vitest |


### Features | TODO
  - Graphics for
      - Signs
          - Symbol & constellation
      - Planets
          - Symbol & image
      - Lunar Nodes / Lilith
      - ASC / IC / DC / MC
      - Aspects

    - Objects for
      - Signs
          = Name, element, masculine/feminine, modality, season, attributes, affirmation, decans
      - Angles (ASC, IC, DSC, MC)
          - Name, areas of life
      - Planets
          - Name, isLights (only true for sun & moon), isInner, isOuter, signsRuledTrad, signsRuledModern, affirmation, areas of life
      - Houses
          - Areas of life, quadrant, quadrant info

  - Allow users to choose a house system, chart type, & traditional vs modern
      - House Systems: placidus, whole sign, equal house, koch, regiomontanus, topocentric
      - Chart Types: tropical, sidereal
      - Include Outer Planets: traditional(excl. uranus-pluto), modern(incl. uranus-pluto)
      - Traditional Rulership: traditional(excl. uranus-pluto rulers), modern(incl. uranus-pluto rulers)
          - Turning on trad. rulers will retain the outer planets in a chart but will omit their "extra" ruling over some signs

  - Display info on the chart of the moment
      - Planets, houses, signs, degrees, retrograde

  - Allow users to input their birth data to calculate a chart
      - yyyy/mm/dd & lat / long coords
  - Display users' own chart data
      - Planets, houses, signs, degrees, retrograde
  - Display planet & sign affirmations
  - Display sign element & modality
  - Display if planets' placement is domicile, exalted, fall, or detriment
  - Display users' ruling planet

  - Calculate
      - Stellia
      - Decan
      - Dominant planets
      - Dominant element
      - Signature sign


### Animations | TODO
  - Scroll to top of screen when user submits birth info


### Astrology Packages Used
#### Calculations
0xStarcats' circular-natal-horoscope-js - https://github.com/0xStarcat/CircularNatalHoroscopeJS

#### Chart Drawing
N / A
