// Tab Navigation Logic
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all tab content
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active-tab");
    }
    
    // Remove "active" class from all tab buttons
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // Show current tab and add active class to button clicked
    document.getElementById(tabName).classList.add("active-tab");
    evt.currentTarget.className += " active";
}

// Form Submission & Invoice Generation Logic
document.getElementById('recordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get standard form data
    const studentName = document.getElementById('studentName').value;
    const billingMonth = document.getElementById('billingMonth').value;
    const ratePerClass = parseFloat(document.getElementById('ratePerClass').value);
    
    let totalAmount = 0;
    const docTableBody = document.getElementById('docTableBody');
    docTableBody.innerHTML = ""; // Clear previous records

    // Generate receipt ID and Date
    const receiptId = 'INV-' + Math.floor(Math.random() * 100000);
    const today = new Date().toLocaleDateString();

    // Process all 4 classes
    for(let i = 1; i <= 4; i++) {
        const classDate = document.getElementById('class' + i).value;
        const status = document.getElementById('status' + i).value;
        
        // Determine logic for billing: if cancelled or no class, we don't charge. 
        // If Attended or Student Absence, they still pay.
        let charge = ratePerClass;
        let badgeClass = 'status-attended';

        if(status === 'No Class' || status === 'Class Cancelled') {
            charge = 0; // Don't charge for these
            badgeClass = 'status-cancelled';
        } else if (status === 'Student Absence') {
            badgeClass = 'status-absence';
        }

        totalAmount += charge;

        // Add row to invoice table
        const row = `<tr>
            <td>${classDate}</td>
            <td><span class="status-badge ${badgeClass}">${status}</span></td>
            <td>${charge.toFixed(2)}</td>
        </tr>`;
        docTableBody.innerHTML += row;
    }

    // Update Invoice Document Text
    document.getElementById('docId').innerText = receiptId;
    document.getElementById('docDate').innerText = today;
    document.getElementById('docName').innerText = studentName;
    document.getElementById('docMonth').innerText = billingMonth;
    document.getElementById('docGrandTotal').innerText = totalAmount.toFixed(2);

    // Add to Ledger Tab
    const ledgerBody = document.getElementById('ledgerBody');
    if(ledgerBody.innerHTML.includes('No records yet')) { 
        ledgerBody.innerHTML = ''; 
    }
    
    const ledgerRow = `<tr>
        <td>${receiptId}</td>
        <td>${billingMonth}</td>
        <td>${studentName}</td>
        <td>${ratePerClass.toFixed(2)}</td>
        <td><strong>${totalAmount.toFixed(2)}</strong></td>
    </tr>`;
    ledgerBody.innerHTML += ledgerRow;

    // Automatically switch to Document Tab so the user sees the generated invoice
    document.getElementById('docTabBtn').click();
    
    // Optional: Reset form for the next student
    document.getElementById('recordForm').reset();
});
