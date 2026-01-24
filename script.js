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
    renderGallery();
    setupGalleryHandlers();
};

// -----------------------
// Gallery: Local Storage with Drag & Drop
// -----------------------
const GALLERY_STORAGE_KEY = 'hubGalleryImages';

function getStoredImages() {
    return JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY)) || [];
}

function saveImagesToStorage(images) {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
}

async function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    const images = getStoredImages();
    grid.innerHTML = images.length === 0 ? '<p class="text-gray-400 col-span-full text-center py-8">No images yet. Upload some to get started!</p>' : '';
    
    images.forEach((dataUrl, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative rounded-xl overflow-hidden border hover:shadow-lg transition group';
        wrapper.innerHTML = `
            <img src="${dataUrl}" class="w-full h-40 object-cover" />
            <button class="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition" onclick="removeGalleryImage(${index})" title="Delete image">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        grid.appendChild(wrapper);
    });
}

function setupGalleryHandlers() {
    const input = document.getElementById('galleryInput');
    const addBtn = document.getElementById('addToGalleryBtn');
    const clearBtn = document.getElementById('clearGalleryBtn');
    const dropZone = document.getElementById('uploadDropZone');
    
    if (!input || !addBtn) return;

    // Click to select files
    dropZone?.addEventListener('click', () => input.click());

    // File input change
    input.addEventListener('change', (e) => {
        uploadImages(Array.from(e.target.files || []));
    });

    // Upload button
    addBtn.addEventListener('click', () => input.click());

    // Clear gallery
    clearBtn?.addEventListener('click', () => {
        if (confirm('Clear all images from the gallery?')) {
            saveImagesToStorage([]);
            renderGallery();
            alert('Gallery cleared!');
        }
    });

    // Drag and drop
    dropZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('ring-4', 'ring-blue-500');
    });

    dropZone?.addEventListener('dragleave', () => {
        dropZone.classList.remove('ring-4', 'ring-blue-500');
    });

    dropZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('ring-4', 'ring-blue-500');
        uploadImages(Array.from(e.dataTransfer.files || []));
    });
}

function uploadImages(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('Please select valid image files.');
        return;
    }

    const images = getStoredImages();
    let loadedCount = 0;

    imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            images.push(e.target.result);
            loadedCount++;
            
            if (loadedCount === imageFiles.length) {
                saveImagesToStorage(images);
                renderGallery();
                document.getElementById('galleryInput').value = '';
                alert(`${imageFiles.length} image(s) uploaded successfully!`);
            }
        };
        reader.onerror = () => {
            alert(`Failed to load ${file.name}`);
        };
        reader.readAsDataURL(file);
    });
}

function removeGalleryImage(index) {
    if (!confirm('Delete this image?')) return;
    const images = getStoredImages();
    images.splice(index, 1);
    saveImagesToStorage(images);
    renderGallery();
}



// -----------------------
// UPI & Call helpers
// -----------------------
function payViaUPI(upiId, payeeName, amount, note) {
    // Build UPI payment URL (may open supported apps on mobile)
    const params = new URLSearchParams({
        pa: upiId,
        pn: payeeName,
        am: amount.toString(),
        tn: note || '',
        cu: 'INR'
    });
    const upiUrl = `upi://pay?${params.toString()}`;
    // Fallback: use web intent for browsers that support it
    window.location.href = upiUrl;
}

function openUPIPaymentPrompt() {
    const upi = prompt('Enter UPI ID to pay (example: yourid@upi):', 'bhubaneswarhub@upi');
    if(!upi) return;
    const amt = prompt('Amount (INR):', '100');
    if(!amt || isNaN(Number(amt))) return alert('Invalid amount');
    payViaUPI(upi, 'Bhubaneswar Hub', Number(amt), 'Payment');
}

function callNumber(number) {
    if(!number) return;
    window.location.href = `tel:${number}`;
}
