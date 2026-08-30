import { store } from '../store.js';

export default class Auth {
    constructor() {
        this.phone = '';
        this.name = '';
        // Check if user already exists
        const state = store.getState();
        this.isLogin = !!(state.user && state.user.phone);
    }

    async render() {
        const div = document.createElement('div');
        div.className = 'screen flex-col justify-between';
        
        div.innerHTML = `
            <div class="mt-24">
                <h1 class="text-center gradient-text" style="font-size: 32px;">${this.isLogin ? 'Welcome back' : 'Create Account'}</h1>
                <p class="text-center mt-16" style="margin-bottom: 32px;">
                    ${this.isLogin ? 'Enter your phone number to continue' : 'Enter your details to get started'}
                </p>
                
                ${!this.isLogin ? `
                    <div class="neu-card mb-16">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px;">Name (Shop Name)</label>
                        <input type="text" id="nameInput" class="neu-input" placeholder="e.g. John Doe / My Supermarket">
                    </div>
                ` : ''}

                <div class="neu-card">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px;">Phone Number</label>
                    <input type="tel" id="phoneInput" class="neu-input" placeholder="07XX XXX XXX">
                </div>

                <button id="authBtn" class="neu-button primary mt-24">
                    <span id="btnText">${this.isLogin ? 'Sign In' : 'Create Account'}</span>
                    <i class="fa-solid fa-arrow-right" id="btnIcon"></i>
                    <div class="loader-sm" id="btnLoader" style="display: none;"></div>
                </button>
            </div>
            
            <style>
                .loader-sm {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        return div;
    }

    async afterRender() {
        const phoneInput = document.getElementById('phoneInput');
        const nameInput = document.getElementById('nameInput');
        const authBtn = document.getElementById('authBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const btnLoader = document.getElementById('btnLoader');

        authBtn.addEventListener('click', () => {
            this.phone = phoneInput.value;
            if (!this.isLogin) {
                this.name = nameInput.value;
                if (this.phone.length >= 10 && this.name.length > 2) {
                    this.simulateValidation(() => {
                        store.updateUser({ phone: this.phone, name: this.name });
                        window.appRouter.navigate('/scripture');
                    });
                } else {
                    alert('Please enter a valid name and phone number.');
                }
            } else {
                if (this.phone.length >= 10) {
                    const state = store.getState();
                    if (state.user && state.user.phone === this.phone) {
                        this.simulateValidation(() => {
                            window.appRouter.navigate('/scripture');
                        });
                    } else {
                        alert('Phone number does not match our records.');
                    }
                } else {
                    alert('Please enter a valid phone number.');
                }
            }
        });
    }
    
    simulateValidation(callback) {
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const btnLoader = document.getElementById('btnLoader');
        
        btnText.style.display = 'none';
        btnIcon.style.display = 'none';
        btnLoader.style.display = 'block';
        
        setTimeout(() => {
            callback();
        }, 1000);
    }
}
