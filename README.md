# 🏥 HealthHub - Personalized Health Tracker & Advisor

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://personalized-health-tracker-and-advisior.vercel.app/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

## 📖 Overview

**HealthHub** is a comprehensive health tracking and advisory platform that connects patients with healthcare professionals while providing intelligent health insights. Built with modern web technologies, it offers a seamless experience for managing your health journey and accessing quality healthcare services.

🌐 **Live Application**: [https://personalized-health-tracker-and-advisior.vercel.app/](https://personalized-health-tracker-and-advisior.vercel.app/)

## ✨ Key Features

### 🏠 **Dual User Experience**
- **Patient Portal**: Comprehensive health tracking and doctor consultation
- **Doctor Dashboard**: Practice management and patient interaction tools
- **Role-based Authentication**: Secure login system with user type differentiation

### 📊 **Health Tracking & Analytics**
- **Real-time Health Metrics**: Monitor heart rate, steps, sleep patterns, and calories
- **Interactive Dashboards**: Beautiful charts and visualizations powered by Recharts
- **Fitness Data Integration**: Track daily activities and health progress
- **Medication Management**: Keep track of prescriptions and dosage schedules

### 👨‍⚕️ **Doctor Services**
- **Advanced Doctor Search**: Find specialists by location, specialty, and availability
- **Smart Appointment Booking**: Seamless scheduling with integrated payment via Razorpay
- **Video Consultations**: Built-in video calling for remote consultations
- **Real-time Chat**: Instant messaging between patients and doctors

### 🤖 **AI-Powered Health Assistant**
- **Intelligent Chatbot**: Get instant health advice and medication information
- **Gemini AI Integration**: Advanced natural language processing for health queries
- **24/7 Availability**: Round-the-clock health support and guidance

### 🔐 **Security & Privacy**
- **Supabase Authentication**: Secure user management with OAuth support
- **Row Level Security (RLS)**: Database-level privacy protection
- **HIPAA-Compliant**: Healthcare data protection standards
- **Encrypted Communications**: Secure messaging and video calls

## 🛠 Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18 + TypeScript | Modern, type-safe UI development |
| **Styling** | Tailwind CSS + shadcn/ui | Responsive design system |
| **Backend** | Supabase | Authentication, database, real-time features |
| **Database** | PostgreSQL | Robust data storage with RLS |
| **AI/ML** | Google Gemini API | Intelligent health assistance |
| **Payments** | Razorpay | Secure payment processing |
| **Maps** | Google Maps API | Location-based doctor search |
| **Animation** | Framer Motion | Smooth, engaging user interactions |
| **Charts** | Recharts | Interactive data visualizations |
| **Deployment** | Vercel | Fast, reliable hosting |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Google Gemini API key
- Razorpay account (for payments)
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush-upadhyay1605/Personalized-Health-Tracker-and-Advisior.git
   cd Personalized-Health-Tracker-and-Advisior
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   RAZORPAY_KEY_ID=your_razorpay_key
   ```

4. **Set up Supabase database**
   - Create the required tables (fitness_data, appointments, profiles)
   - Configure Row Level Security policies
   - Set up authentication providers

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Usage Guide

### For Patients

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Complete Profile**: Add your health information and preferences
3. **Track Health**: Record daily metrics like steps, heart rate, and activities
4. **Find Doctors**: Use the advanced search to find specialists near you
5. **Book Appointments**: Schedule consultations with integrated payment
6. **Video Consultations**: Join video calls for remote consultations
7. **Chat with AI**: Get instant health advice from the AI assistant

### For Doctors

1. **Professional Registration**: Create a doctor account with verification
2. **Profile Setup**: Add specializations, experience, and availability
3. **Manage Appointments**: View and manage patient bookings
4. **Patient Consultations**: Conduct video calls and chat sessions
5. **Patient Records**: Access health metrics and consultation history

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── chatbot/         # AI chatbot interface
│   └── features/        # Feature-specific components
├── pages/               # Application pages/routes
│   ├── Dashboard.tsx    # Main dashboard
│   ├── DoctorSearch.tsx # Doctor finding interface
│   ├── HealthMetrics.tsx# Health tracking page
│   └── Profile.tsx      # User profile management
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── utils/               # Utility functions and data
└── types/               # TypeScript type definitions
```

## 🌟 Upcoming Features

- [ ] Wearable device integration (Fitbit, Apple Watch)
- [ ] Telemedicine prescriptions
- [ ] Health insurance integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced AI diagnostics
- [ ] Family health management

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request.

## 📞 Contact & Support

- **Developer**: Ayush Upadhyay
- **Email**: work.uayush16@gmail.com
- **GitHub**: [@Ayush-upadhyay1605](https://github.com/Ayush-upadhyay1605)
- **Project Link**: [HealthHub Repository](https://github.com/Ayush-upadhyay1605/Personalized-Health-Tracker-and-Advisior)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities
- [Vercel](https://vercel.com/) - Hosting platform

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ for better healthcare accessibility

