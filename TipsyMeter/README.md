
# TipsyCalculator

A web application for calculating and tracking alcohol consumption with points system.

## Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string

4. **Run database migrations** (if applicable)
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive credentials.

- All sensitive data uses environment variables
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template for required variables

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
└── migrations/      # Database migrations
```

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.
