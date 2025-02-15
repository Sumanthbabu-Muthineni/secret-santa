const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const AssignmentGenerator = require('./core/assignmentGenerator');
const Validator = require('./core/validator');
const FileHandler = require('./utils/fileHandler');
const logger = require('./utils/logger');

class SecretSantaApp {
    constructor() {
        this.generator = new AssignmentGenerator();
        this.validator = new Validator();
        this.fileHandler = new FileHandler();
    }

    async run(employeesFile, previousAssignmentsFile, outputFile) {
        try {
            logger.info('Starting Secret Santa assignment process');

            // Read and validate employees
            const employees = await this.fileHandler.readCSV(employeesFile);
            this.validator.validateEmployees(employees);
            logger.info(`Validated ${employees.length} employees`);

            // Handle previous assignments
            let previousAssignments = [];
            if (previousAssignmentsFile) {
                previousAssignments = await this.fileHandler.readCSV(previousAssignmentsFile);
                this.validator.validatePreviousAssignments(previousAssignments);
                logger.info(`Loaded ${previousAssignments.length} previous assignments`);
            }

            // Generate new assignments
            const assignments = this.generator.generateAssignments(
                employees,
                previousAssignments
            );
            logger.info('Successfully generated new assignments');

            // Save results
            await this.fileHandler.writeCSV(outputFile, assignments);
            logger.info(`Saved assignments to ${outputFile}`);

            return assignments;
        } catch (error) {
            logger.error(`Process failed: ${error.message}`);
            throw error;
        }
    }
}

if (require.main === module) {
    // Set up Express app
    const app = express();
    const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploads

    // Serve static files from 'public' directory
    app.use(express.static('public'));

    // Handle file upload and assignment generation
    app.post('/generate', upload.fields([
        { name: 'employees', maxCount: 1 },
        { name: 'previous', maxCount: 1 }
    ]), async (req, res) => {
        try {
            const santaApp = new SecretSantaApp();
            
            if (!req.files || !req.files.employees) {
                throw new Error('Employees file is required');
            }

            // Get uploaded file paths
            const employeesFile = req.files.employees[0].path;
            const previousFile = req.files.previous ? req.files.previous[0].path : null;
            const outputFile = path.join('uploads', 'output.csv');

            // Run the Secret Santa process
            await santaApp.run(employeesFile, previousFile, outputFile);

            // Read the output file
            const output = await fs.readFile(outputFile);

            // Set response headers for file download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=secret_santa_assignments.csv');
            
            // Send the file
            res.send(output);

            // Clean up temporary files
            await fs.unlink(employeesFile);
            if (previousFile) await fs.unlink(previousFile);
            await fs.unlink(outputFile);

        } catch (error) {
            logger.error('Error processing request:', error);
            res.status(500).send(error.message);
        }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = SecretSantaApp;