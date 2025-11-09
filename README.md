# Pageify Manufacturing System - Next.js

A modern, full-stack manufacturing management system built with Next.js 14, featuring real-time monitoring, batch management, and quality control.

## 🚀 Features

### Frontend
- **Modern UI**: Built with Next.js 14 App Router and React 18
- **Enhanced Design**: New dark theme with purple accent colors
- **Responsive**: Mobile-first design with Tailwind CSS
- **Animations**: Smooth transitions with Framer Motion
- **Real-time Updates**: Live data synchronization via WebSockets

### Backend
- **API Routes**: Next.js API routes for all backend functionality
- **Database**: PostgreSQL with Prisma ORM for type safety
- **Authentication**: NextAuth.js with JWT tokens
- **Real-time**: Socket.io for live updates
- **Security**: Bcrypt password hashing and role-based access

### Core Functionality
- **Dashboard**: Real-time production monitoring
- **Batch Management**: Complete batch lifecycle tracking
- **Quality Control**: QC testing and results management
- **Alerts System**: Real-time alerts and notifications
- **User Management**: Role-based access control
- **Admin Panel**: System administration tools

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Radix UI
- **Real-time**: Socket.io
- **Animations**: Framer Motion
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

1. **Clone and setup**:
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Database setup**:
   ```bash
   # Update .env.local with your PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/pageify_db"
   
   # Generate Prisma client and push schema
   npm run db:generate
   npm run db:push
   ```

3. **Environment variables**:
   ```bash
   # Copy and update .env.local
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🎨 New Design Features

### Enhanced Color Scheme
- **Primary**: Purple (#8B5CF6) - Modern and professional
- **Success**: Green (#059669) - Positive actions and status
- **Warning**: Amber (#F59E0B) - Attention needed
- **Critical**: Red (#DC2626) - Urgent issues
- **Dark Theme**: Improved contrast and readability

### UI Improvements
- **Glass Effect**: Subtle backdrop blur effects
- **Smooth Animations**: Framer Motion transitions
- **Enhanced Cards**: Better shadows and hover effects
- **Status Indicators**: Color-coded badges and indicators
- **Responsive Design**: Optimized for all screen sizes

## 🔄 Real-time Features

### WebSocket Integration
- **Live Dashboard**: Real-time metrics updates
- **Batch Monitoring**: Live progress tracking
- **Alert Notifications**: Instant alert delivery
- **System Status**: Live system health monitoring

### API Endpoints
- `GET/POST /api/batches` - Batch management
- `GET/POST /api/alerts` - Alert system
- `POST /api/users/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - Authentication

## 🔐 Security Features

- **Role-based Access**: Admin, Supervisor, Operator, QC Officer roles
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt encryption
- **API Protection**: Session-based API security
- **Input Validation**: Zod schema validation

## 📱 Mobile Optimization

- **Responsive Layout**: Mobile-first design approach
- **Touch-friendly**: Optimized button sizes and spacing
- **Progressive Enhancement**: Works on all devices
- **Performance**: Optimized loading and rendering

## 🚀 Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Database migration**:
   ```bash
   npm run db:migrate
   ```

## 📊 Performance Features

- **Server-side Rendering**: Fast initial page loads
- **Static Generation**: Optimized static assets
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js image optimization
- **Caching**: Intelligent caching strategies

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

## 🎯 Key Improvements Over Original

1. **Modern Architecture**: Next.js 14 with App Router
2. **Enhanced Performance**: Server-side rendering and optimization
3. **Better UX**: Improved animations and interactions
4. **Real-time Data**: WebSocket integration for live updates
5. **Type Safety**: Full TypeScript implementation with Prisma
6. **Scalability**: Better database design and API structure
7. **Security**: Enhanced authentication and authorization
8. **Mobile Experience**: Fully responsive design

## 📈 Future Enhancements

- **Analytics Dashboard**: Advanced reporting and analytics
- **Mobile App**: React Native companion app
- **AI Integration**: Predictive maintenance and quality control
- **Advanced Notifications**: Email and SMS alerts
- **Multi-tenant**: Support for multiple facilities
- **API Documentation**: Swagger/OpenAPI documentation

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.