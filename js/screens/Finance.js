import { getBottomNav } from '../components.js';

export default class Finance {
    constructor() {
        this.activeTab = 'simulator';
    }

    async render() {
        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        this.renderContent(div);
        return div;
    }

    renderContent(container) {
        container.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <h2 style="margin: 0;">Finance Suite</h2>
                <div class="neu-icon-btn" style="color: var(--primary-color);">
                    <i class="fa-solid fa-building-columns"></i>
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="flex-row gap-8 mb-24" style="overflow-x: auto; padding-bottom: 8px;">
                <button class="neu-button tab-btn ${this.activeTab === 'simulator' ? 'active-tab' : ''}" data-tab="simulator" style="padding: 12px 20px; font-size: 14px; white-space: nowrap;">Simulator</button>
                <button class="neu-button tab-btn ${this.activeTab === 'requirements' ? 'active-tab' : ''}" data-tab="requirements" style="padding: 12px 20px; font-size: 14px; white-space: nowrap;">Requirements</button>
                <button class="neu-button tab-btn ${this.activeTab === 'info' ? 'active-tab' : ''}" data-tab="info" style="padding: 12px 20px; font-size: 14px; white-space: nowrap;">Account Info</button>
            </div>
            
            <div id="tab-content" style="flex: 1; overflow-y: auto;">
                ${this.getTabContent()}
            </div>
            
            <div class="mt-24 mb-16 text-center" style="font-size: 12px; color: var(--text-secondary);">
                <i class="fa-solid fa-handshake" style="margin-right: 4px;"></i> Partnered with <strong>ASA International</strong>
            </div>
            
            ${getBottomNav('finance')}
            
            <style>
                .active-tab {
                    background: var(--primary-gradient);
                    color: white;
                }
            </style>
        `;
        
        this.attachListeners(container);
    }
    
    getTabContent() {
        if (this.activeTab === 'simulator') {
            return `
                <div class="neu-card">
                    <h4 class="mb-16">Microfinance Loan Simulator</h4>
                    <div class="flex-col gap-16">
                        <div>
                            <label style="font-size: 12px; margin-bottom: 4px; display: block;">Loan Amount (RWF)</label>
                            <input type="number" id="simAmount" class="neu-input" value="100000" step="10000">
                        </div>
                        <div>
                            <label style="font-size: 12px; margin-bottom: 4px; display: block;">Period (Weeks)</label>
                            <select id="simWeeks" class="neu-input" style="appearance: none;">
                                <option value="12">12 Weeks</option>
                                <option value="24" selected>24 Weeks</option>
                                <option value="48">48 Weeks</option>
                            </select>
                        </div>
                        
                        <div class="mt-16 p-16" style="background: var(--input-bg); border-radius: 12px; padding: 16px;">
                            <div class="flex-row justify-between mb-8">
                                <span style="font-size: 14px; color: var(--text-secondary);">Interest Rate</span>
                                <span style="font-weight: 600;">25% (Fixed)</span>
                            </div>
                            <div class="flex-row justify-between mb-16 pb-16" style="border-bottom: 1px dashed #ccc;">
                                <span style="font-size: 14px; color: var(--text-secondary);">Total Repayment</span>
                                <span id="simTotal" style="font-weight: 600; color: var(--primary-color);">RWF 125,000</span>
                            </div>
                            <div class="flex-row justify-between align-center">
                                <span style="font-size: 14px; font-weight: 600;">Weekly Installment</span>
                                <h3 id="simWeekly" class="gradient-text" style="margin: 0;">RWF 5,208</h3>
                            </div>
                        </div>
                        
                        <button class="neu-button primary mt-16">Apply for Loan</button>
                    </div>
                </div>
            `;
        } else if (this.activeTab === 'requirements') {
            return `
                <div class="neu-card">
                    <h4 class="mb-16">Loan Requirements</h4>
                    <ul style="padding-left: 20px; line-height: 1.6; color: var(--text-secondary);">
                        <li>Must be an active business operating for at least 6 months.</li>
                        <li>Valid National ID.</li>
                        <li>Consistent POS transaction history in Tunga for the last 30 days.</li>
                        <li>Must be part of a registered cooperative (Optional but recommended).</li>
                        <li>No outstanding defaults with ASA International.</li>
                    </ul>
                </div>
            `;
        } else if (this.activeTab === 'info') {
            return `
                <div class="neu-card">
                    <h4 class="mb-16">Savings & Account</h4>
                    <div class="flex-row justify-between align-center mb-16 p-16" style="background: var(--input-bg); border-radius: 12px; padding: 16px;">
                        <div>
                            <p style="font-size: 12px; margin-bottom: 4px;">Voluntary Savings</p>
                            <h3 style="margin: 0; color: var(--primary-color);">RWF 45,000</h3>
                        </div>
                        <div class="neu-icon-btn" style="width: 40px; height: 40px;"><i class="fa-solid fa-piggy-bank"></i></div>
                    </div>
                    <button class="neu-button" style="font-size: 14px;">Deposit to Savings</button>
                </div>
            `;
        }
    }

    attachListeners(container) {
        const tabs = container.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.renderContent(container);
            });
        });
        
        if (this.activeTab === 'simulator') {
            const amountInput = container.querySelector('#simAmount');
            const weeksSelect = container.querySelector('#simWeeks');
            const totalDisplay = container.querySelector('#simTotal');
            const weeklyDisplay = container.querySelector('#simWeekly');
            
            const updateSim = () => {
                const amount = parseFloat(amountInput.value) || 0;
                const weeks = parseInt(weeksSelect.value) || 24;
                
                const interest = 0.25; // 25% fixed
                const totalRepayment = amount + (amount * interest);
                const weekly = totalRepayment / weeks;
                
                totalDisplay.innerText = `RWF ${totalRepayment.toLocaleString()}`;
                weeklyDisplay.innerText = `RWF ${Math.round(weekly).toLocaleString()}`;
            };
            
            amountInput.addEventListener('input', updateSim);
            weeksSelect.addEventListener('change', updateSim);
        }
    }

    async afterRender() {}
}
