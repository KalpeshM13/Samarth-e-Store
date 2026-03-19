// Responsive Redirection
function handleResponsiveRedirect() {
    const isMobile = window.innerWidth < 768;
    const isDesktopPage = window.location.pathname.includes('desktop_');
    const isMobilePage = window.location.pathname.includes('mobile_');

    if (isMobile && isDesktopPage) {
        window.location.replace(window.location.pathname.replace('desktop_', 'mobile_'));
    } else if (!isMobile && isMobilePage) {
        window.location.replace(window.location.pathname.replace('mobile_', 'desktop_'));
    }
}

window.addEventListener('resize', handleResponsiveRedirect);
handleResponsiveRedirect();

// Cart Logic
let cart = JSON.parse(localStorage.getItem('samarth_cart')) || [];

function saveCart() {
    localStorage.setItem('samarth_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(item) {
    cart.push(item);
    saveCart();
    alert(item.name + " added to cart!");
}

function updateCartCount() {
    // Update main navigation buttons
    document.querySelectorAll('button, a').forEach(el => {
        // Only target buttons/links if they look like a cart icon
        if (el.innerHTML.includes('shopping_cart') || el.innerHTML.includes('shopping_bag')) {
            const existingBadge = el.querySelector('span:not(.material-symbols-outlined)');
            
            // Re-render
            if (existingBadge) {
                existingBadge.textContent = cart.length;
            } else {
                const countBadge = document.createElement('span');
                countBadge.className = 'absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pointer-events-none';
                countBadge.textContent = cart.length;
                el.style.position = 'relative';
                if (cart.length > 0) {
                    el.appendChild(countBadge);
                }
            }
        }
    });

    // Update mobile bottom nav
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(item => {
        if (item.innerHTML.includes('shopping_cart') || item.innerHTML.includes('shopping_bag')) {
            const existingBadge = item.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.textContent = cart.length;
            } else {
                const badge = document.createElement('span');
                badge.className = 'cart-badge absolute top-1 right-2 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pointer-events-none';
                badge.textContent = cart.length;
                item.style.position = 'relative';
                if (cart.length > 0) item.appendChild(badge);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Attach click listeners to all navigational elements
    document.querySelectorAll('a, button').forEach(el => {
        // Shop links
        if(el.textContent.trim().toLowerCase() === 'shop all' || el.textContent.trim().toLowerCase() === 'shop' || el.textContent.trim().toLowerCase() === 'store') {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = window.innerWidth < 768 ? 'mobile_store.html' : 'desktop_store.html';
            });
        }
        
        // Cart Links
        if(el.innerHTML.includes('shopping_cart') || el.innerHTML.includes('shopping_bag') || el.textContent.toLowerCase().includes('view cart')) {
            // Ignore if it's an "Add to Cart" button!
            if(!el.textContent.toLowerCase().includes('add to cart')) {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = window.innerWidth < 768 ? 'mobile_cart.html' : 'desktop_cart.html';
                });
            }
        }
        
        // Home links (Logo or Home Icon)
        if(el.textContent.trim() === 'Samarth e-Store' || el.innerHTML.includes('home')) {
             el.addEventListener('click', (e) => {
                 e.preventDefault();
                 window.location.href = window.innerWidth < 768 ? 'mobile_landing.html' : 'desktop_landing.html';
             });
        }
    });

    // Add to cart buttons
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.toLowerCase().includes('add to cart') || btn.innerHTML.includes('add_shopping_cart')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let name = "Premium Item";
                let price = 150.00;
                let img = "";
                
                const card = btn.closest('.group, .bg-surface-container-low, section');
                if (card) {
                    const heading = card.querySelector('h2, h3, h4');
                    // Find text node that contains numbers and a dollar sign
                    const priceNodes = Array.from(card.querySelectorAll('span, p, h3')).filter(node => node.textContent.includes('$'));
                    
                    const imgEl = card.querySelector('img');

                    if (heading) name = heading.textContent.trim();
                    if (priceNodes.length > 0) {
                        const parsed = parseFloat(priceNodes[0].textContent.replace(/[^0-9.-]+/g,""));
                        if (!isNaN(parsed)) price = parsed;
                    }
                    if (imgEl) img = imgEl.src;
                }
                
                addToCart({ id: Date.now(), name, price, img, quantity: 1 });
            });
        }
    });
    
    // Intercept cart page to render our custom 
    if (window.location.pathname.includes('cart.html')) {
        renderCartUI();
    }
});

function renderCartUI() {
    const main = document.querySelector('main');
    if (!main) return;

    let total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    let html = `
        <div class="container mx-auto px-4 md:px-12 py-12 md:py-20 min-h-[60vh]">
            <h1 class="text-3xl md:text-5xl font-bold mb-8">Your Cart</h1>
            ${cart.length === 0 ? '<p>Your cart is empty.</p>' : ''}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="md:col-span-2 space-y-4">
                    ${cart.map(item => `
                        <div class="flex items-center gap-4 border border-gray-200 p-4 rounded-xl shadow-sm bg-white dark:bg-slate-800">
                            <img src="${item.img || 'https://via.placeholder.com/150'}" class="w-24 h-24 object-cover rounded-md">
                            <div class="flex-1">
                                <h3 class="font-bold text-lg dark:text-white">${item.name}</h3>
                                <p class="text-gray-500 font-semibold">$${item.price.toFixed(2)}</p>
                            </div>
                            <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold p-2 hover:bg-red-50 rounded-md transition-colors">Remove</button>
                        </div>
                    `).join('')}
                </div>
                ${cart.length > 0 ? `
                <div class="bg-gray-50 dark:bg-slate-900 border border-gray-200 p-6 rounded-xl h-fit shadow-md">
                    <h2 class="text-xl font-bold border-b pb-4 mb-4 dark:text-white">Order Summary</h2>
                    <div class="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
                    <div class="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Shipping</span><span>Free</span></div>
                    <div class="flex justify-between mb-6 font-bold text-lg border-t pt-4 dark:text-white"><span>Total</span><span>$${total.toFixed(2)}</span></div>
                    <button class="w-full bg-[#003331] hover:bg-black text-white py-4 rounded-md font-bold transition-colors">Checkout Now</button>
                </div>
                ` : `<div class="mt-8"><a href="${window.innerWidth < 768 ? 'mobile_store.html' : 'desktop_store.html'}" class="text-blue-600 underline font-bold">Continue Shopping</a></div>`}
            </div>
        </div>
    `;

    main.innerHTML = html;
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCartUI();
};
