document.addEventListener("DOMContentLoaded", function () {
    // 1. Create Placeholder if it doesn't exist (safety check)
    let footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        footerPlaceholder = document.createElement("div");
        footerPlaceholder.id = "footer-placeholder";
        document.body.appendChild(footerPlaceholder);
    }

    // 2. Fetch the Footer HTML
    fetch("/components/footer.html")
        .then((response) => {
            if (!response.ok) throw new Error(`Footer load failed: ${response.status}`);
            return response.text();
        })
        .then((html) => {
            // Inject HTML
            footerPlaceholder.innerHTML = html;

            // 3. Initialize Features
            updateFooterYear();
            initializeFooterIcons();
        })
        .catch((error) => {
            console.error("ULIC Footer Error:", error);
            // Elegant Fallback
            footerPlaceholder.innerHTML = `
                <div style="background:#0B1120; color:#9CA3AF; padding:2rem; text-align:center; border-top:1px solid #333;">
                    <p>&copy; ${new Date().getFullYear()} ULIC. All rights reserved.</p>
                </div>`;
        });

    // Helper: Update Copyright Year
    function updateFooterYear() {
        const yearSpan = document.getElementById("copyright-year");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // Helper: Initialize Feather Icons
    function initializeFooterIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        } else {
            // Retry once if library is slow to load
            setTimeout(() => {
                if (typeof feather !== 'undefined') feather.replace();
            }, 500);
        }
    }
});