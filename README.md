# URL Shortener Frontend

A modern, responsive URL shortener application built with React, featuring a beautiful dark-themed UI with real-time analytics and link management capabilities.

## ✨ Features

- **🔗 URL Shortening**: Create custom short URLs or generate random codes
- **📊 Analytics Dashboard**: View click statistics and link performance
- **📈 Detailed Stats**: Individual link analytics with timestamps
- **🎨 Modern UI**: Beautiful gradient backgrounds with smooth animations
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🔍 Search & Sort**: Filter links and sort by different criteria
- **📋 Copy to Clipboard**: One-click copy with visual feedback
- **🎯 Real-time Updates**: Instant feedback on all actions

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite 7.2** - Build tool and dev server
- **React Router 7.10** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Axios 1.13** - HTTP client
- **ESLint** - Code linting

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rahul230501/urlshortner.git
   cd urlshortner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API endpoint**

   Edit `src/api.js` to point to your backend server:

   ```javascript
   const API_BASE = "http://localhost:3000"; // Change to your backend URL
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🚀 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality
- **`npm run deploy`** - Deploy to GitHub Pages

## 📁 Project Structure

```
urlshortner/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── FormField.jsx
│   │   ├── HealthBadge.jsx
│   │   └── Layout.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   └── StatsPage.jsx
│   ├── api.js           # API configuration
│   ├── App.jsx          # Main app component
│   ├── App.css          # Global styles
│   ├── main.jsx         # App entry point
│   └── index.css        # Tailwind imports
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Dependencies
└── README.md            # This file
```

## 🎨 Features Breakdown

### Dashboard

- Create new short links with optional custom codes
- View all links in a sortable table
- Search functionality for quick filtering
- Click statistics at a glance
- Delete links with confirmation
- Copy short URLs with visual feedback

### Stats Page

- Detailed analytics for individual links
- Total click count
- Last clicked timestamp
- Creation and update dates
- Easy navigation back to dashboard

### UI/UX Highlights

- **Color-coded buttons**:
  - Blue for Copy actions
  - Purple for Stats/Open
  - Red for Delete
  - Green for success feedback
- **Interactive feedback**: Buttons show "Copied!" state
- **Smooth animations**: Scale effects on button clicks
- **Gradient backgrounds**: Modern depth and visual appeal
- **Responsive tables**: Horizontal scroll on mobile devices

## 🔧 Configuration

### Backend Integration

The frontend expects a REST API with the following endpoints:

- `GET /api/links` - Fetch all links (with optional `?search=` query)
- `POST /api/links` - Create new short link
- `GET /code/:code` - Get stats for a specific link
- `DELETE /api/links/:shortId` - Delete a link

### Deployment

For GitHub Pages deployment:

1. Update `vite.config.js` base path if needed
2. Run `npm run deploy`

For other platforms, build with `npm run build` and deploy the `dist/` folder.

## 🌐 Environment Setup

Create a `.env` file (optional) for environment-specific settings:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Then update `src/api.js` to use:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Rahul230501**

- GitHub: [@Rahul230501](https://github.com/Rahul230501)
- Repository: [urlshortner](https://github.com/Rahul230501/urlshortner)

## 🙏 Acknowledgments

- Built with modern React and Vite
- Styled with Tailwind CSS
- Icons and design inspired by modern web practices

---

⭐ **Star this repo if you find it helpful!**
