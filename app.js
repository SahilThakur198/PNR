// Railway PNR Checker Application
class PNRChecker {
    constructor() {
        this.pnrInput = document.getElementById('pnrInput');
        this.checkBtn = document.getElementById('checkBtn');
        this.results = document.getElementById('results');
        this.spinner = document.getElementById('spinner');
        
        this.initializeEventListeners();
        this.loadSearchHistory();
    }

    initializeEventListeners() {
        this.checkBtn.addEventListener('click', () => this.handleCheck());
        this.pnrInput.addEventListener('input', (e) => {
            this.validatePNR(e.target.value);
            e.target.classList.toggle('invalid-pnr', !this.validatePNR(e.target.value));
        });
    }

    validatePNR(pnr) {
        const cleanPNR = pnr.replace(/\D/g, '');
        this.pnrInput.value = cleanPNR;
        const isValid = cleanPNR.length === 10;
        this.checkBtn.disabled = !isValid;
        return isValid;
    }

    async handleCheck() {
        this.toggleLoading(true);
        const pnrInput = this.pnrInput.value;
        const resultsDiv = this.results;
        const spinner = this.spinner;

        // Validate PNR input
        if (pnrInput.length !== 10 || isNaN(pnrInput)) {
            alert('Please enter a valid 10-digit PNR number.');
            this.toggleLoading(false);
            return;
        }

        // Show spinner
        spinner.classList.remove('hidden');

        try {
            const response = await fetch(`https://pnr-status-indian-railway.p.rapidapi.com/${pnrInput}`, {
                method: 'GET',
                headers: {
                    'X-Rapidapi-Key': 'd36ebb001bmsha1b0407b24e8741p1d1453jsn958c63b59489',
                    'X-Rapidapi-Host': 'pnr-status-indian-railway.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PNR status. Please try again later.');
            }

            const data = await response.json();

            // Display results
            resultsDiv.innerHTML = `
                <h2 class="text-xl font-bold mb-4">PNR Status</h2>
                <pre class="bg-gray-100 p-4 rounded-lg">${JSON.stringify(data, null, 2)}</pre>
            `;
            resultsDiv.classList.remove('hidden');
        } catch (error) {
            alert(error.message);
        } finally {
            // Hide spinner
            spinner.classList.add('hidden');
            this.toggleLoading(false);
        }
    }

    toggleLoading(isLoading) {
        this.spinner.classList.toggle('hidden', !isLoading);
        this.checkBtn.disabled = isLoading;
    }

    // Additional functionality stubs
    saveToHistory(data) { /* LocalStorage implementation */ }
    loadSearchHistory() { /* History loading logic */ }
    showError(message) { /* Error display logic */ }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => new PNRChecker());