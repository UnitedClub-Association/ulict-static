document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup
    if (typeof feather !== 'undefined') feather.replace();

    // GSAP Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".form-header", 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(".form-wrapper", 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.8 }, 
        "-=0.5"
    )
    .fromTo(".form-section", 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, stagger: 0.2, duration: 0.6 }, 
        "-=0.5"
    );

    // 2. Elements
    const form = document.getElementById('ulic-application-form');
    const formContainer = document.getElementById('application-form-container');
    const successScreen = document.getElementById('success-screen');
    const displayToken = document.getElementById('display-token');
    const loadingOverlay = document.getElementById('loading-overlay');
    const phoneticToggle = document.getElementById('phonetic-mode');
    
    // Print Elements
    const printDate = document.getElementById('print-date');
    const printDate2 = document.getElementById('print-date-2');
    const tokenRefs = document.querySelectorAll('.print-token-ref');

    // 3. Phonetic Typing Logic (Google Input Tools API)
    const banglaInputs = document.querySelectorAll('.bangla-input');

    banglaInputs.forEach(input => {
        input.addEventListener('keydown', async (e) => {
            // Check if Phonetic Mode is ON and key is SPACE
            if (!phoneticToggle.checked || e.code !== 'Space') return;

            const cursorPosition = input.selectionStart;
            const text = input.value;
            
            // Get the last word before cursor
            const leftPart = text.slice(0, cursorPosition);
            const words = leftPart.split(" ");
            const lastWord = words[words.length - 1];

            // If valid word to convert
            if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
                e.preventDefault(); // Stop default space insertion temporarily
                
                try {
                    // Google Input Tools API
                    const response = await fetch(`https://www.google.com/inputtools/request?text=${lastWord}&itc=bn-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`);
                    const data = await response.json();
                    
                    if (data[0] === 'SUCCESS' && data[1][0][1][0]) {
                        const banglaWord = data[1][0][1][0];
                        
                        // Replace English word with Bangla word
                        const newText = leftPart.slice(0, -lastWord.length) + banglaWord + " " + text.slice(cursorPosition);
                        input.value = newText;
                        
                        // Fix cursor position
                        const newCursorPos = (leftPart.slice(0, -lastWord.length) + banglaWord + " ").length;
                        input.setSelectionRange(newCursorPos, newCursorPos);
                    } else {
                        // Fallback: Just add space if API fails/returns nothing
                        input.value = leftPart + " " + text.slice(cursorPosition);
                        input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                    }
                } catch (err) {
                    console.error("Phonetic typing error:", err);
                    // Fallback on error
                    input.value = leftPart + " " + text.slice(cursorPosition);
                    input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                }
            }
        });
    });

    // 4. Handle Submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate
            if (!validateForm()) return;

            // Start Loading Animation
            loadingOverlay.style.display = 'flex';
            
            // Simulate API Call delay (2.5 seconds)
            setTimeout(() => {
                // Generate Token
                const token = Math.floor(100000 + Math.random() * 900000);
                
                // Populate Print Data
                populatePrintArea(token);

                // Hide Loader
                loadingOverlay.style.display = 'none';

                // Transition to Success
                gsap.to(formContainer, {
                    duration: 0.5,
                    opacity: 0,
                    scale: 0.9,
                    onComplete: () => {
                        formContainer.style.display = 'none';
                        successScreen.style.display = 'block';
                        displayToken.textContent = token;
                        
                        // Animate Success Screen In
                        gsap.fromTo(successScreen, 
                            { opacity: 0, scale: 0.9, y: 20 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
                        );

                        // Trigger Checkmark Draw (Anime.js handles css animation class mostly, but we can ensure it plays)
                    }
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });

            }, 2500);
        });
    }

    // Validation
    function validateForm() {
        // Phone: 10 digits only
        const phoneInput = document.getElementById('phone');
        const phoneVal = phoneInput.value.trim();
        const phoneRegex = /^\d{10}$/; // Exactly 10 digits

        if (!phoneRegex.test(phoneVal)) {
            alert("Invalid Phone Number.\nPlease enter exactly 10 digits excluding +880.\nExample: 1712345678");
            phoneInput.focus();
            return false;
        }

        // Bangla: If phonetic mode is OFF, ensure user didn't type English in Bangla fields
        if (!phoneticToggle.checked) {
             const banglaRegex = /^[\u0980-\u09FF\s]+$/;
             const nameBn = document.getElementById('nameBn');
             if (nameBn.value.trim() !== "" && !banglaRegex.test(nameBn.value.trim())) {
                 alert("Please use Bangla characters for Bangla Name fields, or enable 'Phonetic Typing' mode.");
                 nameBn.focus();
                 return false;
             }
        }

        return true;
    }

    // Populate Data
    function populatePrintArea(token) {
        const dateStr = new Date().toLocaleDateString();
        if(printDate) printDate.innerText = dateStr;
        if(printDate2) printDate2.innerText = dateStr;

        tokenRefs.forEach(el => el.innerText = token);

        const fields = [
            'nameEn', 'nameBn', 'email', 'fatherEn', 'fatherBn', 
            'motherEn', 'motherBn', 'classSelect', 'versionSelect', 
            'sectionSelect', 'address'
        ];

        fields.forEach(id => {
            const el = document.getElementById(id);
            const pEl = document.getElementById(`p-${id.replace('Select', '')}`);
            if (el && pEl) pEl.innerText = el.value;
        });

        // Special handling for Phone
        const phoneVal = document.getElementById('phone').value;
        const pPhone = document.getElementById('p-phone');
        if(pPhone) pPhone.innerText = "+880" + phoneVal;
    }

    // JSON Download
    const btnDownloadJSON = document.getElementById('btn-download-json');
    if (btnDownloadJSON) {
        btnDownloadJSON.addEventListener('click', () => {
            const formData = {
                meta: {
                    token: displayToken.textContent,
                    generatedAt: new Date().toISOString()
                },
                applicant: {
                    nameEn: document.getElementById('nameEn').value,
                    nameBn: document.getElementById('nameBn').value,
                    email: document.getElementById('email').value,
                    phone: "+880" + document.getElementById('phone').value // Append prefix
                },
                family: {
                    fatherEn: document.getElementById('fatherEn').value,
                    fatherBn: document.getElementById('fatherBn').value,
                    motherEn: document.getElementById('motherEn').value,
                    motherBn: document.getElementById('motherBn').value
                },
                academic: {
                    class: document.getElementById('classSelect').value,
                    version: document.getElementById('versionSelect').value,
                    section: document.getElementById('sectionSelect').value,
                    address: document.getElementById('address').value
                },
                additional: {
                    reason: document.getElementById('reason').value
                }
            };

            const blob = new Blob([JSON.stringify(formData, null, 4)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ULIC_Application_${formData.meta.token}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Manual Print
    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }
});