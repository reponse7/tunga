export class Router {
    constructor(routes) {
        this.routes = routes;
        this.appContainer = document.getElementById('app');
        this.currentScreen = null;
    }

    async navigate(path) {
        if (this.currentScreen && typeof this.currentScreen.destroy === 'function') {
            this.currentScreen.destroy();
        }

        const route = this.routes[path];
        if (!route) {
            console.error(`Route ${path} not found`);
            return;
        }

        // Clean container
        this.appContainer.innerHTML = '';
        
        // Instantiate new screen
        this.currentScreen = new route.component();
        
        // Render
        const element = await this.currentScreen.render();
        element.classList.add('active');
        this.appContainer.appendChild(element);
        
        // Setup after render
        if (typeof this.currentScreen.afterRender === 'function') {
            await this.currentScreen.afterRender();
        }
    }
}
