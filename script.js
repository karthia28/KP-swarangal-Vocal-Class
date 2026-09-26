// Logic for switching tabs
function openTab(event, tabName) {
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active-tab");
    }

    let tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active-tab");
    
    if(event) {
        event.currentTarget.classList.add("active");
    } else {
        document.getElementById("docTabBtn").classList.add("active");
    }
}

// Global array to store records temporarily
const records = {};

// Form submission logic
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("recordForm");
    const ledgerBody = document.getElementById("ledgerBody");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

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

        // Format month
        const rawMonth = document.getElementById("billingMonth").value;
        const [year, month] = rawMonth.split("-");
        const dateObj = new Date(year, month - 1);
        const formattedMonth = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Calculations & ID
        const totalAmount = (rate * 4).toFixed(2);
        const now = new Date();
        const receiptId = "REC-" + now.getTime().toString().slice(-6);
        const issueDate = now.toLocaleDateString();

        // Store data
        records[receiptId] = {
            id: receiptId,
            date: issueDate,
            name: name,
            month: formattedMonth,
            rate: rate.toFixed(2),
            classes: classDates,
            total: totalAmount
        };

        // Create Ledger Row
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

        ledgerBody.insertBefore(newRow, ledgerBody.firstChild);
        form.reset();
        
        // Auto-switch to ledger
        openTab({currentTarget: document.getElementsByClassName("tab-link")[1]}, 'LedgerTab');
    });
});

// Function to populate and open the Invoice Document
function generateDocument(receiptId) {
    const data = records[receiptId];
    
    // Inject header data
    document.getElementById("docId").innerText = data.id;
    document.getElementById("docDate").innerText = data.date;
    document.getElementById("docName").innerText = data.name;
    document.getElementById("docMonth").innerText = data.month;
    document.getElementById("docGrandTotal").innerText = "$" + data.total;

    // Inject 4 Class Rows dynamically with Dropdowns
    const docTableBody = document.getElementById("docTableBody");
    docTableBody.innerHTML = ""; // clear previous rows
    
    data.classes.forEach((classDate, index) => {
        // Convert YYYY-MM-DD to DD/MM/YYYY
        const [cyear, cmonth, cday] = classDate.split("-");
        const cleanDate = `${cday}/${cmonth}/${cyear}`;

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

    // Switch to Document Tab
    openTab(null, 'DocumentTab');
}
