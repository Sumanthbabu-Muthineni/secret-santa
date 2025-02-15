const AssignmentGenerator = require('../src/core/assignmentGenerator');

describe('AssignmentGenerator', () => {
    let generator;
    
    beforeEach(() => {
        generator = new AssignmentGenerator();
    });

    const mockEmployees = [
        { Employee_Name: 'John Doe', Employee_EmailID: 'john@acme.com' },
        { Employee_Name: 'Jane Smith', Employee_EmailID: 'jane@acme.com' },
        { Employee_Name: 'Bob Wilson', Employee_EmailID: 'bob@acme.com' },
        { Employee_Name: 'Alice Brown', Employee_EmailID: 'alice@acme.com' }
    ];

    const mockPrevious = [
        {
            Employee_Name: 'John Doe',
            Employee_EmailID: 'john@acme.com',
            Secret_Child_Name: 'Jane Smith',
            Secret_Child_EmailID: 'jane@acme.com'
        },
        {
            Employee_Name: 'Jane Smith',
            Employee_EmailID: 'jane@acme.com',
            Secret_Child_Name: 'Bob Wilson',
            Secret_Child_EmailID: 'bob@acme.com'
        }
    ];

    test('generates valid assignments for all employees', () => {
        const assignments = generator.generateAssignments(mockEmployees);
        expect(assignments.length).toBe(mockEmployees.length);
        
        // Verify all fields are present
        assignments.forEach(assignment => {
            expect(assignment).toEqual(
                expect.objectContaining({
                    Employee_Name: expect.any(String),
                    Employee_EmailID: expect.any(String),
                    Secret_Child_Name: expect.any(String),
                    Secret_Child_EmailID: expect.any(String)
                })
            );
        });
    });

    test('no self-assignments', () => {
        const assignments = generator.generateAssignments(mockEmployees);
        assignments.forEach(assignment => {
            expect(assignment.Employee_EmailID).not.toBe(assignment.Secret_Child_EmailID);
        });
    });

    test('no duplicate recipients', () => {
        const assignments = generator.generateAssignments(mockEmployees);
        const recipients = assignments.map(a => a.Secret_Child_EmailID);
        const uniqueRecipients = new Set(recipients);
        expect(recipients.length).toBe(uniqueRecipients.size);
    });

    test('respects previous assignments', () => {
        const assignments = generator.generateAssignments(mockEmployees, mockPrevious);

        // Check that previous assignments are not repeated
        mockPrevious.forEach(prev => {
            const newAssignment = assignments.find(
                a => a.Employee_EmailID === prev.Employee_EmailID
            );
            expect(newAssignment.Secret_Child_EmailID)
                .not.toBe(prev.Secret_Child_EmailID);
        });
    });

    test('handles employees with same name but different emails', () => {
        const employeesWithDuplicateNames = [
            { Employee_Name: 'John Smith', Employee_EmailID: 'john.sr@acme.com' },
            { Employee_Name: 'John Smith', Employee_EmailID: 'john.jr@acme.com' },
            { Employee_Name: 'Alice Brown', Employee_EmailID: 'alice@acme.com' }
        ];

        const assignments = generator.generateAssignments(employeesWithDuplicateNames);
        
        // Verify unique assignments despite same names
        const recipients = assignments.map(a => a.Secret_Child_EmailID);
        const uniqueRecipients = new Set(recipients);
        expect(recipients.length).toBe(uniqueRecipients.size);
    });
});

