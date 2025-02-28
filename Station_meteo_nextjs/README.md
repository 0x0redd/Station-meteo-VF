# Weather Dashboard

A comprehensive weather monitoring and ET₀ prediction dashboard built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Weather Monitoring**: Display current temperature, humidity, solar radiation, and more with 5-minute refresh intervals
- **ET₀ Prediction**: View 24-hour evapotranspiration predictions with confidence intervals
- **Historical Data Analysis**: Access and analyze historical weather data with customizable date ranges
- **Advanced Analytics**: Visualize trends and patterns in weather data
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between dark and light themes with system preference detection

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React.js, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query for API state
- **Data Visualization**: Recharts for charts and graphs
- **Accessibility**: WCAG 2.1 compliant

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
weather-dashboard/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── analytics/        # Analytics components
│   ├── et0/              # ET₀ prediction components
│   ├── historical/       # Historical data components
│   ├── layout/           # Layout components
│   ├── settings/         # Settings components
│   ├── ui/               # UI components (shadcn/ui)
│   └── weather/          # Weather station components
├── lib/                  # Utility functions and API
│   └── api/              # API integration
├── public/               # Static assets
└── styles/               # Global styles
```

## API Integration

The dashboard connects to a weather API that provides:

- Current weather data
- ET₀ predictions
- Historical weather records

API endpoints are defined in `lib/api/weather-api.ts` with proper error handling and retry logic.

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Static Export

This project is configured for static export, making it easy to deploy to any static hosting service:

```bash
npm run build
# or
yarn build
```

The output will be in the `out` directory.

## Accessibility

This project follows WCAG 2.1 guidelines for accessibility:

- Proper semantic HTML
- ARIA attributes where necessary
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## License

This project is licensed under the MIT License - see the LICENSE file for details.