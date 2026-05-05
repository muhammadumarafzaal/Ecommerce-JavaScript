// Product Data
const products = [
    { id: 1, name: "Red Printed T-Shirt", price: 2500, rating: 4, image: "images/product-1.jpg", category: "mens" },
    { id: 2, name: "HRX Black Shoes", price: 4500, rating: 5, image: "images/product-2.jpg", category: "shoes" },
    { id: 3, name: "Gray Trackpants", price: 3000, rating: 4, image: "images/product-3.jpg", category: "mens" },
    { id: 4, name: "Blue Printed T-Shirt", price: 2200, rating: 4, image: "images/product-4.jpg", category: "mens" },
    { id: 5, name: "Silver Sports Shoes", price: 5500, rating: 5, image: "images/product-5.jpg", category: "shoes" },
    { id: 6, name: "Black Printed T-Shirt", price: 2500, rating: 4, image: "images/product-6.jpg", category: "mens" },
    { id: 7, name: "HRX Socks", price: 500, rating: 3, image: "images/product-7.jpg", category: "mens" },
    { id: 8, name: "Black Fossil Watch", price: 12000, rating: 5, image: "images/product-8.jpg", category: "accessories" },
    { id: 9, name: "Black Roadstar Watch", price: 8000, rating: 4, image: "images/product-9.jpg", category: "accessories" },
    { id: 10, name: "Black Sports Shoes", price: 6500, rating: 5, image: "images/product-10.jpg", category: "shoes" },
    { id: 11, name: "Gray Casual Shoes", price: 3500, rating: 4, image: "images/product-11.jpg", category: "shoes" },
    { id: 12, name: "Black Nike Trackpants", price: 4000, rating: 5, image: "images/product-12.jpg", category: "mens" }
];

const teamMembers = [
    { name: "Muhammad Umar", role: "CEO & Founder", image: "images/gallery-1.jpg" },
    { name: "Sarah Khan", role: "Lead Designer", image: "images/gallery-2.jpg" },
    { name: "Ahmed Ali", role: "Marketing Head", image: "images/gallery-3.jpg" },
    { name: "Dua Malik", role: "Operations Manager", image: "images/gallery-4.jpg" }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const featuredProductsContainer = document.getElementById('featuredProducts');
const latestProductsContainer = document.getElementById('latestProducts');
const allProductsContainer = document.getElementById('allProducts');
const teamMembersContainer = document.getElementById('teamMembers');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const cartCount = document.getElementById('cartCount');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('nav ul');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    if (featuredProductsContainer) renderProducts(products.slice(0, 4), featuredProductsContainer);
    if (latestProductsContainer) renderProducts(products.slice(4, 12), latestProductsContainer);
    if (allProductsContainer) renderProducts(products, allProductsContainer);
    if (teamMembersContainer) renderTeamMembers();

    // Event Listeners
    if (cartBtn) cartBtn.onclick = () => cartModal.style.display = "block";
    if (closeCart) closeCart.onclick = () => cartModal.style.display = "none";
    
    window.onclick = (event) => {
        if (event.target == cartModal) cartModal.style.display = "none";
        if (event.target == document.getElementById('loginModal')) document.getElementById('loginModal').style.display = "none";
    }

    if (hamburger) {
        hamburger.onclick = () => {
            navLinks.classList.toggle('show');
        };
    }

    // Filters logic
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.onchange = filterProducts;
    }

    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        priceFilter.oninput = () => {
            document.getElementById('priceValue').innerText = `0 - ${priceFilter.value} PKR`;
            filterProducts();
        };
    }

    // Login Modal
    const accountBtn = document.getElementById('accountBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');

    if (accountBtn) accountBtn.onclick = (e) => {
        e.preventDefault();
        loginModal.style.display = "block";
    };
    if (closeLogin) closeLogin.onclick = () => loginModal.style.display = "none";
});

// Helper Functions
function renderProducts(productsList, container) {
    container.innerHTML = productsList.map(product => `
        <div class="col-4">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="rating">
                ${generateStars(product.rating)}
            </div>
            <p>${product.price} PKR</p>
            <button class="button" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function renderTeamMembers() {
    teamMembersContainer.innerHTML = teamMembers.map(member => `
        <div class="col-4" style="text-align: center;">
            <img src="${member.image}" style="border-radius: 50%; width: 150px; height: 150px; object-fit: cover; margin-bottom: 20px;">
            <h4>${member.name}</h4>
            <p>${member.role}</p>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `<i class="${i < rating ? 'fas' : 'far'} fa-star"></i>`;
    }
    return stars;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCart();
    
    // Quick animation
    cartCount.style.transform = "scale(1.5)";
    setTimeout(() => cartCount.style.transform = "scale(1)", 200);
}

function updateCartUI() {
    if (cartCount) cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <img src="${item.image}" width="50px">
                    <div>
                        <h5>${item.name}</h5>
                        <small>${item.price} PKR x ${item.quantity}</small>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="border:none; background:none; color:red; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }
    }

    if (totalPrice) {
        totalPrice.innerText = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = document.getElementById('priceFilter').value;
    
    const filtered = products.filter(p => {
        const matchesCategory = category === "" || p.category === category;
        const matchesPrice = p.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });

    renderProducts(filtered, allProductsContainer);
    
    const noProducts = document.getElementById('noProducts');
    if (noProducts) {
        noProducts.style.display = filtered.length === 0 ? "block" : "none";
    }
}

// Scroll Reveal Effect
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.col-4, .category-card, .hero');
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        if (position < screenHeight * 0.9) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
});
