// package.json
{
  "name": "secret-santa",
  "version": "1.0.0",
  "description": "Secret Santa Assignment Generator",
  "main": "src/index.js",
  "scripts": {
    "test": "jest",
    "start": "node src/index.js"
  },
  "dependencies": {
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}

// README.md
# Secret Santa Assignment Generator

A modular and extensible solution for generating Secret Santa assignments.

## Features

- CSV file input/output
- Previous assignment validation
- Comprehensive error handling
- Automated testing

## Installation

```bash
npm install
```

## Usage

```bash
node src/index.js <employees-file> [previous-assignments] <output-file>
```

Example:
```bash
node src/index.