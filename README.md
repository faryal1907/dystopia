# VOXA - Accessible Reading Platform

VOXA is a comprehensive accessibility-focused reading platform designed specifically for individuals with dyslexia and reading difficulties. It provides advanced text-to-speech, real-time translation, and focus mode features to make reading more accessible and enjoyable for everyone.

## 🌟 Features

### Core Features
- **Text-to-Speech**: Advanced AI-powered voice synthesis with customizable voices, speed, pitch, and volume
- **Real-time Translation**: Instant translation to 50+ languages with dyslexia-friendly formatting
- **Focus Mode**: Distraction-free reading with line-by-line highlighting and customizable backgrounds
- **Reading Progress Tracking**: Comprehensive statistics and achievement system
- **Accessibility-First Design**: Dyslexia-friendly fonts, high contrast themes, and customizable typography

### User Features
- **User Dashboard**: Personalized reading statistics and progress tracking
- **Achievement System**: Gamified learning with rewards and milestones
- **Reading Streaks**: Daily reading goal tracking and motivation
- **Settings Customization**: Extensive personalization options for optimal reading experience
- **Theme Support**: Dark mode, high contrast, and sepia themes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - Document database for user data and reading sessions
- **Mongoose** - MongoDB object modeling
- **Supabase** - Authentication and user management
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Authentication
- **Supabase Auth** - Email/password authentication
- **JWT Tokens** - Secure session management

## 📁 Project Structure

```
voxa/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Main application pages
│   │   ├── utils/          # Utility functions and services
│   │   └── App.jsx         # Main application component
├── server/                 # Express.js backend
│   ├── config/            # Database and service configurations
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # MongoDB/Mongoose models
│   ├── routes/           # API route definitions
│   └── server.js         # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Supabase project (for authentication)

### Environment Variables

Create a `.env` file in the server directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/voxa
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voxa

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/voxa.git
cd voxa
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, ensure your connection string is correct in .env
```

5. **Start the backend server**
```bash
cd server
npm run dev
```

6. **Start the frontend application**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Generate a service role key for backend operations
4. Configure authentication providers in Authentication > Settings

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/voxa`

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user and get connection string
4. Whitelist your IP address

## 🎯 Usage

### For Users
1. **Sign Up**: Create an account using email and password
2. **Text-to-Speech**: Paste or upload text, customize voice settings, and listen
3. **Translation**: Enter text, select source and target languages, get instant translations
4. **Focus Mode**: Enter text and use distraction-free reading with highlighting
5. **Dashboard**: Track your reading progress, achievements, and statistics
6. **Settings**: Customize fonts, themes, and accessibility options

### For Developers
1. **API Endpoints**: All endpoints are under `/api/`
2. **Authentication**: Uses Supabase JWT tokens
3. **Rate Limiting**: 1000 requests per 15 minutes for general API, 100 requests per minute for frequent endpoints
4. **Error Handling**: Comprehensive error responses with proper HTTP status codes

## 📚 API Documentation

### User Routes
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile/:userId` - Update user profile
- `GET /api/users/settings/:userId` - Get user settings
- `PUT /api/users/settings/:userId` - Update user settings

### Reading Routes
- `POST /api/reading/progress` - Save reading progress
- `GET /api/reading/history/:userId` - Get reading history
- `GET /api/reading/stats/:userId` - Get reading statistics
- `PUT /api/reading/streak/:userId` - Update reading streak

### Translation Routes
- `POST /api/translation/translate` - Translate text
- `POST /api/translation/detect` - Detect language
- `GET /api/translation/history` - Get translation history

## 🎨 Customization

### Themes
- Light mode (default)
- Dark mode
- High contrast mode
- Sepia mode for comfortable reading

### Typography
- Font family selection (Lexend recommended for dyslexia)
- Font size adjustment (5 levels)
- Line height customization
- Letter and word spacing options

### Voice Settings
- Multiple voice options
- Speed control (0.5x - 2.0x)
- Pitch adjustment
- Volume control

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: Security headers for web vulnerabilities
- **Authentication**: Secure JWT-based authentication
- **Environment Variables**: Sensitive data protection

## 🐛 Troubleshooting

### Common Issues

1. **429 Too Many Requests Error**
   - Solution: Rate limits have been increased. If still occurring, wait 15 minutes or contact support.

2. **Text-to-Speech Not Working**
   - Ensure browser supports Web Speech API
   - Check if browser has autoplay restrictions
   - Try different voices if available

3. **Translation Errors**
   - Check internet connection
   - Verify API keys in environment variables
   - Try simpler text if translation fails

4. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in .env file
   - Ensure database user has proper permissions

### Browser Compatibility
- Chrome 71+
- Firefox 67+
- Safari 14+
- Edge 79+

## 🤝 Contributing

We welcome contributions to make VOXA even better! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure accessibility standards are maintained

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lexend Font** - Optimized typography for reading proficiency
- **Web Speech API** - Browser-native text-to-speech capabilities
- **Supabase** - Backend-as-a-Service platform
- **MongoDB** - Flexible document database
- **React Community** - Amazing ecosystem and components

## 📞 Support

For support, please:
1. Check this README first
2. Search existing GitHub issues
3. Create a new issue with detailed description
4. Contact us at support@voxa.com

## 🗺 Roadmap

### Version 2.0 (Planned)
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Collaborative reading features
- [ ] Integration with popular e-book formats
- [ ] AI-powered reading comprehension tools
- [ ] Multi-language interface
- [ ] Teacher/parent dashboard for monitoring progress

### Future Enhancements
- [ ] Voice cloning for personalized TTS
- [ ] OCR text extraction from images
- [ ] Integration with learning management systems
- [ ] Advanced pronunciation tools
- [ ] Reading comprehension quizzes
- [ ] Social features and reading communities

---

Made with ❤️ for accessibility and inclusive learning.