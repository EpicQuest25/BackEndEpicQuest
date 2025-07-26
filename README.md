# EpicQuest Backend

A NestJS backend for the EpicQuest travel booking platform, providing APIs for hotel and flight booking, payment processing, and user management.

## Features

- **User Management**: Registration, authentication, and profile management
- **Hotel Booking**: Search, view details, and book hotels via Hotelbeds API
- **Flight Booking**: Search, view details, and book flights via Amadeus API
- **Payment Processing**: Secure payment processing via Adyen
- **Admin Dashboard**: Manage users, bookings, and system settings
- **Agent Portal**: For travel agents to manage bookings and clients
- **Supplier Management**: Manage hotel and flight suppliers
- **Notification System**: Email notifications for bookings and account activities

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Payment Gateway**: Adyen
- **Email Service**: Nodemailer
- **Cloud Storage**: Google Cloud Storage

## Project Structure

```
src/
├── admin/                  # Admin module
├── agent/                  # Agent module
├── airports/               # Airports data and services
├── authentication/         # Authentication module
├── booking/                # Booking module
├── currency/               # Currency module
├── flight/                 # Flight module
├── hotel/                  # Hotel module
├── migrations/             # Database migrations
├── notification/           # Notification module
├── payment-gateway/        # Payment gateway integration
├── supplier/               # Supplier module
├── tour-package/           # Tour package module
├── transaction/            # Transaction module
├── upload/                 # File upload module
├── user/                   # User module
├── app.module.ts           # Main application module
└── main.ts                 # Application entry point
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/epicquest-backend.git
   cd epicquest-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_TIME=86400
   
   # Database
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=epicquest
   
   # Adyen Payment Gateway
   ADYEN_API_URL=https://checkout-test.adyen.com
   ADYEN_API_KEY=your_adyen_api_key
   ADYEN_MERCHANT_ACCOUNT=your_merchant_account
   
   # Hotelbeds API
   HOTELBED_BASE_URL=https://api.test.hotelbeds.com
   HOTELBED_API_KEY=your_hotelbeds_api_key
   HOTELBED_SECRET=your_hotelbeds_secret
   
   # Amadeus API
   AMADUES_BASE_URL=https://test.api.amadeus.com
   AMADUES_API_KEY=your_amadeus_api_key
   AMADUES_SECRET=your_amadeus_secret
   ```

## Running the App

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Deployment

The application is configured for deployment to [Render](https://render.com/) using the `render.yaml` file. To deploy:

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically deploy the application based on the configuration in `render.yaml`

## Database Migrations

```bash
# Generate a migration
npm run typeorm:generate -- -n MigrationName

# Run migrations
npm run typeorm:run
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
