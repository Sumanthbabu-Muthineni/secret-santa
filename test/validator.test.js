
const Validator = require('../src/core/validator');

describe('Validator', () => {
    let validator;
    
    beforeEach(() => {
        validator = new Validator();
    });

    describe('validateEmployee', () => {
        test('accepts valid employee', () => {
            const employee = {
                Employee_Name: 'John Doe',
                Employee_EmailID: 'john@acme.com'
            };
            expect(() => validator.validateEmployee(employee)).not.toThrow();
        });

        test('rejects missing name', () => {
            const employee = {
                Employee_EmailID: 'john@acme.com'
            };
            expect(() => validator.validateEmployee(employee))
                .toThrow('Missing required fields');
        });

        test('rejects missing email', () => {
            const employee = {
                Employee_Name: 'John Doe'
            };
            expect(() => validator.validateEmployee(employee))
                .toThrow('Missing required fields');
        });

        test('rejects invalid email format', () => {
            const employee = {
                Employee_Name: 'John Doe',
                Employee_EmailID: 'invalid-email'
            };
            expect(() => validator.validateEmployee(employee))
                .toThrow('Invalid email format');
        });

        test('accepts employee with same name but different email', () => {
            const employee1 = {
                Employee_Name: 'John Smith',
                Employee_EmailID: 'john.sr@acme.com'
            };
            const employee2 = {
                Employee_Name: 'John Smith',
                Employee_EmailID: 'john.jr@acme.com'
            };
            expect(() => validator.validateEmployee(employee1)).not.toThrow();
            expect(() => validator.validateEmployee(employee2)).not.toThrow();
        });
    });

    describe('validateEmployees', () => {
        test('accepts valid employee list', () => {
            const employees = [
                { Employee_Name: 'John Doe', Employee_EmailID: 'john@acme.com' },
                { Employee_Name: 'Jane Smith', Employee_EmailID: 'jane@acme.com' }
            ];
            expect(() => validator.validateEmployees(employees)).not.toThrow();
        });

        test('rejects empty array', () => {
            expect(() => validator.validateEmployees([]))
                .toThrow('Employees must be a non-empty array');
        });

        test('rejects duplicate emails', () => {
            const employees = [
                { Employee_Name: 'John Doe', Employee_EmailID: 'john@acme.com' },
                { Employee_Name: 'Jane Smith', Employee_EmailID: 'john@acme.com' }
            ];
            expect(() => validator.validateEmployees(employees))
                .toThrow('Duplicate email');
        });

        test('handles employees with same name but different emails', () => {
            const employees = [
                { Employee_Name: 'John Smith', Employee_EmailID: 'john.sr@acme.com' },
                { Employee_Name: 'John Smith', Employee_EmailID: 'john.jr@acme.com' }
            ];
            expect(() => validator.validateEmployees(employees)).not.toThrow();
        });
    });

    describe('validatePreviousAssignments', () => {
        test('accepts valid previous assignments', () => {
            const assignments = [
                {
                    Employee_Name: 'John Doe',
                    Employee_EmailID: 'john@acme.com',
                    Secret_Child_Name: 'Jane Smith',
                    Secret_Child_EmailID: 'jane@acme.com'
                }
            ];
            expect(() => validator.validatePreviousAssignments(assignments)).not.toThrow();
        });

        test('accepts empty previous assignments', () => {
            expect(() => validator.validatePreviousAssignments([])).not.toThrow();
        });

        test('rejects invalid assignment format', () => {
            const assignments = [
                {
                    Employee_Name: 'John Doe',
                    Employee_EmailID: 'john@acme.com'
                    // Missing Secret_Child fields
                }
            ];
            expect(() => validator.validatePreviousAssignments(assignments))
                .toThrow('Missing field in previous assignment');
        });
    });
});


