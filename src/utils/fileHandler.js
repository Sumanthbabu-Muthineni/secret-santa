const fs = require('fs').promises;
const Papa = require('papaparse');
const logger = require('./logger');

class FileHandler {
    async readCSV(filePath) {
        try {
            logger.info(`Reading file: ${filePath}`);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            
            return new Promise((resolve, reject) => {
                Papa.parse(fileContent, {
                    header: true,
                    skipEmptyLines: 'greedy',  // Skip empty lines and lines with only whitespace
                    transform: (value) => value.trim(), // Trim whitespace
                    complete: (results) => {
                        // Filter out any rows where Employee_Name is empty
                        const validData = results.data.filter(row => 
                            row.Employee_Name && row.Employee_Name.trim() !== ''
                        );
                        logger.info(`Successfully parsed ${validData.length} records`);
                        resolve(validData);
                    },
                    error: (error) => {
                        logger.error(`Failed to parse CSV: ${error.message}`);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            logger.error(`Error reading file: ${error.message}`);
            throw new Error(`Failed to read file ${filePath}: ${error.message}`);
        }
    }

    async writeCSV(filePath, data) {
        try {
            logger.info(`Writing to file: ${filePath}`);
            const csv = Papa.unparse(data);
            await fs.writeFile(filePath, csv);
            logger.info(`Successfully wrote ${data.length} records to ${filePath}`);
        } catch (error) {
            logger.error(`Error writing file: ${error.message}`);
            throw new Error(`Failed to write file ${filePath}: ${error.message}`);
        }
    }
}

module.exports = FileHandler;
