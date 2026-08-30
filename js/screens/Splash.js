import { store } from '../store.js';

export default class Splash {
    async render() {
        const div = document.createElement('div');
        div.className = 'screen flex-col justify-center align-center';
        div.style.background = 'var(--primary-gradient)';
        div.style.color = 'white';
        
        div.innerHTML = `
            <div class="logo-container" style="animation: pulse 1s infinite alternate;">
                <h1 style="font-size: 48px; letter-spacing: 2px;">TUNGA</h1>
            </div>
            <div style="position: absolute; bottom: 40px; text-align: center;">
                <p style="color: rgba(255,255,255,0.7); font-size: 14px;">from</p>
                <h3 style="margin-top: 4px; font-weight: 500;">ASA</h3>
            </div>
            <style>
                @keyframes pulse {
                    from { transform: scale(1); }
                    to { transform: scale(1.05); }
                }
            </style>
        `;
        return div;
    }

    async afterRender() {
        setTimeout(() => {
            const state = store.getState();
            if (state.user) {
                if (state.business.industry) {
                    window.appRouter.navigate('/dashboard');
                } else {
                    window.appRouter.navigate('/onboarding');
                }
            } else {
                window.appRouter.navigate('/auth');
            }
        }, 500); // 0.5s splash
    }
}
