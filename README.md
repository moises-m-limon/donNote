# DonNote: Your AI-Powered Note-Taking and Content Summarization Assistant

## 🌟 Overview

donNote is a cutting-edge application that combines the power of artificial intelligence with intuitive note-taking capabilities. It features advanced speech-to-text conversion, video summarization, and intelligent content processing to help you capture and understand information more effectively.

## 🚀 Features

- **Speech-to-Text Interface**: Convert spoken words into text with high accuracy
- **Video Summarization**: Extract key points and generate summaries from video content
- **Modern UI/UX**: Built with Next.js and Tailwind CSS for a seamless experience
- **AI-Powered Analysis**: Leverages Gemini AI for intelligent content processing
- **Real-time Processing**: Instant conversion and summarization capabilities
- **Responsive Design**: Works seamlessly across all devices


### 📝 Note Tab
The core note-taking interface with multiple modes and features:
- **Detailed Mode**: For comprehensive note-taking with full context
- **Big Picture Mode**: For capturing key points and main ideas
- **Voice Recording**: Real-time speech-to-text conversion
- **File Upload**: Import and process existing documents
- **Note Management**: Save, load, and organize your notes
- **AI Integration**: Access to knowledge graph and quiz generation

### 🎓 Class Tab
Integration with Canvas LMS for educational content:
- **Course Selection**: Browse and select your enrolled courses
- **File Management**: Access and organize course materials
- **Document Processing**: Analyze and summarize course content
- **Integration Features**: 
  - Canvas API integration
  - Course file browsing
  - Document analysis
  - Content summarization

### 🧠 AI Tools Tab
Advanced AI-powered features accessible across all tabs:
- **Knowledge Graph**: Visual representation of connected concepts
- **Quiz Generator**: Create practice questions from your notes
- **Summarizer**: Generate concise summaries of longer content
- **Smart Analysis**: AI-powered insights and connections

### 📊 History Panel
Track and manage your work:
- **Recent Notes**: Quick access to recently edited notes
- **Activity Timeline**: View your note-taking history
- **Search Functionality**: Find specific notes or content
- **Organization Tools**: Sort and filter your notes

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **UI Components**: Shadcn/ui
- **API Integration**: RESTful APIs

### Backend
- **Language**: Python
- **Framework**: Flask
- **AI Integration**: Gemini AI
- **Speech Processing**: Advanced audio processing
- **Video Analysis**: Custom video processing algorithms

## 📋 Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Yarn package manager
- Git

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file with the following variables:
   ```
   CAVAS_API_KEY=your_cavas_api_key
   NEXT_PUBLIC_OAUTH_CLIENT_ID=your_oauth_client_id
   GEMINI_API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_API_KEY=your_supabase_api_key
   DEV=true
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with necessary environment variables

5. Start the backend server:
   ```bash
   python app.py
   ```

## 🏗️ Project Structure

```
donNote/
├── frontend/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── public/          # Static assets
│   └── styles/          # Global styles
├── backend/
│   ├── app.py           # Main application file
│   ├── configs.py       # Configuration settings
│   ├── utils.py         # Utility functions
│   └── requirements.txt # Python dependencies
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
- `CAVAS_API_KEY`: API key for CAVAS service
- `NEXT_PUBLIC_OAUTH_CLIENT_ID`: OAuth client ID
- `GEMINI_API_KEY`: API key for Gemini AI
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_API_KEY`: Supabase API key
- `DEV`: Development mode flag

#### Backend (.env)
- [Add your backend environment variables here]

## 🎯 Usage

1. **Speech-to-Text**:
   - Click the microphone icon
   - Start speaking
   - View real-time transcription
   - Save or edit the transcribed text

2. **Video Summarization**:
   - Upload a video file
   - Wait for processing
   - View AI-generated summary
   - Export or share the summary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Gemini AI for providing the AI capabilities
- Next.js team for the amazing framework
- All contributors and supporters of the project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">
  <p>Made with ❤️ by the donNote Team</p>
</div>
