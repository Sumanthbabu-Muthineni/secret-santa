class AssignmentGenerator {
    constructor() {
        this.assignments = new Map();
    }

    generateAssignments(employees, previousAssignments = []) {
        // Reset assignments
        this.assignments.clear();
        
        // Track assigned recipients to ensure no duplicates
        const assignedRecipients = new Set();
        const availableRecipients = [...employees];

        // Create map of previous assignments using email IDs
        const prevAssignMap = new Map(
            previousAssignments.map(a => [a.Employee_EmailID, a.Secret_Child_EmailID])
        );

        // For each employee, find a valid recipient
        for (const giver of employees) {
            // Filter valid recipients:
            // 1. Not the same person (check by email)
            // 2. Not previously assigned
            // 3. Not already assigned in this round
            const validRecipients = availableRecipients.filter(recipient => 
                recipient.Employee_EmailID !== giver.Employee_EmailID && 
                recipient.Employee_EmailID !== prevAssignMap.get(giver.Employee_EmailID) &&
                !assignedRecipients.has(recipient.Employee_EmailID)
            );

            if (validRecipients.length === 0) {
                // If no valid recipients, restart the process
                return this.generateAssignments(employees, previousAssignments);
            }

            // Randomly select a recipient
            const randomIndex = Math.floor(Math.random() * validRecipients.length);
            const recipient = validRecipients[randomIndex];

            // Update tracking
            assignedRecipients.add(recipient.Employee_EmailID);
            const recipientIndex = availableRecipients.findIndex(
                r => r.Employee_EmailID === recipient.Employee_EmailID
            );
            availableRecipients.splice(recipientIndex, 1);

            // Store assignment
            this.assignments.set(giver.Employee_EmailID, recipient);
        }

        // Verify no duplicate recipients
        const recipientEmails = new Set();
        for (const recipient of this.assignments.values()) {
            if (recipientEmails.has(recipient.Employee_EmailID)) {
                // If we find a duplicate, regenerate assignments
                return this.generateAssignments(employees, previousAssignments);
            }
            recipientEmails.add(recipient.Employee_EmailID);
        }

        return this.formatAssignments(employees);
    }

    formatAssignments(employees) {
        return employees.map(employee => {
            const recipient = this.assignments.get(employee.Employee_EmailID);
            if (!recipient) {
                throw new Error(`No recipient assigned for ${employee.Employee_EmailID}`);
            }
            return {
                Employee_Name: employee.Employee_Name,
                Employee_EmailID: employee.Employee_EmailID,
                Secret_Child_Name: recipient.Employee_Name,
                Secret_Child_EmailID: recipient.Employee_EmailID
            };
        });
    }
}

module.exports = AssignmentGenerator;
