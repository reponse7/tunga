import { store } from '../store.js';
import { getBottomNav } from '../components.js';

export default class POS {
    constructor() {
        this.cart = [];
    }

    async render() {
        const state = store.getState();
        const stock = state.stock;

        const div = document.createElement('div');
        div.className = 'screen flex-col pb-nav';
        
        let stockHtml = stock.length === 0 ? 
            `<div class="text-center mt-24"><p>No items in stock. Add items from the Stock page.</p></div>` :
            stock.map(item => `
                <div class="neu-card item-card flex-row justify-between align-center" style="padding: 16px; margin-bottom: 12px; cursor: pointer;" data-id="${item.id}">
                    <div>
                        <h4 style="margin: 0;">${item.name}</h4>
                        <p style="margin: 0; font-size: 12px;">Stock: ${item.quantity} | RWF ${item.price.toLocaleString()}</p>
                    </div>
                    <div class="neu-icon-btn" style="width: 36px; height: 36px; font-size: 14px;"><i class="fa-solid fa-plus"></i></div>
                </div>
            `).join('');

        div.innerHTML = `
            <div class="flex-row justify-between align-center mb-24">
                <h2 style="margin: 0;">Point of Sale</h2>
                <div class="neu-icon-btn cart-btn" style="position: relative;">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="cartBadge" style="position: absolute; top: -5px; right: -5px; background: #ff4b4b; color: white; font-size: 10px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; display: none;">0</span>
                </div>
            </div>
            
            <div class="neu-card" style="margin-bottom: 16px;">
                <input type="text" class="neu-input" placeholder="Search products..." style="padding: 12px 16px;">
            </div>
            
            <div style="flex: 1; overflow-y: auto;">
                ${stockHtml}
            </div>
            
            <!-- Cart Modal Overlay -->
            <div id="cartModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 200; justify-content: center; align-items: flex-end;">
                <div class="neu-card" style="width: 100%; max-width: 500px; margin: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0; padding: 24px; max-height: 80vh; display: flex; flex-direction: column;">
                    <div class="flex-row justify-between align-center mb-16">
                        <h3 style="margin: 0;">Current Sale</h3>
                        <button id="closeCartBtn" class="neu-icon-btn" style="width: 32px; height: 32px;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div id="cartItemsList" style="flex: 1; overflow-y: auto; margin-bottom: 16px;"></div>
                    <div class="flex-row justify-between align-center mb-16">
                        <h3 style="margin: 0;">Total:</h3>
                        <h3 id="cartTotalDisplay" class="gradient-text" style="margin: 0;">RWF 0</h3>
                    </div>
                    <button id="checkoutBtn" class="neu-button primary">Complete Checkout</button>
                </div>
            </div>
            
            ${getBottomNav('pos')}
        `;
        return div;
    }

    updateCartDisplay(container) {
        const badge = container.querySelector('#cartBadge');
        const cartItemsList = container.querySelector('#cartItemsList');
        const cartTotalDisplay = container.querySelector('#cartTotalDisplay');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        if (totalItems > 0) {
            badge.style.display = 'flex';
            badge.innerText = totalItems;
        } else {
            badge.style.display = 'none';
        }
        
        cartTotalDisplay.innerText = `RWF ${totalPrice.toLocaleString()}`;
        
        if (this.cart.length === 0) {
            cartItemsList.innerHTML = '<p class="text-center mt-24">Cart is empty.</p>';
        } else {
            cartItemsList.innerHTML = this.cart.map(item => `
                <div class="flex-row justify-between align-center mb-12" style="border-bottom: 1px solid var(--input-bg); padding-bottom: 12px;">
                    <div>
                        <h5 style="margin: 0;">${item.name}</h5>
                        <p style="margin: 0; font-size: 12px;">RWF ${item.price.toLocaleString()} x ${item.qty}</p>
                    </div>
                    <div class="flex-row gap-8 align-center">
                        <button class="neu-icon-btn adjust-qty" data-id="${item.id}" data-action="minus" style="width: 28px; height: 28px; font-size: 12px;"><i class="fa-solid fa-minus"></i></button>
                        <span>${item.qty}</span>
                        <button class="neu-icon-btn adjust-qty" data-id="${item.id}" data-action="plus" style="width: 28px; height: 28px; font-size: 12px;"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            `).join('');
            
            // Attach adjust listeners
            const adjustBtns = cartItemsList.querySelectorAll('.adjust-qty');
            adjustBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = btn.dataset.id;
                    const action = btn.dataset.action;
                    const cartItem = this.cart.find(i => i.id === id);
                    if (cartItem) {
                        if (action === 'plus') cartItem.qty++;
                        if (action === 'minus') {
                            cartItem.qty--;
                            if (cartItem.qty <= 0) {
                                this.cart = this.cart.filter(i => i.id !== id);
                            }
                        }
                        this.updateCartDisplay(container);
                    }
                });
            });
        }
    }

    async afterRender() {
        const container = document.querySelector('.screen.active');
        const state = store.getState();
        
        const itemCards = container.querySelectorAll('.item-card');
        itemCards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const item = state.stock.find(i => i.id === id);
                if (item) {
                    const existing = this.cart.find(i => i.id === id);
                    if (existing) {
                        existing.qty++;
                    } else {
                        this.cart.push({ ...item, qty: 1 });
                    }
                    this.updateCartDisplay(container);
                    // Slight animation on card
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => card.style.transform = 'scale(1)', 150);
                }
            });
        });

        const cartBtn = container.querySelector('.cart-btn');
        const cartModal = container.querySelector('#cartModal');
        const closeCartBtn = container.querySelector('#closeCartBtn');
        const checkoutBtn = container.querySelector('#checkoutBtn');

        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            this.updateCartDisplay(container);
        });

        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        checkoutBtn.addEventListener('click', () => {
            if (this.cart.length > 0) {
                const total = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
                store.addTransaction({
                    items: this.cart,
                    total: total
                });
                this.cart = [];
                cartModal.style.display = 'none';
                this.updateCartDisplay(container);
                alert('Sale completed successfully!');
                
                // Refresh list if stock was depleted
                window.appRouter.navigate('/pos');
            }
        });
    }
}
