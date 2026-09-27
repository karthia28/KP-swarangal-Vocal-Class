// ==========================================
// 1. LOAD SAVED LOGO & BANNER FROM LOCALSTORAGE
// ==========================================
window.addEventListener('load', () => {
    const savedLogo = localStorage.getItem('kp_swarangal_logo');
    if (savedLogo) {
        document.getElementById('logoImg').src = savedLogo;
    }

    const savedBanner = localStorage.getItem('kp_swarangal_banner');
    if (savedBanner) {
        const header = document.getElementById('headerBanner');
        header.style.backgroundImage = `linear-gradient(to bottom, rgba(26, 15, 46, 0.85), rgba(75, 46, 131, 0.9)), url('${savedBanner}')`;
    }

    const initialActive = document.querySelector('.tab-link.active');
    if (initialActive) updateTabIndicator(initialActive);
});

// ==========================================
// 2. FLUID SLIDING TAB INITIALIZATION
// ==========================================
function updateTabIndicator(activeButton) {
    const indicator = document.getElementById('tabIndicator');
    indicator.style.left = activeButton.offsetLeft + 'px';
    indicator.style.width = activeButton.offsetWidth + 'px';
}

window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-link.active');
    if (activeBtn) updateTabIndicator(activeBtn);
});

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active-tab");
    }
    
    const tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active-tab");
    evt.currentTarget.classList.add("active");
    
    updateTabIndicator(evt.currentTarget);
}

// ==========================================
// 3. IMAGE UPLOAD & PERSISTENCE
// ==========================================
document.getElementById('logoUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            localStorage.setItem('kp_swarangal_logo', base64Data); // Save permanently
            
            const logo = document.getElementById('logoImg');
            logo.style.transform = 'scale(0.5)';
            setTimeout(() => {
                logo.src = base64Data;
                logo.style.transform = 'scale(1)';
            }, 200);
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('bannerUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            localStorage.setItem('kp_swarangal_banner', base64Data); // Save permanently

            const header = document.getElementById('headerBanner');
            header.style.opacity = '0.5';
            setTimeout(() => {
                header.style.backgroundImage = `linear-gradient(to bottom, rgba(26, 15, 46, 0.85), rgba(75, 46, 131, 0.9)), url('${base64Data}')`;
                header.style.opacity = '1';
            }, 300);
        }
        reader.readAsDataURL(file);
    }
});

// ==========================================
// 4. STRICT INVOICE GENERATION LOGIC
// ==========================================
document.getElementById('recordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Generating Invoice... ✦";
    
    setTimeout(() => {
        const studentName = document.getElementById('studentName').value;
        const billingMonth = document.getElementById('billingMonth').value;
        const ratePerClass = parseFloat(document.getElementById('ratePerClass').value);
        
        let totalAmount = 0;
        const docTableBody = document.getElementById('docTableBody');
        docTableBody.innerHTML = ""; 

        const receiptId = 'INV-' + Math.floor(Math.random() * 100000);
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        for(let i = 1; i <= 4; i++) {
            const classDateInput = document.getElementById('class' + i).value;
            const classDate = classDateInput ? new Date(classDateInput).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : '-';
            const status = document.getElementById('status' + i).value;
            
            let charge = 0; 
            let badgeClass = '';

            // STRICT LOGIC: ONLY "Attended" charges a fee. EVERYTHING else is $0.
            if(status === 'Attended') {
                charge = ratePerClass;
                badgeClass = 'status-attended';
            } else if (status === 'Student Absence') {
                charge = 0; 
                badgeClass = 'status-absence';
            } else if (status === 'No Class') {
                charge = 0; 
                badgeClass = 'status-cancelled';
            } else if (status === 'Class Cancelled') {
                charge = 0; 
                badgeClass = 'status-cancelled';
            }

            totalAmount += charge;

            const row = `<tr style="animation: fadeInUp 0.5s ease ${i * 0.15}s forwards; opacity: 0;">
                <td>${classDate}</td>
                <td><span class="status-badge ${badgeClass}">${status}</span></td>
                <td style="text-align:right;">${charge.toFixed(2)}</td>
            </tr>`;
            docTableBody.innerHTML += row;
        }

        document.getElementById('docId').innerText = receiptId;
        document.getElementById('docDate').innerText = today;
        document.getElementById('docName').innerText = studentName;
        document.getElementById('docMonth').innerText = billingMonth;
        document.getElementById('docGrandTotal').innerText = '$' + totalAmount.toFixed(2);

        const ledgerBody = document.getElementById('ledgerBody');
        if(ledgerBody.innerHTML.includes('No records generated yet.')) { 
            ledgerBody.innerHTML = ''; 
        }
        
        const ledgerRow = `<tr>
            <td>${receiptId}</td>
            <td>${billingMonth}</td>
            <td>${studentName}</td>
            <td>${ratePerClass.toFixed(2)}</td>
            <td style="color:var(--primary); font-weight:700;">$${totalAmount.toFixed(2)}</td>
        </tr>`;
        ledgerBody.innerHTML += ledgerRow;

        btn.innerHTML = originalText;
        document.getElementById('docTabBtn').click();
        document.getElementById('recordForm').reset();
    }, 600); 
});
