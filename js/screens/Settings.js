import { store } from '../store.js';
import { getBottomNav } from '../components.js';

export default class Settings {
    async render() {
        const state = store.getState();
        const user = state.user || {};
        const business = state.business || {};
        const settings = state.settings || { darkMode: false, pin: '' };

        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        
        div.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <button class="neu-icon-btn" onclick="window.history.back()">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 style="margin: 0;">Settings</h2>
                <div style="width: 48px;"></div>
            </div>
            
            <div class="neu-card flex-col align-center text-center mb-24">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary-gradient); color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 16px;">
                    ${(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <h3 style="margin: 0;">${user.name || 'User'}</h3>
                <p style="margin: 0;">${user.phone || 'No phone'}</p>
            </div>
            
            <!-- App Settings (Dark Mode) -->
            <div class="neu-card mb-16 p-0" style="padding: 16px;">
                <div class="flex-row justify-between align-center">
                    <div class="flex-row gap-16 align-center">
                        <i class="fa-solid fa-moon text-primary" style="font-size: 20px; width: 24px;"></i>
                        <h4 style="margin: 0;">Dark Mode</h4>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="darkModeToggle" ${settings.darkMode ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- Profile Settings -->
            <div class="neu-card mb-16 p-0" style="padding: 16px; cursor: pointer;" id="editProfileBtn">
                <div class="flex-row justify-between align-center">
                    <div class="flex-row gap-16 align-center">
                        <i class="fa-regular fa-user text-primary" style="font-size: 20px; width: 24px;"></i>
                        <h4 style="margin: 0;">Edit Profile & Name</h4>
                    </div>
                    <i class="fa-solid fa-chevron-right text-secondary"></i>
                </div>
            </div>

            <!-- Security Settings -->
            <div class="neu-card mb-16 p-0" style="padding: 16px; cursor: pointer;" id="securityBtn">
                <div class="flex-row justify-between align-center">
                    <div class="flex-row gap-16 align-center">
                        <i class="fa-solid fa-lock text-primary" style="font-size: 20px; width: 24px;"></i>
                        <div>
                            <h4 style="margin: 0;">Security PIN</h4>
                            <p style="margin: 0; font-size: 12px;">${settings.pin ? 'PIN is set' : 'Not configured'}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-secondary"></i>
                </div>
            </div>
            
            <!-- Business Settings -->
            <div class="neu-card mb-24 p-0" style="padding: 16px; cursor: pointer;" onclick="window.appRouter.navigate('/onboarding')">
                <div class="flex-row justify-between align-center">
                    <div class="flex-row gap-16 align-center">
                        <i class="fa-solid fa-shop text-primary" style="font-size: 20px; width: 24px;"></i>
                        <div>
                            <h4 style="margin: 0;">Business Details</h4>
                            <p style="margin: 0; font-size: 12px;">${business.district || 'Location'} • ${business.industry || 'Industry'}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-secondary"></i>
                </div>
            </div>

            <button id="logoutBtn" class="neu-button" style="color: #ff4b4b; background: rgba(255, 75, 75, 0.1);">
                <i class="fa-solid fa-right-from-bracket"></i> Clear Data & Logout
            </button>
            
            ${getBottomNav('')}
            
            <style>
                /* Toggle Switch CSS */
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--input-bg); transition: .4s; border: var(--card-border); }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 3px; background-color: var(--text-secondary); transition: .4s; }
                input:checked + .slider { background-color: var(--primary-color); border-color: var(--primary-color); }
                input:checked + .slider:before { transform: translateX(20px); background-color: white; }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
            </style>
        `;
        return div;
    }

    async afterRender() {
        const toggle = document.getElementById('darkModeToggle');
        toggle.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            if (isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            store.updateSettings({ darkMode: isDark });
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all local data and logout?')) {
                store.clearState();
            }
        });

        document.getElementById('editProfileBtn').addEventListener('click', () => {
            const newName = prompt('Enter new Name/Shop Name:', store.getState().user?.name || '');
            if (newName) {
                store.updateUser({ name: newName });
                window.appRouter.navigate('/settings'); // reload to reflect
            }
        });
        
        document.getElementById('securityBtn').addEventListener('click', () => {
            const newPin = prompt('Enter a new 5-digit PIN (or leave blank to disable):');
            if (newPin !== null) {
                store.updateSettings({ pin: newPin });
                window.appRouter.navigate('/settings'); // reload to reflect
            }
        });
    }
}
