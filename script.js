// Global State
let cart = JSON.parse(localStorage.getItem('hubCart')) || [];

// Page Navigation Logic
function showPage(pageId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    // Show target section
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.getElementById(`link-${pageId}`);
    if(activeLink) activeLink.classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Cart Logic
function addToCart(name, price) {
    cart.push({ name, price, id: Date.now() });
    updateCartUI();
    // Subtle notification
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    setTimeout(() => btn.innerText = originalText, 1000);
}

function updateCartUI() {
    localStorage.setItem('hubCart', JSON.stringify(cart));
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.innerText = cart.length;
    
    let total = 0;
    cartItems.innerHTML = cart.length === 0 ? '<p class="text-gray-400">Your cart is empty.</p>' : '';
    
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                    <h5 class="font-bold">${item.name}</h5>
                    <p class="text-blue-600 text-sm">₹${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartTotal.innerText = `₹${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
}

// Payment Integration Placeholder
function payNow(amount, itemName) {
    alert(`Redirecting to Razorpay for ${itemName} \nAmount: ₹${amount}`);
    // Here you would normally call Razorpay functions
}

function checkoutCart() {
    if(cart.length === 0) return alert("Cart is empty!");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    payNow(total, "Cart Items");
}

// Form Submission
document.getElementById('inquiryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('inqName').value;
    alert(`Thank you ${name}! Our team will contact you shortly.`);
    this.reset();
});

// Initial Load
window.onload = () => {
    updateCartUI();
    // Default to home
    showPage('home');
};