class Store {
    constructor() {
        this.state = this.loadState() || {
            user: null,
            business: {
                industry: null,
                type: null,
                district: null
            },
            stock: [],
            expenses: [],
            transactions: [],
            finance: {
                savings: 0,
                loans: []
            },
            settings: {
                darkMode: false,
                pin: ''
            }
        };
    }

    loadState() {
        const saved = localStorage.getItem('tunga_state');
        return saved ? JSON.parse(saved) : null;
    }

    saveState() {
        localStorage.setItem('tunga_state', JSON.stringify(this.state));
    }

    updateUser(userData) {
        this.state.user = { ...this.state.user, ...userData };
        this.saveState();
    }

    updateBusiness(industry, type, district) {
        if(industry) this.state.business.industry = industry;
        if(type) this.state.business.type = type;
        if(district) this.state.business.district = district;
        this.saveState();
    }

    addStockItem(item) {
        item.id = Date.now().toString();
        this.state.stock.push(item);
        this.saveState();
    }
    
    updateStockQuantity(id, qtyChange) {
        const item = this.state.stock.find(i => i.id === id);
        if(item) {
            item.quantity += qtyChange;
            this.saveState();
        }
    }

    addTransaction(tx) {
        tx.id = Date.now().toString();
        tx.date = new Date().toISOString();
        this.state.transactions.push(tx);
        // Deduct from stock
        tx.items.forEach(cartItem => {
            this.updateStockQuantity(cartItem.id, -cartItem.qty);
        });
        this.saveState();
    }

    addExpense(expense) {
        expense.id = Date.now().toString();
        expense.date = new Date().toISOString();
        this.state.expenses.push(expense);
        this.saveState();
    }
    
    updateSettings(settingsData) {
        if (!this.state.settings) {
            this.state.settings = { darkMode: false, pin: '' };
        }
        this.state.settings = { ...this.state.settings, ...settingsData };
        this.saveState();
    }
    
    getState() {
        return this.state;
    }
    
    clearState() {
        localStorage.removeItem('tunga_state');
        window.location.reload();
    }
}

export const store = new Store();
