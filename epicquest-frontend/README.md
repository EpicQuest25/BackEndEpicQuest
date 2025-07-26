# EpicQuest Frontend

A React/Next.js frontend for the EpicQuest application with hotel and flight booking functionality based on Expedia-style references.

## Features

- Homepage with tab-based navigation between Hotels and Flights
- Search forms with location autocomplete, date pickers, traveler/room selectors, and class selection for flights
- Hotel flow: search results page, hotel detail page, checkout page
- Flight flow: flight search with trip type selection, results page, flight details page, booking confirmation
- Integration with backend APIs (Amadeus for flights, Hotelbeds for hotels, Adyen for payments)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Form Validation**: [Zod](https://github.com/colinhacks/zod)
- **UI Components**: Custom components with [Headless UI](https://headlessui.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Date Handling**: [React DatePicker](https://reactdatepicker.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## Project Structure

```
epicquest-frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx            # Homepage
│   ├── hotels/             # Hotel pages
│   │   ├── page.tsx        # Hotel search results
│   │   ├── [id]/           # Hotel details
│   │   └── checkout/       # Hotel checkout
│   ├── flights/            # Flight pages
│   │   ├── page.tsx        # Flight search results
│   │   ├── [id]/           # Flight details
│   │   └── checkout/       # Flight checkout
│   └── payment/            # Payment pages
├── components/             # React components
│   ├── ui/                 # UI components
│   ├── forms/              # Form components
│   ├── hotels/             # Hotel-specific components
│   ├── flights/            # Flight-specific components
│   └── layout/             # Layout components
├── lib/                    # Utility functions
│   ├── api/                # API integration
│   ├── hooks/              # Custom hooks
│   └── utils/              # Utility functions
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/epicquest-frontend.git
   cd epicquest-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

## Deployment to Render

This project is configured for deployment to [Render](https://render.com/) as a static site.

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. In Render, create a new Web Service
3. Select "Static Site" as the service type
4. Connect your Git repository
5. Configure the service:
   - Build Command: `npm run build`
   - Publish Directory: `out`
6. Add the following environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your backend API

Alternatively, you can use the `render.yaml` file in the root directory to configure your deployment:

```bash
render blueprint apply
```

## API Integration

The frontend integrates with the following APIs:

- **Amadeus API**: For flight search, booking, and management
- **Hotelbeds API**: For hotel search, booking, and management
- **Adyen API**: For payment processing

API integration is handled through the backend services, which are accessed via the following endpoints:

- Hotel API: `/hotel/*`
- Flight API: `/flight/*`
- Payment API: `/payment-gateway/*`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
