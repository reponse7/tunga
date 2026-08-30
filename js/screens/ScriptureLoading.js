import { store } from '../store.js';

export default class ScriptureLoading {
    constructor() {
        this.scriptures = [
            "In all toil there is profit, but mere talk tends only to poverty. - Proverbs 14:23",
            "Commit your work to the Lord, and your plans will be established. - Proverbs 16:3",
            "The plans of the diligent lead surely to abundance... - Proverbs 21:5",
            "Do you see a man skillful in his work? He will stand before kings. - Proverbs 22:29"
        ];
    }

    async render() {
        const div = document.createElement('div');
        div.className = 'screen flex-col justify-center align-center';
        
        const randomScripture = this.scriptures[Math.floor(Math.random() * this.scriptures.length)];
        
        div.innerHTML = `
            <div class="logo-t-container flex-col align-center justify-center neu-card" style="width: 100px; height: 100px; border-radius: 20px; margin-bottom: 40px; animation: float 3s ease-in-out infinite;">
                <h1 class="gradient-text" style="font-size: 56px; margin: 0; line-height: 1;">T</h1>
            </div>
            
            <div style="max-width: 80%; text-align: center;">
                <p style="font-size: 16px; line-height: 1.5; font-style: italic; color: var(--text-primary);">
                    "${randomScripture}"
                </p>
            </div>
            
            <div class="loader mt-24"></div>
            
            <style>
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--input-bg);
                    border-top: 4px solid var(--primary-color);
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
        setTimeout(() => {
            const state = store.getState();
            if (state && state.business && state.business.industry) {
                window.appRouter.navigate('/dashboard');
            } else {
                window.appRouter.navigate('/onboarding');
            }
        }, 2500);
    }
}
