// Logic for switching tabs
function openTab(event, tabName) {
    // Hide all tab content
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active-tab");
    }

    // Remove 'active' class from all tab buttons
    let tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the specific tab content
    document.getElementById(tabName).classList.add("active-tab");
    
    // Add 'active' styling to the clicked button (or fallback for programmatic clicks)
    if(event) {
        event.currentTarget.classList.add("active");
    } else {
        document.getElementById("docTabBtn").classList.add("active");
    }
}

// Global array to store records temporarily in the browser memory
const records = {};

// Form submission logic
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recordForm");
    const ledgerBody = document.getElementById("ledgerBody");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent page reload

        // Capture basic data
        const name = document.getElementById("studentName").value;
        const rate = parseFloat(document.getElementById("ratePerClass").value);

        // Capture 4 Class Dates
        const classDates = [
            document.getElementById("class1").value,
            document.getElementById("class2").value,
            document.getElementById("class3").value,
            document.getElementById("class4").value
        ];

        // Format the billing month neatly (e.g., "September 2026")
        const rawMonth = document.getElementById("billingMonth").value;
        const [year, month] = rawMonth.split("-");
        const dateObj = new Date(year, month - 1);
        const formattedMonth = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Calculations & ID (4 classes total)
        const totalAmount = (rate * 4).toFixed(2);
        const now = new Date();
        const receiptId = "REC-" + now.getTime().toString().slice(-6);
        const issueDate = now.toLocaleDateString();

        // Store data in the global records object
        records[receiptId] = {
            id: receiptId,
            date: issueDate,
            name: name,
            month: formattedMonth,
            rate: rate.toFixed(2),
            classes: classDates,
            total: totalAmount
        };

        // Create a new row in the Ledger Tab
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><strong>${receiptId}</strong><br><small style="color: #888;">${issueDate}</small></td>
            <td><strong>${formattedMonth}</strong></td>
            <td>${name}</td>
            <td>$${rate.toFixed(2)}</td>
            <td><strong>$${totalAmount}</strong></td>
            <td>
                <button class="btn-view" onclick="generateDocument('${receiptId}')">📄 View Invoice</button>
            </td>
        `;

        // Insert at the top of the ledger table
        ledgerBody.insertBefore(newRow, ledgerBody.firstChild);
        
        // Clear the form fields for the next entry
        form.reset();
        
        // Auto-switch to the Ledger tab
        openTab({currentTarget: document.getElementsByClassName("tab-link")[1]}, 'LedgerTab');
    });
});

// Function to populate and open the Invoice & Receipt Document
function generateDocument(receiptId) {
    const data = records[receiptId];
    
    // Inject header data into the Document Tab
    document.getElementById("docId").innerText = data.id;
    document.getElementById("docDate").innerText = data.date;
    document.getElementById("docName").innerText = data.name;
    document.getElementById("docMonth").innerText = data.month;
    document.getElementById("docGrandTotal").innerText = "$" + data.total;

    // Inject 4 Class Rows dynamically into the invoice table
    const docTableBody = document.getElementById("docTableBody");
    docTableBody.innerHTML = ""; // clear previous rows
    
    data.classes.forEach((classDate, index) => {
        // Convert YYYY-MM-DD to a cleaner format (DD/MM/YYYY)
        const [cyear, cmonth, cday] = classDate.split("-");
        const cleanDate = `${cday}/${cmonth}/${cyear}`;

        // Build the HTML for each class row including the dropdown
        docTableBody.innerHTML += `
            <tr>
                <td><strong>${cleanDate}</strong></td>
                <td>Sangeetham Session ${index + 1}</td>
                <td>$${data.rate}</td>
                <td>
                    <select class="status-dropdown">
                        <option value="Unpaid">❌ Unpaid</option>
                        <option value="Paid">✅ Paid</option>
                    </select>
                </td>
            </tr>
        `;
    });

    // Switch view automatically to the Document Tab
    openTab(null, 'DocumentTab');
}