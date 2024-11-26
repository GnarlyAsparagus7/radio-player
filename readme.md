# 🌍 World Radio Player

An interactive world radio player that lets you discover and listen to radio stations from around the globe. Built with Next.js, React, and Tailwind CSS.

![World Radio Player](screenshot.png)

## ✨ Features

- 🗺️ Interactive world map for station discovery
- 📻 Stream radio stations from different countries
- ⭐ Save your favorite stations
- 🎨 Beautiful, responsive UI with hover panels
- 🌓 Dark mode support
- 🎵 Real-time audio playback

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/world-radio-player.git
cd world-radio-player
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Radio Browser API](https://api.radio-browser.info/) - Radio station database
- [Lucide Icons](https://lucide.dev/) - Icons

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Radio station data provided by [Radio Browser API](https://api.radio-browser.info/)
- World map visualization inspired by [React Simple Maps](https://www.react-simple-maps.io/)

Prompt: Build an Elegant Online Radio Player with a Map Interface

“I want to create an online radio player using Next.js for the frontend and ShadCN UI for a clean, modern design. The application will allow users to explore and play radio stations from around the world, with an elegant and interactive map-based interface. Below are the detailed requirements:

Core Features

	1.	Interactive World Map:
	•	Display a large, interactive map as the app’s background.
	•	Allow users to select countries by clicking on them, filtering radio stations based on the selected country.
	•	Highlight the selected country visually, with options to reset or change the selection.
	2.	Radio Station Integration:
	•	Fetch and display a list of radio stations using the RadioBrowser API (https://gitlab.com/radiobrowser/radiobrowser-api-rust).
	•	Display station details, such as name, genre, country, bitrate, and status.
	•	Implement a search bar to filter stations by genre, name, or popularity.
	3.	Elegant Media Player:
	•	Include a simple and elegant media player with controls for play, pause, volume adjustment, and station switching.
	•	Show now-playing details, including the station name and genre.
	•	Add support for displaying station logos or placeholder images.
	4.	Responsive Design:
	•	Ensure the UI is fully responsive, adapting beautifully to desktops, tablets, and smartphones.
	•	Use ShadCN components for consistency and a polished look.

Visual and UI Requirements

	1.	Elegant Design:
	•	Use a ShadCN UI framework for clean and professional components.
	•	Choose a minimal yet visually rich color palette, such as dark mode with subtle accent colors for interactivity.
	•	Use smooth transitions and hover effects for a polished experience.
	2.	Map Styling:
	•	Incorporate a world map as the background using libraries like React Simple Maps, Leaflet, or Mapbox.
	•	Style the map to blend seamlessly with the app’s theme (e.g., muted colors, low-opacity for non-selected regions).
	3.	Station List:
	•	Display radio stations in a card-style layout or a collapsible side panel for easy navigation.
	•	Include clear labels and icons to indicate station quality (e.g., bitrate, availability).

API Integration

	1.	Use RadioBrowser API:
	•	Integrate the RadioBrowser API to fetch radio station data.
	•	Fetch stations based on selected countries, genres, or popularity.
	•	Handle API responses and errors gracefully with user-friendly messages.
	2.	Endpoints to Use:
	•	/stations/bycountry/{country}
	•	/stations/topclick/{limit}
	•	/stations/bytag/{tag}

Development Steps

	1.	Setup Next.js and ShadCN UI:
	•	Initialize a Next.js project and install ShadCN for UI components.
	•	Configure a global layout for consistent theming.
	2.	Map Integration:
	•	Choose a map library (React Simple Maps, Leaflet, or Mapbox).
	•	Render the map as a full-page background.
	•	Add interactivity for country selection using map click events or dropdown.
	3.	API Fetching and State Management:
	•	Use Next.js API routes or a direct fetch from the frontend to connect to the RadioBrowser API.
	•	Manage state for selected country, station list, and now-playing station using React Context or Redux.
	4.	Media Player Implementation:
	•	Create a media player component with controls for play, pause, and volume.
	•	Handle streaming audio from radio station URLs.
	5.	UI Enhancements:
	•	Style the app using ShadCN components (buttons, panels, cards).
	•	Add animations for transitions between country selection and station list.
	6.	Testing and Deployment:
	•	Test responsiveness and functionality on various devices.
	•	Deploy the app to Vercel for fast and reliable hosting.

Future Enhancements

	1.	Favorites List:
	•	Allow users to save favorite stations for quick access.
	2.	Now-Playing Metadata:
	•	Display real-time metadata like song titles or artist names if available.
	3.	Geolocation Support:
	•	Automatically suggest stations based on the user’s location.
	4.	Multi-Language Support:
	•	Add language options for users from different countries.
	5.	Offline Support:
	•	Cache the most recently played station for offline playback.

Suggested Libraries and Tools

	1.	Frontend:
	•	Next.js (React framework)
	•	ShadCN UI (UI library)
	•	React Simple Maps or Leaflet (map integration)
	2.	API Integration:
	•	Axios or Fetch API for data fetching
	•	RadioBrowser API (primary data source)
	3.	Audio Playback:
	•	HTML5 Audio API or libraries like react-h5-audio-player.
	4.	Hosting and Deployment:
	•	Deploy with Vercel for seamless Next.js hosting.
