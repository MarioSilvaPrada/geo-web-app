# Geo Explorer - Location Analysis Web App

A modern web application that allows users to explore locations by analyzing addresses and discovering nearby amenities using OpenStreetMap and Overpass API.

## Features

- **Address Geocoding**: Convert street addresses to precise latitude/longitude coordinates
- **Interactive Maps**: View locations on an interactive map with nearby amenities
- **Nearby Places Discovery**: Find businesses, services, and points of interest around any location
- **Categorized Results**: Organize nearby places into logical categories (Food & Drink, Shopping, Healthcare, etc.)
- **Detailed Analytics**: View statistics and insights about the area
- **Modern UI**: Built with Shadcn UI components for a professional look and feel
- **Dark/Light Mode**: Toggle between light and dark themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessible**: WCAG compliant components with proper focus management

## Technology Stack

- **Frontend**: Next.js 15 with React 19, TypeScript
- **UI Components**: Shadcn UI with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React icons
- **Theme**: Next-themes for dark/light mode support
- **Mapping**: Leaflet with React-Leaflet for interactive maps
- **APIs**: 
  - OpenStreetMap Nominatim API for geocoding
  - Overpass API for nearby place discovery
- **HTTP Client**: Axios for API requests

## How It Works

1. **User Input**: Users enter a street address on the homepage
2. **Geocoding**: The address is converted to coordinates using the Nominatim API
3. **Data Fetching**: Nearby amenities are fetched using the Overpass API within a 1km radius
4. **Visualization**: Results are displayed on an interactive map with categorized listings
5. **Analytics**: Statistics and insights are provided about the location

## API Endpoints

### `/api/geocode`

Handles address geocoding and nearby place discovery.

**Parameters:**
- `address` (string): The street address to geocode

**Response:**
```json
{
  "geocode": {
    "place_id": number,
    "lat": string,
    "lon": string,
    "display_name": string,
    "address": object
  },
  "coordinates": {
    "lat": number,
    "lon": number
  },
  "places": Array<{
    "type": string,
    "id": number,
    "lat": number,
    "lon": number,
    "tags": object
  }>
}
```

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd geo-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## Usage

1. Open the application in your web browser
2. Enter a street address in the search box (e.g., "123 Main St, New York, NY")
3. Click "Explore Location" to analyze the area
4. View the results on the map and browse categorized nearby amenities
5. Click on map markers to see detailed information about each location

## Project Structure

```
geo-web-app/
├── app/
│   ├── api/
│   │   └── geocode/
│   │       └── route.ts          # API endpoint for geocoding
│   ├── components/
│   │   └── MapComponent.tsx      # Interactive map component
│   ├── results/
│   │   └── page.tsx              # Results page with analytics
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Features in Detail

### Geocoding
- Uses OpenStreetMap's Nominatim API for accurate address-to-coordinate conversion
- Handles various address formats and provides detailed location information
- Error handling for invalid or unfound addresses

### Nearby Places Discovery
- Utilizes the Overpass API to query OpenStreetMap data
- Searches within a 1km radius of the target location
- Filters for amenities and points of interest

### Categorization
Places are automatically categorized into:
- 🍽️ Food & Drink (restaurants, cafes, bars)
- 🛍️ Shopping (shops, markets, malls)
- 🏥 Healthcare (hospitals, clinics, pharmacies)
- 🎓 Education (schools, universities, libraries)
- 🚌 Transportation (bus stations, fuel stations, parking)
- 🎭 Entertainment (cinemas, theaters, nightclubs)
- 🏛️ Services (banks, post offices, government)
- 📍 Other (miscellaneous amenities)

### Interactive Map
- Built with Leaflet for smooth interaction
- Custom markers for different types of locations
- Popup information windows with detailed place data
- Responsive design that works on all devices

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Environment

The application doesn't require any environment variables for basic functionality, as it uses public APIs.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- OpenStreetMap for providing free geographic data
- Nominatim API for geocoding services
- Overpass API for querying OpenStreetMap data
- Leaflet for the mapping library
- Next.js team for the excellent framework
