# EchoVerse - Your Personal Time Capsule

<!-- ![EchoVerse Banner](https://i.imgur.com/example-banner.png) -->

EchoVerse is a modern web application that allows users to create voice-based time capsules. Record your thoughts, emotions, and memories, and set them to unlock at a future date of your choice. It's like sending a message to your future self!

## 🌟 Features

- **Voice Recording**: Record your thoughts and emotions in real-time
- **Time Capsules**: Set future dates for your memories to unlock
- **Mood Tracking**: Express your current mood with emojis
- **Beautiful Timeline**: View your memories in an organized, chronological timeline
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Framer Motion for smooth animations and transitions
- **Secure Storage**: Your memories are safely stored and only accessible to you

## 🛠️ Tech Stack

### Frontend
- **React**: For building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **React Query**: For data fetching and caching
- **React Router**: For navigation
- **React Icons**: For beautiful icons

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Cloudinary**: For audio file storage
- **JWT**: For authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for audio storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/echoverse.git
cd echoverse
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd ../client
npm run dev
```

## 📱 Usage

1. **Create a New Entry**
   - Click on "New Entry"
   - Add a title
   - Select your mood
   - Set an unlock date
   - Record your voice message
   - Save your entry

2. **View Your Timeline**
   - Navigate to the Timeline page
   - View all your entries organized by year and month
   - See which entries are locked and when they'll unlock
   - Listen to unlocked entries

3. **Manage Your Entries**
   - View entry details
   - Listen to unlocked recordings
   - See when locked entries will become available

## 🎨 UI/UX Features

- **Smooth Animations**: All interactions are animated using Framer Motion
- **Responsive Design**: Works on all screen sizes
- **Intuitive Navigation**: Easy-to-use interface
- **Visual Feedback**: Clear indicators for recording, saving, and loading states
- **Accessibility**: Built with accessibility in mind

## 🔒 Security

- **Authentication**: Secure user authentication using JWT
- **Data Protection**: All user data is encrypted and securely stored
- **Access Control**: Users can only access their own entries
- **Secure Storage**: Audio files are stored securely in Cloudinary

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped make EchoVerse better
- Special thanks to the open-source community for the amazing tools we use

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@echoverse.com

---

Made with ❤️ by Sachin Mishra 