# social-poster

A React Electron application for managing and scheduling social media posts across multiple platforms.

## Features

- **Multiple Account Support**: Connect accounts from Twitter/X, Facebook, LinkedIn, Instagram, Mastodon, and Bluesky
- **Multiple Post Types**: Create simple posts, threads, posts with images, posts with links, and polls
- **Flexible Account Selection**: Post to any, all, or a selection of your connected accounts
- **Post Scheduling**: Schedule posts for future dates and times
- **Data Persistence**: All accounts and scheduled posts are saved locally and persist between sessions
- **Clean UI**: Simple, intuitive interface with tab-based navigation

## Installation

```bash
# Install dependencies
npm install
```

## Usage

```bash
# Build the application
npm run build

# Run the application
npm start

# Development mode
npm run dev
```

## Post Types

1. **Simple Post**: Basic text posts for sharing quick updates
2. **Thread**: Multi-post threads with numbered posts (perfect for longer narratives)
3. **With Images**: Posts with up to 4 image URLs
4. **With Link**: Posts with embedded links to share content
5. **Poll**: Interactive polls with 2-4 customizable options

## Screenshots

See the [Pull Request](../../pull) for screenshots of the application in action.

## Technical Stack

- React 19
- Electron 40
- Webpack 5
- Babel
- Pure CSS (no frameworks)
- localStorage for data persistence

## License

ISC
