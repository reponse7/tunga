export function getBottomNav(activeTab) {
    return `
        <div class="bottom-nav">
            <div class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}" onclick="window.appRouter.navigate('/dashboard')">
                <i class="fa-solid fa-house"></i>
                <span>Home</span>
            </div>
            <div class="nav-item ${activeTab === 'pos' ? 'active' : ''}" onclick="window.appRouter.navigate('/pos')">
                <i class="fa-solid fa-cash-register"></i>
                <span>POS</span>
            </div>
            <div class="nav-item ${activeTab === 'stock' ? 'active' : ''}" onclick="window.appRouter.navigate('/stock')">
                <i class="fa-solid fa-box"></i>
                <span>Stock</span>
            </div>
            <div class="nav-item ${activeTab === 'expenses' ? 'active' : ''}" onclick="window.appRouter.navigate('/expenses')">
                <i class="fa-solid fa-receipt"></i>
                <span>Expenses</span>
            </div>
            <div class="nav-item ${activeTab === 'finance' ? 'active' : ''}" onclick="window.appRouter.navigate('/finance')">
                <i class="fa-solid fa-building-columns"></i>
                <span>Finance</span>
            </div>
        </div>
    `;
}
