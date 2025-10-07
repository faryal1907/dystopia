# VOXA - AI-Powered Accessible Reading Platform

> Making reading inclusive, accessible, and empowering for everyone through AI and machine learning.

VOXA is a comprehensive accessibility-focused reading platform designed specifically for individuals with dyslexia and reading difficulties. It provides advanced text-to-speech, real-time translation, AI-powered features, and focus mode to make reading more accessible and enjoyable for everyone.

---

## 🌟 Features

### 🎯 Core Features

#### **Text-to-Speech**
- Advanced AI-powered voice synthesis with customizable voices, speed, pitch, and volume
- Multiple voice options with natural-sounding pronunciation
- Real-time word highlighting during playback
- Edit/Read mode toggle for seamless interaction
- Pronunciation speed control (0.5x - 2.0x)

#### **Real-time Translation**
- Instant translation to 50+ languages
- MyMemory API integration with 50,000 characters/day free limit
- Dyslexia-friendly formatting and typography
- Auto-translation option
- Translation history tracking

#### **Focus Mode**
- Distraction-free reading with line-by-line highlighting
- Word-by-word or multi-word display modes
- Customizable reading speed (100-400 WPM)
- Pause functionality with word lookup capability
- Visual progress tracking

#### **Reading Progress Tracking**
- Comprehensive statistics and achievement system
- Reading streaks and daily goals
- Session history with completion tracking
- Time spent and words read analytics

#### **Accessibility-First Design**
- OpenDyslexic and Lexend fonts for improved readability
- High contrast themes (Light, Dark, Sepia, High Contrast)
- Customizable typography (font size, line height, letter spacing, word spacing)
- WCAG 2.1 AA compliant design

---

### 🤖 AI & ML Features

#### **Dictionary & Pronunciation Helper** ✨ NEW
- Click any word to see instant definitions, synonyms, and antonyms
- Audio pronunciation with native voice support
- Word origin and etymology information
- Multiple definitions with examples
- Supports 130+ languages via Free Dictionary API
- Smart caching for fast lookups
- Works in all reading modes (Text-to-Speech, Translation, Focus Mode)
- **No API key required - completely free**

#### **Sentiment Analysis** ✨ NEW
- Real-time emotional tone analysis of text
- Identifies positive, negative, and neutral sentiments
- Visual representation with emojis and color coding
- Highlights positive and negative words
- Sentiment score and comparative metrics
- Reading recommendations based on emotional content
- Helps users understand emotional context and tone

#### **Coming Soon**
- AI-powered text summarization
- Client-side language detection
- Reading comprehension insights
- Adaptive reading recommendations

---

### 👤 User Features

- **User Dashboard**: Personalized reading statistics and progress tracking
- **Achievement System**: Gamified learning with rewards and milestones
- **Reading Streaks**: Daily reading goal tracking and motivation
- **Settings Customization**: Extensive personalization options for optimal reading experience
- **Theme Support**: Dark mode, high contrast, and sepia themes

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### AI/ML Libraries
- **Sentiment** - Client-side sentiment analysis (v5.0.2)
- **Web Speech API** - Browser-native text-to-speech and speech recognition
- **Free Dictionary API** - Word definitions and pronunciations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - Document database for user data and reading sessions
- **Mongoose** - MongoDB object modeling
- **Supabase** - Authentication and user management
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **Axios** - HTTP client for API requests

### Authentication
- **Supabase Auth** - Email/password authentication
- **JWT Tokens** - Secure session management

---

## 📁 Project Structure

voxa/
├── client/ # React frontend application
│ ├── src/
│ │ ├── components/ # Reusable React components
│ │ │ ├── WordTooltip.jsx # Dictionary tooltip component
│ │ │ └── SentimentDisplay.jsx # Sentiment analysis display
│ │ ├── context/ # React context providers
│ │ │ ├── AuthContext.jsx
│ │ │ ├── UserContext.jsx
│ │ │ └── ThemeContext.jsx
│ │ ├── pages/ # Main application pages
│ │ │ ├── Dashboard.jsx
│ │ │ ├── TextToSpeech.jsx
│ │ │ ├── Translation.jsx
│ │ │ ├── FocusMode.jsx
│ │ │ └── Settings.jsx
│ │ ├── services/ # Service layer
│ │ │ ├── dictionaryService.js # Dictionary API integration
│ │ │ ├── sentimentService.js # Sentiment analysis service
│ │ │ └── translationService.js # Translation API integration
│ │ ├── utils/ # Utility functions
│ │ │ └── textToSpeech.js
│ │ └── App.jsx # Main application component
├── server/ # Express.js backend
│ ├── config/ # Database and service configurations
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Express middleware
│ ├── models/ # MongoDB/Mongoose models
│ ├── routes/ # API route definitions
│ │ └── dictionaryRoutes.js # Dictionary API routes
│ └── server.js # Main server file
└── README.md

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or Atlas)
- Supabase project (for authentication)
- npm or yarn package manager

### Environment Variables

#### Server `.env` file:

Database
MONGODB_URI=mongodb://localhost:27017/voxa

or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voxa
Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

Server Configuration
PORT=5000
NODE_ENV=development


#### Client `.env` file:

VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


### Installation & Setup

1. **Clone the repository**
git clone https://github.com/yourusername/voxa.git
cd voxa


2. **Install server dependencies**
cd server
npm install


3. **Install client dependencies**
cd ../client
npm install


**Note:** Client dependencies now include:
- `sentiment` for sentiment analysis
- `framer-motion` for animations
- Other standard React dependencies

4. **Start MongoDB**
If using local MongoDB
mongod

If using MongoDB Atlas, ensure your connection string is correct in .env
text

5. **Start the backend server**
cd server
npm run dev

6. **Start the frontend application**
cd client
npm run dev


The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

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

### Free API Services

#### Dictionary API (No Setup Required)
- Uses [Free Dictionary API](https://dictionaryapi.dev)
- No API key required
- 100% free with no rate limits
- Automatic caching in application

#### Translation API
- Uses [MyMemory API](https://mymemory.translated.net/)
- 50,000 characters per day free
- No billing setup required

---

## 🎯 Usage

### For Users

#### **Text-to-Speech**
1. Navigate to Text-to-Speech page
2. Paste or type your text (or upload .txt file)
3. Click "Read Mode" to enable word-by-word dictionary lookup
4. Click any word to see definition, pronunciation, and examples
5. Click the heart icon (💗) to analyze sentiment
6. Adjust voice settings (speed, pitch, volume)
7. Click play to start reading

#### **Translation**
1. Go to Translation page
2. Enter text to translate
3. Select target language
4. Click words in source or translated text for definitions
5. Use auto-translate for real-time translation

#### **Focus Mode**
1. Open Focus Mode
2. Enter or paste text
3. Click "Read Mode" to preview with word lookup
4. Start focus reading
5. **Pause anytime** to click words for definitions
6. Adjust reading speed (100-400 WPM)

#### **Dashboard**
- View reading statistics and progress
- Track daily reading streaks
- Review achievements and milestones
- Monitor words read and time spent

#### **Settings**
- Customize fonts, themes, and colors
- Adjust typography for better readability
- Set reading preferences
- Configure accessibility options

---

### For Developers

#### API Endpoints

**User Routes**
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile/:userId` - Update user profile
- `GET /api/users/settings/:userId` - Get user settings
- `PUT /api/users/settings/:userId` - Update user settings

**Reading Routes**
- `POST /api/reading/progress` - Save reading progress
- `GET /api/reading/history/:userId` - Get reading history
- `GET /api/reading/stats/:userId` - Get reading statistics
- `PUT /api/reading/streak/:userId` - Update reading streak

**Translation Routes**
- `POST /api/translation/translate` - Translate text
- `POST /api/translation/detect` - Detect language
- `GET /api/translation/history` - Get translation history

**Dictionary Routes** ✨ NEW
- `GET /api/dictionary/define/:word` - Get word definition
- `POST /api/dictionary/batch` - Batch word lookups
- `GET /api/dictionary/health` - Check dictionary service status

#### Authentication
- Uses Supabase JWT tokens
- Token validation on protected routes
- Automatic token refresh

#### Rate Limiting
- General API: 1000 requests per 15 minutes
- Frequent endpoints: 100 requests per minute
- Dictionary API: Cached responses for performance

#### Error Handling
- Comprehensive error responses
- Proper HTTP status codes
- User-friendly error messages

---

## 🎨 Customization

### Themes
- **Light mode** - Default bright theme
- **Dark mode** - Easy on eyes for night reading
- **High contrast mode** - Enhanced visibility
- **Sepia mode** - Comfortable reading experience

### Typography
- **Font family**: OpenDyslexic, Lexend, Arial
- **Font size**: 5 adjustable levels
- **Line height**: Customizable spacing
- **Letter spacing**: Enhanced readability
- **Word spacing**: Improved comprehension

### Voice Settings
- **Multiple voices**: Browser-native and system voices
- **Speed control**: 0.5x to 2.0x
- **Pitch adjustment**: 0 to 2.0
- **Volume control**: 0% to 100%

### Focus Mode Settings
- **Reading speed**: 100-400 WPM
- **Pause duration**: 200-2000ms
- **Word-by-word mode**: Toggle on/off
- **Background colors**: Multiple options

---

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse and DDoS attacks
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: Security headers for web vulnerabilities
- **Authentication**: Secure JWT-based authentication with Supabase
- **Environment Variables**: Sensitive data protection
- **XSS Prevention**: Content Security Policy headers
- **SQL Injection Prevention**: MongoDB parameterized queries

---

## 🐛 Troubleshooting

### Common Issues

#### **Text-to-Speech Not Working**
- **Solution**: Ensure browser supports Web Speech API (Chrome, Firefox, Edge, Safari 14+)
- Check if browser has autoplay restrictions
- Try different voices if available
- Clear browser cache and reload

#### **Translation Errors**
- **Solution**: Check internet connection
- Verify you haven't exceeded daily character limit (50,000)
- Try simpler text if translation fails
- Check browser console for specific errors

#### **Dictionary Not Loading**
- **Solution**: Check internet connection
- Verify dictionaryapi.dev is accessible
- Clear application cache
- Check browser console for errors

#### **Sentiment Analysis Shows "Neutral" for Everything**
- **Solution**: Enter longer text (minimum 5-10 words)
- Ensure text contains emotional words
- Check that sentiment library is installed: `npm list sentiment`

#### **Database Connection Issues**
- **Solution**: Verify MongoDB is running (`mongod` command)
- Check connection string in .env file
- Ensure database user has proper permissions
- Whitelist IP address if using MongoDB Atlas

#### **429 Too Many Requests Error**
- **Solution**: Rate limits prevent abuse. Wait 15 minutes
- Reduce request frequency
- Contact support if persistent

### Browser Compatibility
- **Chrome** 71+
- **Firefox** 67+
- **Safari** 14+
- **Edge** 79+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 71+

---

## 🤝 Contributing

We welcome contributions to make VOXA even better! Here's how you can help:

### How to Contribute

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
- Ensure accessibility standards are maintained (WCAG 2.1 AA)
- Add comments for complex logic
- Use dyslexia-friendly variable names

### Areas for Contribution

- **Features**: New AI/ML capabilities, accessibility improvements
- **Bug Fixes**: Report and fix bugs
- **Documentation**: Improve README, add tutorials
- **Testing**: Write unit and integration tests
- **Translations**: Add more language support
- **Design**: Improve UI/UX for better accessibility

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies
- **OpenDyslexic Font** - Optimized typography for reading proficiency
- **Lexend Font** - Variable font designed to improve reading proficiency
- **Web Speech API** - Browser-native text-to-speech capabilities
- **Free Dictionary API** - Comprehensive word definitions
- **MyMemory Translation API** - Free translation service
- **Sentiment Library** - JavaScript sentiment analysis

### Platforms
- **Supabase** - Backend-as-a-Service platform
- **MongoDB** - Flexible document database
- **Vite** - Next-generation frontend tooling

### Communities
- **React Community** - Amazing ecosystem and components
- **A11y Community** - Accessibility best practices
- **Open Source Contributors** - For making free tools available

---

## 📞 Support

For support, please:

1. **Check this README first** - Most answers are here
2. **Search existing GitHub issues** - Your question may already be answered
3. **Create a new issue** - Provide detailed description with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS information
4. **Contact us** - [support@voxa.com](mailto:support@voxa.com)

---

## 🗺 Roadmap

### ✅ Completed Features (v1.0)
- [x] Text-to-Speech with voice customization
- [x] Real-time translation (50+ languages)
- [x] Focus Mode with highlighting
- [x] User authentication and profiles
- [x] Reading progress tracking
- [x] Achievement system
- [x] Dark mode and themes
- [x] Dictionary & Pronunciation Helper
- [x] Sentiment Analysis

### 🚧 In Progress (v1.1)
- [ ] AI-powered text summarization (Hugging Face API)
- [ ] Client-side language detection (TensorFlow.js)
- [ ] Enhanced gamification features

### 📅 Planned Features (v2.0)
- [ ] Offline mode support with service workers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Collaborative reading features
- [ ] Integration with popular e-book formats (EPUB, PDF)
- [ ] OCR text extraction from images
- [ ] Multi-language interface (UI translation)
- [ ] Teacher/parent dashboard for monitoring progress

### 🔮 Future Enhancements (v3.0+)
- [ ] Voice cloning for personalized TTS
- [ ] Integration with learning management systems (LMS)
- [ ] Advanced pronunciation tools with IPA
- [ ] Reading comprehension quizzes with AI
- [ ] Social features and reading communities
- [ ] Browser extension
- [ ] Integration with e-readers (Kindle, Kobo)
- [ ] Bionic reading mode
- [ ] Reading speed training tools

---

## 🏆 Project Statistics

- **Total Features**: 15+
- **AI/ML Features**: 2 (with 5+ planned)
- **Supported Languages**: 50+ for translation, 130+ for dictionary
- **Free APIs Used**: 3 (Dictionary, Translation, Sentiment)
- **Accessibility Score**: WCAG 2.1 AA Compliant
- **Browser Support**: 95%+ of modern browsers

---

## 💡 Why VOXA?

Over **700 million people worldwide** struggle with dyslexia and other reading disabilities. VOXA addresses this by:

✨ **Making reading accessible** - Advanced TTS, dyslexia-friendly fonts, and customizable themes  
✨ **Breaking language barriers** - Real-time translation to 50+ languages  
✨ **Enhancing comprehension** - Dictionary, sentiment analysis, and focus tools  
✨ **Gamifying learning** - Achievements, streaks, and progress tracking  
✨ **Being completely free** - No paywalls, no subscriptions, no hidden costs  

---

**Made with ❤️ for accessibility and inclusive learning.**

*VOXA - Empowering everyone to read, learn, and grow.*

---

**Last Updated**: October 7, 2025  
**Version**: 1.0.2  
**Contributors**: [Your Name]  
**Repository**: [GitHub Link]  
**Live Demo**: [Demo Link]