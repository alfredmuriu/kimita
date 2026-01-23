# Agrikima Website

Kenya's leading provider of Agriculture and Veterinary products.

## Project Structure

This is a Next.js 14 project with the following structure:

```
project/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── products/     # Products page
│   │   └── downloads/    # Downloads page
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── BackToTop.tsx
│   └── styles/           # Global styles
├── public/               # Static assets
│   ├── images/          # Images
│   ├── products/        # Product images
│   ├── css/             # Stylesheets
│   └── js/              # JavaScript files
└── package.json         # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Extract the project files
2. Navigate to the project directory:
   ```bash
   cd project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Start Production Server

After building, start the production server:

```bash
npm start
```

## Features

- **Home Page**: Company overview with hero section, about section, and contact information
- **Products Page**: Three categories of products:
  - Natural Solutions (8 products)
  - Supplements (9 products)
  - Feed Additives (6 products)
- **Downloads Page**: Resources for dairy and poultry farming
- **Responsive Design**: Mobile-friendly layout
- **Interactive Modals**: Product details in popup modals

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- CSS3

## Contact

- Email: info@agrikima.co.ke
- Phone: +254 20 2089181
- Website: https://agrikima.co.ke

## License

All rights reserved - Agrikima Ltd.
