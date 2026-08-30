import { store } from '../store.js';
import { getBottomNav } from '../components.js';

export default class Expenses {
    async render() {
        const state = store.getState();
        const expenses = state.expenses;
        
        // Group by month (simplified)
        const total = expenses.reduce((sum, ex) => sum + parseFloat(ex.amount), 0);

        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        
        div.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <h2 style="margin: 0;">Expenses</h2>
                <button id="addExBtn" class="neu-icon-btn" style="background: var(--primary-gradient); color: white;">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            
            <div class="neu-card" style="background: var(--primary-gradient); color: white; border-radius: 24px; text-align: center; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(92, 51, 246, 0.3);">
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 8px;">Total Spent (All Time)</p>
                <h2 style="font-size: 32px; margin: 0;">RWF ${total.toLocaleString()}</h2>
            </div>
            
            <div id="addExForm" class="neu-card mb-24" style="display: none;">
                <h4 class="mb-16">Log Expense</h4>
                <div class="flex-col gap-16">
                    <div>
                        <label style="font-size: 12px; margin-bottom: 4px; display: block;">Description</label>
                        <input type="text" id="exDesc" class="neu-input" placeholder="e.g. Transport, Rent, Cleaning">
                    </div>
                    <div>
                        <label style="font-size: 12px; margin-bottom: 4px; display: block;">Amount (RWF)</label>
                        <input type="number" id="exAmount" class="neu-input" placeholder="0">
                    </div>
                    <button id="saveExBtn" class="neu-button primary">Save Expense</button>
                </div>
            </div>

            <div class="flex-row justify-between align-center mb-16">
                <h4 style="margin: 0;">Recent Activity</h4>
            </div>
            
            <div style="flex: 1; overflow-y: auto;">
                ${expenses.length === 0 ? `<div class="text-center mt-24"><p>No expenses logged.</p></div>` : 
                  expenses.slice().reverse().map(ex => {
                      const date = new Date(ex.date).toLocaleDateString();
                      return `
                          <div class="neu-card flex-row justify-between align-center" style="padding: 16px; margin-bottom: 12px;">
                              <div class="flex-row gap-16 align-center">
                                  <div class="neu-icon-btn" style="width: 40px; height: 40px; color: #ff4b4b; box-shadow: var(--shadow-inset);">
                                      <i class="fa-solid fa-arrow-trend-down"></i>
                                  </div>
                                  <div>
                                      <h5 style="margin: 0; font-size: 16px;">${ex.desc}</h5>
                                      <p style="margin: 0; font-size: 12px;">${date}</p>
                                  </div>
                              </div>
                              <div style="font-weight: 600; color: #ff4b4b;">- ${parseFloat(ex.amount).toLocaleString()}</div>
                          </div>
                      `;
                  }).join('')}
            </div>
            
            ${getBottomNav('expenses')}
        `;
        return div;
    }

    async afterRender() {
        const container = document.querySelector('.screen.active');
        const addExBtn = container.querySelector('#addExBtn');
        const addExForm = container.querySelector('#addExForm');
        const saveExBtn = container.querySelector('#saveExBtn');
        
        addExBtn.addEventListener('click', () => {
            addExForm.style.display = addExForm.style.display === 'none' ? 'block' : 'none';
        });
        
        saveExBtn.addEventListener('click', () => {
            const desc = container.querySelector('#exDesc').value;
            const amount = parseFloat(container.querySelector('#exAmount').value);
            
            if (desc && !isNaN(amount)) {
                store.addExpense({ desc, amount });
                window.appRouter.navigate('/expenses');
            } else {
                alert('Please fill all fields.');
            }
        });
    }
}
