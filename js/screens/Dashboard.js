import { store } from '../store.js';
import { getBottomNav } from '../components.js';

export default class Dashboard {
    async render() {
        const state = store.getState();
        const business = state.business;
        const user = state.user || {};
        
        // Calculate metrics
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayTx = state.transactions.filter(tx => tx.date.startsWith(todayStr));
        const salesToday = todayTx.reduce((sum, tx) => sum + tx.total, 0);
        
        const todayExp = state.expenses.filter(ex => ex.date.startsWith(todayStr));
        const expensesToday = todayExp.reduce((sum, ex) => sum + parseFloat(ex.amount), 0);
        
        const lowStockItems = state.stock.filter(item => item.quantity <= (item.minAlert || 5)).length;

        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        
        div.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <div class="flex-row gap-16 align-center">
                    <div class="neu-icon-btn" style="width: 48px; height: 48px; background: var(--primary-color); color: white; border: none; font-size: 20px;">
                        <i class="fa-solid fa-shop"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 18px;">${user.name || 'My Shop'}</h3>
                        <p style="margin: 0; font-size: 13px;">${business.type || 'General Retail'}</p>
                    </div>
                </div>
                <div class="neu-icon-btn" onclick="window.appRouter.navigate('/settings')">
                    <i class="fa-solid fa-gear"></i>
                </div>
            </div>
            
            <h4 class="mb-16" style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);">Today's Overview</h4>
            <div class="grid-2 mb-24">
                <div class="neu-card" style="margin-bottom: 0;">
                    <p style="font-size: 12px; margin-bottom: 8px;">Sales Today</p>
                    <h3 style="font-size: 20px; color: var(--text-primary);">RWF ${salesToday.toLocaleString()}</h3>
                </div>
                <div class="neu-card" style="margin-bottom: 0;">
                    <p style="font-size: 12px; margin-bottom: 8px;">Expenses</p>
                    <h3 style="font-size: 20px; color: var(--danger-text);">RWF ${expensesToday.toLocaleString()}</h3>
                </div>
                <div class="neu-card" style="margin-bottom: 0;">
                    <p style="font-size: 12px; margin-bottom: 8px;">Inventory Alerts</p>
                    <span class="badge ${lowStockItems > 0 ? 'badge-warning' : 'badge-success'}">${lowStockItems} Low Stock</span>
                </div>
                <div class="neu-card" style="margin-bottom: 0;">
                    <p style="font-size: 12px; margin-bottom: 8px;">Transactions</p>
                    <h3 style="font-size: 20px; color: var(--primary-color);">${todayTx.length}</h3>
                </div>
            </div>
            
            <div class="neu-card">
                <div class="flex-row justify-between align-center mb-16">
                    <h4 style="margin: 0;">Quick Actions</h4>
                </div>
                <div class="grid-2">
                    <button class="neu-button" onclick="window.appRouter.navigate('/pos')" style="font-size: 14px; padding: 12px;">
                        <i class="fa-solid fa-cash-register"></i> New Sale
                    </button>
                    <button class="neu-button" onclick="window.appRouter.navigate('/expenses')" style="font-size: 14px; padding: 12px;">
                        <i class="fa-solid fa-receipt"></i> Add Expense
                    </button>
                </div>
            </div>

            <div class="neu-card mt-16">
                <h4 style="margin-bottom: 24px; font-size: 14px;">Sales Analytics</h4>
                <div style="height: 140px; border-bottom: 1px solid var(--card-border); position: relative; display: flex; align-items: flex-end; padding-top: 20px; gap: 12px;">
                    <!-- Gridlines -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; border-top: 1px dashed var(--input-border);"></div>
                    <div style="position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed var(--input-border); z-index: 0;"></div>
                    
                    ${[30, 50, 40, 70, 60, 90, 80].map(h => `
                        <div style="flex: 1; background: var(--primary-color); height: ${h}%; border-radius: 4px 4px 0 0; z-index: 1;"></div>
                    `).join('')}
                </div>
                <div class="flex-row justify-between mt-8" style="font-size: 11px; color: var(--text-muted); font-weight: 500;">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>
            
            ${getBottomNav('dashboard')}
        `;
        return div;
    }

    async afterRender() {}
}
