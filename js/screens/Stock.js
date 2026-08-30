import { store } from '../store.js';
import { getBottomNav } from '../components.js';

export default class Stock {
    async render() {
        const state = store.getState();
        const stock = state.stock;
        const bType = (state.business && state.business.type) ? state.business.type.toLowerCase() : '';
        
        let itemPlaceholder = "e.g. Item Name";
        if (bType.includes("supermarket") || bType.includes("grocery") || bType.includes("duka")) itemPlaceholder = "e.g. Milk 1L, Sugar 1Kg";
        else if (bType.includes("hardware") || bType.includes("construction")) itemPlaceholder = "e.g. Cement 50kg, Iron Sheet";
        else if (bType.includes("boutique") || bType.includes("fashion") || bType.includes("clothes")) itemPlaceholder = "e.g. Designer Shirt M, Sneakers Size 42";
        else if (bType.includes("pharmacy")) itemPlaceholder = "e.g. Paracetamol 500mg";
        else if (bType.includes("electronic") || bType.includes("phone")) itemPlaceholder = "e.g. iPhone Charger, Screen Protector";

        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        
        div.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <h2 style="margin: 0;">Inventory</h2>
                <button id="addStockBtn" class="neu-icon-btn" style="background: var(--primary-gradient); color: white;">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            
            <div id="addStockForm" class="neu-card mb-24" style="display: none;">
                <h4 class="mb-16">Add New Item</h4>
                <div class="flex-col gap-16">
                    <div>
                        <label style="font-size: 12px; margin-bottom: 4px; display: block;">Item Name / Type</label>
                        <input type="text" id="itemName" class="neu-input" placeholder="${itemPlaceholder}">
                    </div>
                    <div class="grid-2">
                        <div>
                            <label style="font-size: 12px; margin-bottom: 4px; display: block;">Price (RWF)</label>
                            <input type="number" id="itemPrice" class="neu-input" placeholder="0">
                        </div>
                        <div>
                            <label style="font-size: 12px; margin-bottom: 4px; display: block;">Quantity</label>
                            <input type="number" id="itemQty" class="neu-input" placeholder="0">
                        </div>
                    </div>
                    <button id="saveItemBtn" class="neu-button primary">Save Item</button>
                </div>
            </div>

            <div class="neu-card" style="padding: 0; overflow: hidden; border-radius: 12px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
                    <thead style="background: var(--input-bg);">
                        <tr>
                            <th style="padding: 12px 16px;">Item</th>
                            <th style="padding: 12px 16px;">Price</th>
                            <th style="padding: 12px 16px;">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stock.length === 0 ? `<tr><td colspan="3" class="text-center" style="padding: 24px;">No stock items.</td></tr>` : 
                          stock.map(item => `
                            <tr style="border-bottom: 1px solid var(--input-bg);">
                                <td style="padding: 12px 16px;">${item.name}</td>
                                <td style="padding: 12px 16px;">${item.price.toLocaleString()}</td>
                                <td style="padding: 12px 16px;">
                                    ${item.quantity <= (item.minAlert || 5) 
                                        ? `<span class="badge badge-warning">${item.quantity} (Low)</span>` 
                                        : `<span class="badge badge-success">${item.quantity}</span>`}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${getBottomNav('stock')}
        `;
        return div;
    }

    async afterRender() {
        const container = document.querySelector('.screen.active');
        const addStockBtn = container.querySelector('#addStockBtn');
        const addStockForm = container.querySelector('#addStockForm');
        const saveItemBtn = container.querySelector('#saveItemBtn');
        
        addStockBtn.addEventListener('click', () => {
            addStockForm.style.display = addStockForm.style.display === 'none' ? 'block' : 'none';
        });
        
        saveItemBtn.addEventListener('click', () => {
            const name = container.querySelector('#itemName').value;
            const price = parseFloat(container.querySelector('#itemPrice').value);
            const qty = parseInt(container.querySelector('#itemQty').value);
            
            if (name && !isNaN(price) && !isNaN(qty)) {
                store.addStockItem({ name, price, quantity: qty, minAlert: 5 });
                window.appRouter.navigate('/stock');
            } else {
                alert('Please fill all fields correctly.');
            }
        });
    }
}
