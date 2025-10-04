# Auto Group Generator

## Overview
The Auto Group Generator is a web application that allows users to easily divide a list of items into equal-sized groups. Users can input their items manually or import them from various file formats. The application also provides options to shuffle the list, generate groups, and export the results in PDF or Excel formats.

## Features
- **User Authentication**: Users can log in using manual authentication or Google authentication.
- **Group Generation**: Automatically divides a list of items into specified group sizes.
- **Import/Export**: Supports importing lists from .txt, .csv, .xlsx, and .xls files, and exporting results as PDF or Excel files.
- **Shuffle Functionality**: Randomly shuffles the list of items before grouping.

## Project Structure
```
autogroup-app
├── app
│   ├── page.tsx          # Main functionality for generating groups
│   ├── layout.tsx        # Layout structure for the application
│   ├── auth
│   │   ├── login.tsx     # Login functionality for authentication
│   │   └── callback.tsx   # Handles authentication callback from Google
├── components
│   ├── ui
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card component for displaying groups
│   │   ├── input.tsx     # Input component for user input
│   │   ├── label.tsx     # Label component for input fields
│   │   └── textarea.tsx   # Textarea component for multi-line input
│   └── AuthProvider.tsx   # Manages authentication state
├── lib
│   └── auth.ts           # Authentication-related functions
├── types
│   └── index.ts          # TypeScript types and interfaces
├── package.json           # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd autogroup-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.