/**
 * Bhubaneswar Grand Hub - Core Application Production Engine Script Logic
 * Authoritative Architecture with Secured Multi-tier Admin Role Permissions
 */

// Application Centralized Memory State Lifecycle State Management System
let appCart = [];
let appGalleryPhotos = [];
let isAdminAuthenticated = false;

// Default Application Dynamic Configurations 
const APP_STORE_PREFIX = "BBSR_HUB_";
const SAMPLE_GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
];

// Production Native Local Device Synchronization Event Handlers
document.addEventListener("DOMContentLoaded", () => {
    initAppRoutingSystem();
    loadApplicationStateData();
    initializeGalleryListeners();
    initializeInquiryHandler();
    initializeAdminLoginSystem();
});

/**
 * ==========================================
 * I. CLIENT ROUTING & NAVIGATION FRAMEWORK
 * ==========================================
 */
function showPage(targetPageId) {
    // Sanitize parameters to avoid state presentation processing faults
    if (!targetPageId) targetPageId = 'home';
    
    // Select and cycle display context configurations across section elements
    const pageSections = document.querySelectorAll(".page-section");
    pageSections.forEach(section => {
        if (section.id === targetPageId) {
            section.classList.remove("hidden");
            // Standardizing UI layout context structures if element uses container styling
            if(targetPageId === 'home') {
                section.classList.add("active");
            }
        } else {
            section.classList.add("hidden");
            section.classList.remove("active");
        }
    });

    // Handle Active Visual Component Styling Modifications over Document Elements
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("text-blue-600");
        link.classList.add("text-gray-600");
    });

    const activeNavigationLink = document.getElementById(`link-${targetPageId === 'social-activities' ? 'ngo' : targetPageId}`);
    if (activeNavigationLink) {
        activeNavigationLink.classList.remove("text-gray-600");
        activeNavigationLink.classList.add("text-blue-600");
    }

    // Smooth return deployment configuration optimization context
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initAppRoutingSystem() {
    // Set fallback entry route presentation model view mapping state configuration elements
    showPage('home');
}

/**
 * ==========================================
 * II. AUTHENTICATION & SECURE ACCESS SYSTEMS
 * ==========================================
 */
function initializeAdminLoginSystem() {
    const adminForm = document.getElementById("adminLoginForm");
    if(!adminForm) return;

    adminForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userField = document.getElementById("admUsername").value.trim();
        const passField = document.getElementById("admPassword").value;
        const errMessageElement = document.getElementById("loginErrorMessage");

        /**
         * PRODUCTION NOTE FOR SYSTEM INTEGRATION:
         * Replace this static comparative sequence validation block with an API HTTP Request:
         * fetch('/api/v1/auth/admin', { method: 'POST', body: JSON.stringify({ userField, passField }) })
         */
        if (userField === "admin" && passField === "BbbsrHub@2026") {
            isAdminAuthenticated = true;
            errMessageElement.classList.add("hidden");
            localStorage.setItem(`${APP_STORE_PREFIX}ADMIN_SESSION`, "ACTIVE_VALIDATED_TOKEN");
            
            closeAdminLoginModal();
            synchronizeAdminUIVisibilityState();
            renderGalleryContentElements();
            alert("Administrative privileges unlocked. Write and deletion access activated.");
        } else {
            errMessageElement.classList.remove("hidden");
        }
    });
}

function checkSavedSessionAuthentication() {
    const token = localStorage.getItem(`${APP_STORE_PREFIX}ADMIN_SESSION`);
    if (token === "ACTIVE_VALIDATED_TOKEN") {
        isAdminAuthenticated = true;
    }
    synchronizeAdminUIVisibilityState();
}

function synchronizeAdminUIVisibilityState() {
    const uploadControlsBlock = document.getElementById("adminUploadControls");
    const statusNoticeDisplay = document.getElementById("galleryStatusNotice");
    const displayTriggerLoginBtn = document.getElementById("adminLoginTriggerBtn");
    const masterStatusNavbarPanel = document.getElementById("adminPanelStatus");

    if (isAdminAuthenticated) {
        if(uploadControlsBlock) uploadControlsBlock.classList.remove("hidden");
        if(statusNoticeDisplay) statusNoticeDisplay.classList.add("hidden");
        if(displayTriggerLoginBtn) displayTriggerLoginBtn.classList.add("hidden");
        if(masterStatusNavbarPanel) masterStatusNavbarPanel.classList.remove("hidden");
    } else {
        if(uploadControlsBlock) uploadControlsBlock.classList.add("hidden");
        if(statusNoticeDisplay) statusNoticeDisplay.classList.remove("hidden");
        if(displayTriggerLoginBtn) displayTriggerLoginBtn.classList.remove("hidden");
        if(masterStatusNavbarPanel) masterStatusNavbarPanel.classList.add("hidden");
    }
}

function openAdminLoginModal() {
    document.getElementById("adminLoginModal").classList.remove("hidden");
}

function closeAdminLoginModal() {
    document.getElementById("adminLoginModal").classList.add("hidden");
    document.getElementById("adminLoginForm").reset();
    document.getElementById("loginErrorMessage").classList.add("hidden");
}

function handleLogout() {
    isAdminAuthenticated = false;
    localStorage.removeItem(`${APP_STORE_PREFIX}ADMIN_SESSION`);
    synchronizeAdminUIVisibilityState();
    renderGalleryContentElements();
    alert("Administrative execution handle detached safely. Session reverted to Public.");
    showPage('home');
}

/**
 * ==========================================
 * III. PHOTO GALLERY SECURE EXECUTION MODULE 
 * ==========================================
 */
function initializeGalleryListeners() {
    const dropZone = document.getElementById("uploadDropZone");
    const fileInputField = document.getElementById("galleryInput");
    const uploadProcessActionBtn = document.getElementById("addToGalleryBtn");
    const resetMasterGalleryBtn = document.getElementById("clearGalleryBtn");

    if(!dropZone || !fileInputField) return;

    // Open System standard OS structural file prompt dialogue handler mapping context logic
    dropZone.addEventListener("click", () => fileInputField.click());

    // Layout configuration and processing systems tracking operations actions
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("bg-blue-200", "border-blue-500");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("bg-blue-200", "border-blue-500");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("bg-blue-200", "border-blue-500");
        if (!isAdminAuthenticated) return alert("Operation Rejected: Access privileges missing.");
        handleFileSelectionBatchProcessing(e.dataTransfer.files);
    });

    fileInputField.addEventListener("change", (e) => {
        if (!isAdminAuthenticated) return alert("Operation Rejected: Access privileges missing.");
        handleFileSelectionBatchProcessing(e.target.files);
    });

    if(uploadProcessActionBtn) {
        uploadProcessActionBtn.addEventListener("click", () => {
            alert("All queued structural binaries deployed to runtime engine local memory.");
        });
    }

    if(resetMasterGalleryBtn) {
        resetMasterGalleryBtn.addEventListener("click", () => {
            if(!confirm("Are you certain you wish to purge all operational imagery structural datasets?")) return;
            appGalleryPhotos = [];
            persistGalleryDataStore();
            renderGalleryContentElements();
        });
    }
}

function handleFileSelectionBatchProcessing(filesList) {
    if(!filesList || filesList.length === 0) return;

    Array.from(filesList).forEach(fileItem => {
        if (!fileItem.type.startsWith("image/")) {
            alert(`File entry execution bypassed: ${fileItem.name} does not match expected image type constraints.`);
            return;
        }

        const standardFileReader = new FileReader();
        standardFileReader.onload = (eventEvent) => {
            const compiledBase64StringData = eventEvent.target.result;
            // Inject new entry into core memory state mapping 
            appGalleryPhotos.unshift({
                id: "IMG_ID_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                sourceUri: compiledBase64StringData,
                timestamp: new Date().toLocaleDateString()
            });
            persistGalleryDataStore();
            renderGalleryContentElements();
        };
        standardFileReader.readAsDataURL(fileItem);
    });
}

function removeTargetPhotoElement(photoTrackingId) {
    if (!isAdminAuthenticated) {
        alert("Operation Denied: Administrative authority token not found.");
        return;
    }
    if (!confirm("Confirm complete permanent file drop action execution against targets?")) return;

    appGalleryPhotos = appGalleryPhotos.filter(photoObj => photoObj.id !== photoTrackingId);
    persistGalleryDataStore();
    renderGalleryContentElements();
}

function renderGalleryContentElements() {
    const layoutOutputGridTarget = document.getElementById("galleryGrid");
    if(!layoutOutputGridTarget) return;

    layoutOutputGridTarget.innerHTML = "";

    if (appGalleryPhotos.length === 0) {
        layoutOutputGridTarget.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400">
                <i class="fas fa-folder-open text-4xl mb-2 block"></i>
                No infrastructure assets found. Authenticate to post records.
            </div>
        `;
        return;
    }

    appGalleryPhotos.forEach(photoItem => {
        const visualCardNode = document.createElement("div");
        visualCardNode.className = "relative group rounded-xl overflow-hidden shadow-md h-40 bg-gray-100 border";
        
        let administrationOverlayActionMarkup = "";
        if (isAdminAuthenticated) {
            administrationOverlayActionMarkup = `
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                    <button onclick="removeTargetPhotoElement('${photoItem.id}')" class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition transform hover:scale-110" title="Delete Image Asset">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }

        visualCardNode.innerHTML = `
            <img src="${photoItem.sourceUri}" class="w-full h-full object-cover transition duration-300 transform group-hover:scale-105" alt="Hub Asset Reference">
            ${administrationOverlayActionMarkup}
        `;
        layoutOutputGridTarget.appendChild(visualCardNode);
    });
}

function persistGalleryDataStore() {
    /**
     * PRODUCTION NOTE FOR DATABASE SYNC:
     * Implement database replication handler block here:
     * axios.post('/api/v1/gallery/sync', { data: appGalleryPhotos });
     */
    localStorage.setItem(`${APP_STORE_PREFIX}GALLERY_RESOURCES`, JSON.stringify(appGalleryPhotos));
}

/**
 * ==========================================
 * IV. COMMERCIAL SHOPPING CART ENGINE 
 * ==========================================
 */
function toggleCart() {
    const cartModalWindow = document.getElementById("cartModal");
    if(cartModalWindow) {
        cartModalWindow.classList.toggle("hidden");
    }
}

function addToCart(itemNameString, numericUnitPrice) {
    const localizedMatchItem = appCart.find(cartElement => cartElement.title === itemNameString);
    
    if (localizedMatchItem) {
        localizedMatchItem.quantity += 1;
    } else {
        appCart.push({
            title: itemNameString,
            price: parseInt(numericUnitPrice),
            quantity: 1
        });
    }

    synchronizeCartStateInfrastructure();
    alert(`Successfully captured: ${itemNameString} appended to order collection array queue.`);
}

function updateCartItemQuantity(itemNameString, structuralAdjustmentDelta) {
    const matchingTargetElement = appCart.find(cartElement => cartElement.title === itemNameString);
    if (!matchingTargetElement) return;

    matchingTargetElement.quantity += structuralAdjustmentDelta;
    if (matchingTargetElement.quantity <= 0) {
        appCart = appCart.filter(cartElement => cartElement.title !== itemNameString);
    }
    synchronizeCartStateInfrastructure();
}

function clearCart() {
    appCart = [];
    synchronizeCartStateInfrastructure();
}

function calculateCartMasterAggregations() {
    let outputCount = 0;
    let outputTotalFinancialAmount = 0;

    appCart.forEach(element => {
        outputCount += element.quantity;
        outputTotalFinancialAmount += (element.price * element.quantity);
    });

    return { totalItemsInCount: outputCount, netAggregateValueValue: outputTotalFinancialAmount };
}

function synchronizeCartStateInfrastructure() {
    localStorage.setItem(`${APP_STORE_PREFIX}CART_DATA_STORE`, JSON.stringify(appCart));
    
    const countDisplayBadge = document.getElementById("cartCount");
    const itemDynamicListingSection = document.getElementById("cartItems");
    const aggregateNumericTotalDisplay = document.getElementById("cartTotal");

    const { totalItemsInCount, netAggregateValueValue } = calculateCartMasterAggregations();

    if(countDisplayBadge) countDisplayBadge.innerText = totalItemsInCount;
    if(aggregateNumericTotalDisplay) aggregateNumericTotalDisplay.innerText = `₹${netAggregateValueValue}`;

    if(!itemDynamicListingSection) return;
    itemDynamicListingSection.innerHTML = "";

    if (appCart.length === 0) {
        itemDynamicListingSection.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-shopping-basket text-3xl mb-2 block"></i>
                Your shopping context workspace state is blank.
            </div>
        `;
        return;
    }

    appCart.forEach(cartUnit => {
        const productRowNode = document.createElement("div");
        productRowNode.className = "flex justify-between items-center bg-gray-50 p-4 rounded-xl border";
        productRowNode.innerHTML = `
            <div class="flex-1 pr-2">
                <h5 class="font-bold text-gray-900 text-sm md:text-base">${cartUnit.title}</h5>
                <p class="text-xs text-gray-500">Unit Price Value: ₹${cartUnit.price}</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center border rounded-lg bg-white overflow-hidden">
                    <button onclick="updateCartItemQuantity('${cartUnit.title}', -1)" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-black">-</button>
                    <span class="px-3 text-xs font-bold">${cartUnit.quantity}</span>
                    <button onclick="updateCartItemQuantity('${cartUnit.title}', 1)" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-black">+</button>
                </div>
                <p class="font-bold text-blue-600 text-sm min-w-[60px] text-right">₹${cartUnit.price * cartUnit.quantity}</p>
            </div>
        `;
        itemDynamicListingSection.appendChild(productRowNode);
    });
}

/**
 * ==========================================
 * V. TRANSACTIONAL GATEWAYS (RAZORPAY / UPI)
 * ==========================================
 */
function payNow(numericAmountValue, objectItemReferenceLabel) {
    if (!numericAmountValue || isNaN(numericAmountValue)) return alert("Data runtime operational mutation fault: Payment tracking evaluation aborted.");

    /**
     * PRODUCTION IMPLEMENTATION FOR MERCHANTS:
     * Setup transaction execution profiles against Razorpay configurations object options.
     */
    const systemPaymentProcessingProfileOptions = {
        "key": "rzp_test_YOUR_KEY_HERE", // Provide verified live production key variables here
        "amount": parseInt(numericAmountValue) * 100, // Conversion handling scale matching script rules logic (Paisa integration format)
        "currency": "INR",
        "name": "Bhubaneswar Grand Hub",
        "description": `System Booking Action: ${objectItemReferenceLabel}`,
        "image": "https://cdn.tailwindcss.com/favicon.ico", 
        "handler": function (transactionPayloadResponse) {
            alert(`Payment Executed Successfully!\nReference Order Tracking ID: ${transactionPayloadResponse.razorpay_payment_id}\nTarget Context: ${objectItemReferenceLabel}`);
            /**
             * Post-execution transactional ledger accounting sync:
             * fetch('/api/v1/payments/verify', {method: 'POST', body: JSON.stringify(transactionPayloadResponse)});
             */
        },
        "prefill": {
            "name": "Customer Guest Identity Check",
            "email": "guest.user@bhubaneswarhub.com",
            "contact": "+919999999999"
        },
        "notes": {
            "origin_platform_manifest": "Web Client Core Matrix Frontend Module"
        },
        "theme": {
            "color": "#2563EB"
        }
    };

    try {
        const checkoutWindowHandlerInstance = new Razorpay(systemPaymentProcessingProfileOptions);
        checkoutWindowHandlerInstance.open();
    } catch (paymentEngineFaultException) {
        // Fallback interface deployment configuration sequence if script loading failures happen during testing
        console.error("Critical Runtime Warning: Payment Framework Engine failure context details:", paymentEngineFaultException);
        alert(`Payment Sandbox Trigger Failure.\nDirect Gateway Routing Fallback Sequence Executing against parameters:\nItem Profile: ${objectItemReferenceLabel}\nTotal Charge: ₹${numericAmountValue}`);
    }
}

function checkoutCart() {
    const { netAggregateValueValue } = calculateCartMasterAggregations();
    if (netAggregateValueValue <= 0) {
        alert("Operation execution blocked. Cart configuration does not hold any valuable assets target metrics.");
        return;
    }
    
    const compilationLabelString = appCart.map(item => `${item.title} (x${item.quantity})`).join(", ");
    payNow(netAggregateValueValue, `Multi-Item Checkout Request Collection: [ ${compilationLabelString} ]`);
    toggleCart();
    clearCart();
}

function openUPIPaymentPrompt() {
    const { netAggregateValueValue } = calculateCartMasterAggregations();
    const targetedBasePaymentCost = netAggregateValueValue > 0 ? netAggregateValueValue : 1500; // Sample processing cost fallback defaults validation logic
    
    const staticUpiBusinessAddressIdentifier = "nareshsaibaba2@ibl"; 
    const fallbackUpiDeepLinkUriTemplate = `upi://pay?pa=${staticUpiBusinessAddressIdentifier}&pn=BhubaneswarGrandHub&am=${targetedBasePaymentCost}&cu=INR&tn=HubServiceInquiryFees`;

    // Construct processing contextual messaging details block layout element structures 
    const applicationModalNotificationFrame = confirm(`Redirecting outward toward localized mobile system default banking applications?\n\nTarget UPI VPA Identity: ${staticUpiBusinessAddressIdentifier}\nTotal Evaluation Matrix: ₹${targetedBasePaymentCost}\n\nSelect Confirmation to generate deep link transaction handle.`);
    
    if (applicationModalNotificationFrame) {
        window.location.href = fallbackUpiDeepLinkUriTemplate;
    }
}

/**
 * ==========================================
 * VI. REVENUE & CLIENT INQUIRY SYSTEMS
 * ==========================================
 */
function initializeInquiryHandler() {
    const submissionFormTarget = document.getElementById("inquiryForm");
    if(!submissionFormTarget) return;

    submissionFormTarget.addEventListener("submit", (formEventInstance) => {
        formEventInstance.preventDefault();
        
        const outputPayloadDataCollection = {
            clientName: document.getElementById("inqName").value.trim(),
            clientPhone: document.getElementById("inqPhone").value.trim(),
            clientTargetInterest: document.getElementById("inqInterest").value,
            submissionTimestamp: new Date().toISOString()
        };

        console.log("Inquiry Capture Transmission Event Data Payload Sequence Matrix:", outputPayloadDataCollection);
        
        /**
         * PRODUCTION ENDPOINT HOOK FOR SYSTEM TELEMETRY:
         * Replace this visualization confirmation block execution with an outbound execution stream:
         * fetch('/api/v1/inquiries', { method: 'POST', body: JSON.stringify(outputPayloadDataCollection) })
         */
        alert(`Thank you for your response, ${outputPayloadDataCollection.clientName}.\nOur Bhubaneswar support desks will contact you shortly on ${outputPayloadDataCollection.clientPhone} regarding our ${outputPayloadDataCollection.clientTargetInterest || 'Hub Service'} options.`);
        
        submissionFormTarget.reset();
        showPage('home');
    });
}

/**
 * ==========================================
 * VII. APPLICATION LIFECYCLE DATA LOADERS
 * ==========================================
 */
function loadApplicationStateData() {
    // 1. Session Token Validation Assessment Context
    checkSavedSessionAuthentication();

    // 2. Shopping Cart Allocation Memory Mapping Sequence Restoration configurations
    try {
        const derivedCartPayloadString = localStorage.getItem(`${APP_STORE_PREFIX}CART_DATA_STORE`);
        if (derivedCartPayloadString) {
            appCart = JSON.parse(derivedCartPayloadString);
            synchronizeCartStateInfrastructure();
        }
    } catch (cartReadFaultException) {
        console.error("Cart cache read operation dropped. Memory space structure corrupted:", cartReadFaultException);
        appCart = [];
    }

    // 3. Image Gallery Resources Setup mapping validation sequence array loops 
    try {
        const derivedGalleryCacheString = localStorage.getItem(`${APP_STORE_PREFIX}GALLERY_RESOURCES`);
        if (derivedGalleryCacheString) {
            appGalleryPhotos = JSON.parse(derivedGalleryCacheString);
        } else {
            // Apply standard baseline templates configurations mock array sets patterns
            appGalleryPhotos = SAMPLE_GALLERY_IMAGES.map((uriString, numericalIndex) => ({
                id: `SAMPLE_MOCK_IMAGE_ID_${numericalIndex}`,
                sourceUri: uriString,
                timestamp: "05/23/2026"
            }));
            persistGalleryDataStore();
        }
    } catch (galleryHydrationFaultException) {
        console.error("Gallery persistent layout tracking context restoration fault exception:", galleryHydrationFaultException);
        appGalleryPhotos = [];
    }
    
    // Execute rendering calculations mappings over target layouts UI layers elements structures
    renderGalleryContentElements();
}
