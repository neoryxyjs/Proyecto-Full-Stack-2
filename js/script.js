let cart = [];
let currentUser = null;
let registeredUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadCartFromStorage();
    loadUsersFromStorage();
    updateCartUI();
    updateUserMenu();
    preloadImages();
    initializeProductImages();
});

function initializeApp() {
    addFadeInAnimations();
    setupSmoothScrolling();
    setupScrollToTop();
    setupFormValidations();
}

function setupEventListeners() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
}

function addFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.card, .feature-card, .product-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupFormValidations() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', validatePassword);
    });
}

function validateEmail(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(e.target, 'Por favor, ingresa un email válido');
    } else {
        clearFieldError(e.target);
    }
}

function validatePassword(e) {
    const password = e.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    
    if (password && !passwordRegex.test(password)) {
        showFieldError(e.target, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
    } else {
        clearFieldError(e.target);
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Las contraseñas no coinciden');
    } else {
        clearFieldError(confirmPassword);
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = this.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }
    
    const user = findUserByEmail(email);
    
    if (user && verifyPassword(password, user.password)) {
        currentUser = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName
        };
        
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        showToast(`¡Bienvenido ${user.firstName}! Has iniciado sesión correctamente`, 'success');
        
        updateUserMenu();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showToast('Credenciales incorrectas. Intenta nuevamente', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    if (isEmailRegistered(email)) {
        showToast('Este email ya está registrado. Intenta con otro email o inicia sesión.', 'error');
        return;
    }
    
    const newUser = {
        id: generateUserId(),
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        password: hashPassword(password),
        dateRegistered: new Date().toISOString(),
        isActive: true,
        lastLogin: null
    };
    
    registeredUsers.push(newUser);
    
    saveUsersToStorage();
    
    showToast(`¡Cuenta creada exitosamente! Bienvenido ${firstName}. Ya puedes iniciar sesión.`, 'success');
    
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
    
    document.getElementById('registerForm').reset();
    
    setTimeout(() => {
        document.getElementById('email').value = email;
        showToast('Puedes iniciar sesión con tus nuevas credenciales', 'info');
    }, 1000);
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showToast('Por favor, ingresa tu email', 'error');
        return;
    }
    
    showToast('Se ha enviado un enlace de recuperación a tu email', 'success');
    
    const forgotModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    forgotModal.hide();
    
    document.getElementById('forgotPasswordForm').reset();
}

function addToCart(productId) {
    const product = getProductById(productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCartToStorage();
        updateCartUI();
        showToast(`${product.name} agregado al carrito`, 'success');
        
        const button = event.target.closest('button');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

const imageCache = new Map();

const imageSources = {
    1: [
        'images/swimming.jpg',
        'https://via.placeholder.com/300x300/667eea/ffffff?text=Swimming'
    ],
    2: [
        'images/hybrid-theory.jpg',
        'https://via.placeholder.com/300x300/f093fb/ffffff?text=Hybrid+Theory'
    ],
    3: [
        'images/circles.jpg',
        'https://via.placeholder.com/300x300/4facfe/ffffff?text=Circles'
    ],
    4: [
        'images/meteora.jpg',
        'https://via.placeholder.com/300x300/43e97b/ffffff?text=Meteora'
    ]
};

const fallbackGradients = {
    1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
};

function createImageWithFallback(productId, productName) {
    const container = document.createElement('div');
    container.className = 'card-img-top d-flex align-items-center justify-content-center';
    container.style.cssText = `
        height: 300px;
        background: ${fallbackGradients[productId]};
        color: white;
        font-size: 24px;
        font-weight: bold;
        border-radius: 15px 15px 0 0;
        position: relative;
        overflow: hidden;
    `;
    
    const img = document.createElement('img');
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;
    
    const text = document.createElement('div');
    text.textContent = productName;
    text.style.cssText = `
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 20px;
        display: none;
    `;
    
    const handleImageError = () => {
        console.log(`Imagen falló para producto ${productId}, usando gradiente`);
        img.style.opacity = '0';
        text.style.display = 'block';
    };
    
    const handleImageLoad = () => {
        console.log(`Imagen cargada exitosamente para producto ${productId}`);
        img.style.opacity = '1';
        text.style.display = 'none';
    };
    
    img.onerror = handleImageError;
    img.onload = handleImageLoad;
    
    const sources = imageSources[productId] || [];
    if (sources.length > 0) {
        img.src = sources[0];
    } else {
        img.style.opacity = '0';
        text.style.display = 'block';
    }
    
    container.appendChild(img);
    container.appendChild(text);
    
    return container;
}

function preloadImages() {
    Object.keys(imageSources).forEach(productId => {
        const sources = imageSources[productId];
        if (sources && sources.length > 0) {
            const img = new Image();
            img.onload = () => {
                imageCache.set(productId, sources[0]);
                console.log(`Imagen precargada para producto ${productId}`);
            };
            img.onerror = () => {
                console.log(`Precarga falló para producto ${productId}, usando fallback`);
            };
            img.src = sources[0];
        }
    });
}

function initializeProductImages() {
    const products = [
        { id: 1, name: 'Swimming' },
        { id: 2, name: 'Hybrid Theory' },
        { id: 3, name: 'Circles' },
        { id: 4, name: 'Meteora' }
    ];
    
    products.forEach(product => {
        const container = document.getElementById(`product-image-${product.id}`);
        if (container) {
            const imageElement = createImageWithFallback(product.id, product.name);
            container.insertBefore(imageElement, container.firstChild);
        }
    });
}

function getProductById(id) {
    const products = {
        1: {
            id: 1,
            name: 'Swimming',
            artist: 'Mac Miller',
            genre: 'Hip Hop',
            price: 39.99,
            image: imageSources[1][0],
            fallbackGradient: fallbackGradients[1],
            year: 2018,
            description: 'El octavo álbum de estudio de Mac Miller, lanzado póstumamente en 2018.'
        },
        2: {
            id: 2,
            name: 'Hybrid Theory',
            artist: 'Linkin Park',
            genre: 'Nu Metal',
            price: 44.99,
            image: imageSources[2][0],
            fallbackGradient: fallbackGradients[2],
            year: 2000,
            description: 'El álbum debut de Linkin Park que los catapultó a la fama mundial.'
        },
        3: {
            id: 3,
            name: 'Circles',
            artist: 'Mac Miller',
            genre: 'Hip Hop',
            price: 42.99,
            image: imageSources[3][0],
            fallbackGradient: fallbackGradients[3],
            year: 2020,
            description: 'El último álbum de Mac Miller, completado póstumamente y lanzado en 2020.'
        },
        4: {
            id: 4,
            name: 'Meteora',
            artist: 'Linkin Park',
            genre: 'Nu Metal',
            price: 46.99,
            image: imageSources[4][0],
            fallbackGradient: fallbackGradients[4],
            year: 2003,
            description: 'El segundo álbum de estudio de Linkin Park, continuando su éxito comercial.'
        }
    };
    
    return products[id];
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function loadUsersFromStorage() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        registeredUsers = JSON.parse(savedUsers);
    }
}

function saveUsersToStorage() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

function generateUserId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function isEmailRegistered(email) {
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

function findUserByEmail(email) {
    return registeredUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function verifyPassword(password, hashedPassword) {
    return hashPassword(password) === hashedPassword;
}

function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast show`;
    toast.setAttribute('role', 'alert');
    
    const iconClass = {
        success: 'fa-check-circle text-success',
        error: 'fa-exclamation-circle text-danger',
        warning: 'fa-exclamation-triangle text-warning',
        info: 'fa-info-circle text-info'
    }[type] || 'fa-info-circle text-info';
    
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas ${iconClass} me-2"></i>
            <strong class="me-auto">Vinilos Store</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 5000
    });
    
    bsToast.show();
}

function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const title = product.querySelector('.card-title').textContent.toLowerCase();
        const description = product.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all') {
            product.style.display = 'block';
        } else {
            const productCategory = product.querySelector('.card-text').textContent.toLowerCase();
            if (productCategory.includes(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        }
    });
}

function sortProducts(sortBy) {
    const productContainer = document.querySelector('.row.g-4');
    const products = Array.from(productContainer.children);
    
    products.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'price-asc':
                aValue = parseFloat(a.querySelector('.text-primary').textContent.replace('$', ''));
                bValue = parseFloat(b.querySelector('.text-primary').textContent.replace('$', ''));
                return aValue - bValue;
            case 'price-desc':
                aValue = parseFloat(a.querySelector('.text-primary').textContent.replace('$', ''));
                bValue = parseFloat(b.querySelector('.text-primary').textContent.replace('$', ''));
                return bValue - aValue;
            case 'name-asc':
                aValue = a.querySelector('.card-title').textContent;
                bValue = b.querySelector('.card-title').textContent;
                return aValue.localeCompare(bValue);
            case 'name-desc':
                aValue = a.querySelector('.card-title').textContent;
                bValue = b.querySelector('.card-title').textContent;
                return bValue.localeCompare(aValue);
            default:
                return 0;
        }
    });
    
    products.forEach(product => productContainer.appendChild(product));
}

function toggleProductDetails(productId) {
    const detailsElement = document.getElementById(`details-${productId}`);
    if (detailsElement) {
        detailsElement.classList.toggle('d-none');
    }
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCartToStorage();
        updateCartUI();
    }
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showToast('Carrito vaciado', 'info');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'warning');
        return;
    }
    
    showToast('Redirigiendo al checkout...', 'info');
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.toggle('show');
    }
}

function closeCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.remove('show');
    }
}

function showProductModal(productId) {
    const product = getProductById(productId);
    if (product) {
        showToast(`Mostrando detalles de ${product.name}`, 'info');
    }
}

function addToFavorites(productId) {
    const product = getProductById(productId);
    if (product) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showToast(`${product.name} agregado a favoritos`, 'success');
        } else {
            showToast(`${product.name} ya está en favoritos`, 'warning');
        }
    }
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showToast('Producto removido de favoritos', 'info');
}

function isInFavorites(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(productId);
}

function togglePasswordVisibilityById(inputId) {
    const input = document.getElementById(inputId);
    const toggleButton = input.nextElementSibling;
    const icon = toggleButton.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    
    const errorElements = form.querySelectorAll('.invalid-feedback');
    errorElements.forEach(error => error.remove());
    
    const invalidInputs = form.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => input.classList.remove('is-invalid'));
}

function showButtonLoading(button, text = 'Cargando...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="loading"></span> ${text}`;
    button.disabled = true;
    
    return function hideLoading() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedSearch = debounce(searchProducts, 300);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
});

function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initializePopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

function getAllUsers() {
    return registeredUsers;
}

function getUserById(userId) {
    return registeredUsers.find(user => user.id === userId);
}

function updateUser(userId, updateData) {
    const userIndex = registeredUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updateData };
        saveUsersToStorage();
        return true;
    }
    return false;
}

function deactivateUser(userId) {
    return updateUser(userId, { isActive: false });
}

function activateUser(userId) {
    return updateUser(userId, { isActive: true });
}

function deleteUser(userId) {
    const userIndex = registeredUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        registeredUsers.splice(userIndex, 1);
        saveUsersToStorage();
        return true;
    }
    return false;
}

function getUserStats() {
    const totalUsers = registeredUsers.length;
    const activeUsers = registeredUsers.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = registeredUsers.filter(user => 
        new Date(user.dateRegistered) > thirtyDaysAgo
    ).length;
    
    return {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        recent: recentUsers
    };
}

function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showToast(`¡Bienvenido de nuevo ${currentUser.firstName}!`, 'info');
        updateUserMenu();
    }
}

function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (currentUser) {
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.firstName;
        if (loginLink) loginLink.style.display = 'none';
    } else {
        if (userMenu) userMenu.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showToast('Has cerrado sesión correctamente', 'info');
    
    updateUserMenu();
    
    if (!window.location.pathname.includes('login.html')) {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function showUserInfo() {
    if (currentUser) {
        showToast(`Usuario: ${currentUser.name} (${currentUser.email})`, 'info');
    } else {
        showToast('No hay usuario logueado', 'warning');
    }
}

function changePassword(userId, oldPassword, newPassword) {
    const user = getUserById(userId);
    if (user && verifyPassword(oldPassword, user.password)) {
        const hashedNewPassword = hashPassword(newPassword);
        return updateUser(userId, { password: hashedNewPassword });
    }
    return false;
}

function exportUsersData() {
    const dataStr = JSON.stringify(registeredUsers, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios_vinilos_store.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importUsersData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedUsers = JSON.parse(e.target.result);
            if (Array.isArray(importedUsers)) {
                registeredUsers = importedUsers;
                saveUsersToStorage();
                showToast('Datos de usuarios importados correctamente', 'success');
            } else {
                showToast('Formato de archivo inválido', 'error');
            }
        } catch (error) {
            showToast('Error al importar datos: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    initializePopovers();
    checkLoggedInUser();
});

function debugUsers() {
    console.log('Usuarios registrados:', registeredUsers);
    console.log('Usuario actual:', currentUser);
    console.log('localStorage cart:', localStorage.getItem('cart'));
    console.log('localStorage users:', localStorage.getItem('registeredUsers'));
    console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
}

function clearAllData() {
    localStorage.clear();
    registeredUsers = [];
    currentUser = null;
    cart = [];
    console.log('Todos los datos han sido limpiados');
}

window.addToCart = addToCart;
window.searchProducts = debouncedSearch;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.toggleProductDetails = toggleProductDetails;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.showProductModal = showProductModal;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.isInFavorites = isInFavorites;
window.togglePasswordVisibilityById = togglePasswordVisibilityById;
window.validateForm = validateForm;
window.clearForm = clearForm;
window.showButtonLoading = showButtonLoading;
window.getAllUsers = getAllUsers;
window.getUserById = getUserById;
window.updateUser = updateUser;
window.deactivateUser = deactivateUser;
window.activateUser = activateUser;
window.deleteUser = deleteUser;
window.getUserStats = getUserStats;
window.logout = logout;
window.showUserInfo = showUserInfo;
window.changePassword = changePassword;
window.exportUsersData = exportUsersData;
window.importUsersData = importUsersData;
window.debugUsers = debugUsers;
window.clearAllData = clearAllData;
