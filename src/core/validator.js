class Validator {
    validateEmployee(employee) {
        if (!employee.Employee_Name || !employee.Employee_EmailID) {
            throw new Error('Missing required fields');
        }

        if (!this.isValidEmail(employee.Employee_EmailID)) {
            throw new Error(`Invalid email format for employee ${employee.Employee_Name}`);
        }
    }

    isValidEmail(email) {
        return email.includes('@') && email.includes('.');
    }

    validateEmployees(employees) {
        if (!Array.isArray(employees) || employees.length === 0) {
            throw new Error('Employees must be a non-empty array');
        }

        const emails = new Set();
        for (const employee of employees) {
            this.validateEmployee(employee);
            
            if (emails.has(employee.Employee_EmailID)) {
                throw new Error(`Duplicate email: ${employee.Employee_EmailID}`);
            }
            emails.add(employee.Employee_EmailID);
        }
    }

    // Add this method to validate previous assignments
    validatePreviousAssignments(assignments) {
        if (!Array.isArray(assignments)) {
            return true; // Optional input
        }

        const required = [
            'Employee_Name',
            'Employee_EmailID',
            'Secret_Child_Name',
            'Secret_Child_EmailID'
        ];
        
        for (const assignment of assignments) {
            for (const field of required) {
                if (!assignment[field]) {
                    throw new Error(`Missing field in previous assignment: ${field}`);
                }
            }
        }

        return true;
    }
}

module.exports = Validator;



