const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* HOME PAGE - View in Browser */
app.get("/", (req, res) => {
    res.send(`
        <h2>Support Ticket Generator</h2>
        <form action="/complain" method="POST">
            <label>Name:</label><br>
            <input type="text" name="name" required /><br><br>

            <label>Issue:</label><br>
            <textarea name="issue" required></textarea><br><br>

            <label>Priority:</label><br>
            <select name="priority">
                <option value="normal">Normal</option>
                <option value="high">High</option>
            </select><br><br>

            <button type="submit">Submit Complaint</button>
        </form>
    `);
});

/* COMPLAIN ROUTE */
app.post("/complain", (req, res) => {
    const { name, issue, priority } = req.body;

    const ticketId = "TKT-" + Math.floor(Math.random() * 100000);

    const complaintData = `
Ticket ID: ${ticketId}
Name: ${name}
Issue: ${issue}
Priority: ${priority}
--------------------------
`;

    if (priority === "high") {
        fs.appendFileSync("URGENT.txt", complaintData);
    } else {
        fs.appendFileSync("normal_complaints.txt", complaintData);
    }

    res.send(`
        <h3>Complaint Submitted Successfully</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p>We will solve your issue soon.</p>
        <a href="/">Go Back</a>
    `);
});

/* START SERVER */
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
