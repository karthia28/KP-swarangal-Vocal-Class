// ==========================================
// 1. IMAGE UPLOAD LOGIC (Logo & Banner)
// ==========================================

// Handle Logo Upload
document.getElementById('logoUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logoImg').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Handle Banner Upload
document.getElementById('bannerUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const header = document.getElementById('headerBanner');
            // Keeps the purple/blue overlay, but swaps the image behind it
            header.style.backgroundImage = `linear-gradient(135deg, rgba(106,17,203,0.85), rgba(37,117,252,0.85)), url('${e.target.result}')`;
        }
        reader.readAsDataURL(file);
    }
});

// ==========================================
// 2. TAB NAVIGATION LOGIC
// ==========================================
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active-tab");
    }
    
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).classList.add("active-tab");
    evt.currentTarget.className += " active";
}

// ==========================================
// 3. FORM SUBMISSION & INVOICE CALCULATION
// ==========================================
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
        
        let charge = 0; // Default to zero
        let badgeClass = '';

        // FIX: ONLY "Attended" charges the fee.
        if(status === 'Attended') {
            charge = ratePerClass;
            badgeClass = 'status-attended';
        } else if (status === 'Student Absence') {
            charge = 0; 
            badgeClass = 'status-absence';
        } else if (status === 'No Class') {
            charge = 0;
            badgeClass = 'status-noclass';
        } else if (status === 'Class Cancelled') {
            charge = 0;
            badgeClass = 'status-cancelled';
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
