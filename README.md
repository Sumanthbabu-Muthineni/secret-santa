# Secret Santa Assignment Generator

A Node.js application that automates the process of assigning Secret Santa pairs for company events. The application includes both a command-line interface and a web interface for generating assignments.

## Features

- CSV file input/output for employee data
- Support for previous year's assignments to avoid repetition
- Web interface for easy file upload and download
- Comprehensive validation of input data
- Automated testing with Jest
- Detailed error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Structure

```
secret-santa/
├── public/
│   └── index.html          # Web interface
├── uploads/                # Temporary file storage
├── src/
│   ├── core/
│   │   ├── assignmentGenerator.js  # Assignment generation logic
│   │   └── validator.js            # Input validation
│   ├── utils/
│   │   ├── fileHandler.js          # File operations
│   │   └── logger.js               # Logging utility
│   └── index.js                    # Main application file
├── test/
│   ├── assignmentGenerator.test.js
│   └── validator.test.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd secret-santa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   ```

## Input File Format

### Employees CSV Format
```csv
Employee_Name,Employee_EmailID
John Doe,john@acme.com
Jane Smith,jane@acme.com
```

### Previous Assignments CSV Format (Optional)
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john@acme.com,Jane Smith,jane@acme.com
Jane Smith,jane@acme.com,Bob Wilson,bob@acme.com
```

## Usage

### Web Interface

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Use the web interface to:
   - Upload employees CSV file
   - Optionally upload previous assignments CSV
   - Download the generated assignments



## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Validation Rules

The application enforces several validation rules:

1. Employee Data:
   - Employee name and email are required
   - Email must be in valid format
   - No duplicate email addresses

2. Assignment Rules:
   - No self-assignments
   - No duplicate recipients
   - No repetition of previous year's assignments
   - Every employee must be assigned exactly one secret child

## Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Missing required fields
- Invalid email formats
- Duplicate entries
- File system errors
- Assignment generation failures

## Output Format

The generated CSV file will contain:
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john@acme.com,Alice Brown,alice@acme.com
Jane Smith,jane@acme.com,Bob Wilson,bob@acme.com
```
