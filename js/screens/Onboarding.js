import { store } from '../store.js';

export default class Onboarding {
    constructor() {
        this.step = 1;
        this.industry = null;
        this.businessType = null;
        this.province = null;
        
        this.industries = [
            "Apparel & Fashion",
            "General Retail & Groceries",
            "Hardware & Construction",
            "Electronics & Technology",
            "Beauty, Health & Lifestyle",
            "Specialized Trade & Services",
            "Local Staples, Agriculture & Distribution"
        ];
        
        this.businessTypes = {
            "Apparel & Fashion": [
                "High-end Clothing Boutiques (Suits, dresses, designer wear)",
                "Thrift & Second-Hand Clothes Shops (Cyamunara / Caguwa)",
                "Tailoring Workshops & Fabric Shops (Vitenge, cotton, custom tailoring supplies)",
                "Shoe & Footwear Stores (Sneakers, official shoes, sandals)",
                "Fashion Accessories & Jewelry Shops (Including jewelry, watches, bags, belts, and caps)"
            ],
            "General Retail & Groceries": [
                "Mini-Supermarkets & Convenience Stores",
                "Neighborhood Retail Shops (Duka / Alimentation)",
                "Wholesale Food & Dry Goods Depots (Rice, sugar, flour, oil)",
                "Fresh Produce & Vegetable Markets",
                "Butcheries & Cold Storage Meat Shops"
            ],
            "Hardware & Construction": [
                "Hardware & Building Material Shops (Cement, iron sheets, nails, locks)",
                "Plumbing & Electrical Supply Stores (Pipes, cables, switches, bulbs)",
                "Paint & Finishing Material Depots",
                "Timber & Carpentry Material Yards"
            ],
            "Electronics & Technology": [
                "Mobile Phone & Accessories Shops (Chargers, cases, screen protectors)",
                "Computer, Laptop & IT Equipment Stores",
                "Home Appliance & Electronics Outlets (TVs, sound systems, cookers)",
                "Solar Power Equipment & Battery Shops"
            ],
            "Beauty, Health & Lifestyle": [
                "Neighborhood Pharmacies & Depots Pharmaceutiques (Essential medicines and health supplies)",
                "Cosmetics & Perfumery Shops",
                "Salon & Barber Shop Supply Distributors",
                "Agro-Veterinary Shops (Covering fertilizers, seeds, animal feeds, and veterinary drugs)"
            ],
            "Specialized Trade & Services": [
                "Stationery, Bookshops & School Supply Stores",
                "Auto Spare Parts & Car Accessory Shops",
                "Furniture Showrooms & Home Goods (Covering furniture and beddings)",
                "Gas Cylinder Distribution & Refill Depots"
            ],
            "Local Staples, Agriculture & Distribution": [
                "Agro-Processing & Grains Depots (Koperative / Birayi n'Imyumbati)",
                "Local Handcraft & 'Made in Rwanda' Collectives",
                "Beverage Distribution Centers (Bralirwa/Inyange depot networks)"
            ]
        };
        
        this.provinces = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];
    }

    async render() {
        const div = document.createElement('div');
        div.className = 'screen flex-col';
        div.id = 'onboarding-container';
        this.renderStep(div);
        return div;
    }
    
    renderStep(container) {
        let content = `
            <div class="flex-row justify-between align-center mb-24">
                <button id="backBtn" class="neu-icon-btn" style="${this.step === 1 ? 'visibility: hidden;' : ''}"><i class="fa-solid fa-chevron-left"></i></button>
                <div style="font-weight: 600; color: var(--text-secondary);">Step ${this.step} of 3</div>
                <div style="width: 48px;"></div>
            </div>
            
            <h2 class="mb-24 gradient-text" style="font-size: 28px;">
                ${this.step === 1 ? 'What industry are you in?' : 
                  this.step === 2 ? 'What is your exact business type?' : 
                  'Where is your business located?'}
            </h2>
            
            <div class="flex-col gap-16" style="flex: 1; overflow-y: auto; padding-bottom: 24px;">
        `;
        
        if (this.step === 1) {
            this.industries.forEach(ind => {
                const isSelected = this.industry === ind;
                content += `
                    <div class="neu-card selection-card ${isSelected ? 'selected' : ''}" data-value="${ind}">
                        <h4 style="margin: 0; color: ${isSelected ? 'var(--primary-color)' : 'inherit'};">${ind}</h4>
                    </div>
                `;
            });
        } else if (this.step === 2) {
            const types = this.businessTypes[this.industry];
            types.forEach(type => {
                const isSelected = this.businessType === type;
                content += `
                    <div class="neu-card selection-card ${isSelected ? 'selected' : ''}" data-value="${type}">
                        <h4 style="margin: 0; color: ${isSelected ? 'var(--primary-color)' : 'inherit'}; line-height: 1.4;">${type}</h4>
                    </div>
                `;
            });
        } else if (this.step === 3) {
            this.provinces.forEach(prov => {
                const isSelected = this.province === prov;
                content += `
                    <div class="neu-card selection-card ${isSelected ? 'selected' : ''}" data-value="${prov}">
                        <h4 style="margin: 0; color: ${isSelected ? 'var(--primary-color)' : 'inherit'};">${prov}</h4>
                    </div>
                `;
            });
        }
        
        content += `
            </div>
            <button id="nextBtn" class="neu-button primary mt-24" ${this.canProceed() ? '' : 'style="opacity: 0.5; pointer-events: none;"'}>
                ${this.step === 3 ? 'Complete Setup' : 'Continue'} <i class="fa-solid fa-arrow-right"></i>
            </button>
            
            <style>
                .selection-card {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .selection-card:active {
                    box-shadow: var(--shadow-inset);
                }
                .selection-card.selected {
                    box-shadow: var(--shadow-inset);
                    border-left: 4px solid var(--primary-color);
                }
            </style>
        `;
        
        container.innerHTML = content;
        this.attachEventListeners(container);
    }
    
    canProceed() {
        if (this.step === 1) return this.industry !== null;
        if (this.step === 2) return this.businessType !== null;
        if (this.step === 3) return this.province !== null;
        return false;
    }

    attachEventListeners(container) {
        const backBtn = container.querySelector('#backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.step > 1) {
                    this.step--;
                    this.renderStep(container);
                }
            });
        }
        
        const nextBtn = container.querySelector('#nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.step < 3) {
                    this.step++;
                    this.renderStep(container);
                } else {
                    store.updateBusiness(this.industry, this.businessType, this.province);
                    window.appRouter.navigate('/dashboard');
                }
            });
        }
        
        const cards = container.querySelectorAll('.selection-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const val = card.dataset.value;
                if (this.step === 1) {
                    this.industry = val;
                    this.businessType = null; // reset if changing industry
                } else if (this.step === 2) {
                    this.businessType = val;
                } else if (this.step === 3) {
                    this.province = val;
                }
                this.renderStep(container);
            });
        });
    }

    async afterRender() {}
}
