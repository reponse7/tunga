import { store } from './store.js';
import { Router } from './router.js';

// Screens will be imported here as they are created
import Splash from './screens/Splash.js';
import Auth from './screens/Auth.js';
import ScriptureLoading from './screens/ScriptureLoading.js';
import Onboarding from './screens/Onboarding.js';
import Dashboard from './screens/Dashboard.js';
import POS from './screens/POS.js';
import Stock from './screens/Stock.js';
import Expenses from './screens/Expenses.js';
import Finance from './screens/Finance.js';
import Settings from './screens/Settings.js';

const routes = {
    '/': { component: Splash },
    '/auth': { component: Auth },
    '/scripture': { component: ScriptureLoading },
    '/onboarding': { component: Onboarding },
    '/dashboard': { component: Dashboard },
    '/pos': { component: POS },
    '/stock': { component: Stock },
    '/expenses': { component: Expenses },
    '/finance': { component: Finance },
    '/settings': { component: Settings }
};

export const router = new Router(routes);

// Initial routing logic
const state = store.getState();
if (state.settings && state.settings.darkMode) {
    document.body.classList.add('dark-mode');
}

// Start at splash, which will redirect based on auth state
router.navigate('/');

// Make router accessible globally for inline onclick handlers
window.appRouter = router;
