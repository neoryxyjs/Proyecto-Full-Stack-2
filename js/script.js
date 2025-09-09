// JavaScript para Vinilos Store

// Variables globales
let cart = [];
let currentUser = null;
let registeredUsers = [];

// Inicialización cuando el DOM esté cargado
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

// Función de inicialización
function initializeApp() {
    // Agregar animaciones de entrada
    addFadeInAnimations();
    
    // Configurar scroll suave
    setupSmoothScrolling();
    
    // Configurar scroll to top
    setupScrollToTop();
    
    // Configurar validaciones de formularios
    setupFormValidations();
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación móvil
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Formulario de recuperación de contraseña
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Toggle de visibilidad de contraseña
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Validación de confirmación de contraseña
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
}

// Agregar animaciones de entrada
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
    
    // Observar elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll('.card, .feature-card, .product-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Configurar scroll suave
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustar para navbar fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar botón de scroll to top
function setupScrollToTop() {
    // Crear botón de scroll to top
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollToTopBtn);
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Funcionalidad del botón
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Configurar validaciones de formularios
function setupFormValidations() {
    // Validación en tiempo real para email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Validación en tiempo real para contraseña
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', validatePassword);
    });
}

// Validar email
function validateEmail(e) {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(e.target, 'Por favor, ingresa un email válido');
    } else {
        clearFieldError(e.target);
    }
}

// Validar contraseña
function validatePassword(e) {
    const password = e.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    
    if (password && !passwordRegex.test(password)) {
        showFieldError(e.target, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
    } else {
        clearFieldError(e.target);
    }
}

// Validar coincidencia de contraseñas
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Las contraseñas no coinciden');
    } else {
        clearFieldError(confirmPassword);
    }
}

// Mostrar error en campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Toggle visibilidad de contraseña
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

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validación básica
    if (!email || !password) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Buscar usuario en usuarios registrados
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
        
        // Actualizar menú de usuario
        updateUserMenu();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showToast('Credenciales incorrectas. Intenta nuevamente', 'error');
    }
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validaciones
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
    
    // Verificar si el email ya está registrado
    if (isEmailRegistered(email)) {
        showToast('Este email ya está registrado. Intenta con otro email o inicia sesión.', 'error');
        return;
    }
    
    // Crear nuevo usuario
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
    
    // Agregar usuario a la lista
    registeredUsers.push(newUser);
    
    // Guardar en localStorage
    saveUsersToStorage();
    
    // Mostrar mensaje de éxito
    showToast(`¡Cuenta creada exitosamente! Bienvenido ${firstName}. Ya puedes iniciar sesión.`, 'success');
    
    // Cerrar modal y limpiar formulario
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
    
    // Limpiar formulario
    document.getElementById('registerForm').reset();
    
    // Opcional: Auto-login después del registro
    setTimeout(() => {
        // Llenar automáticamente el formulario de login
        document.getElementById('email').value = email;
        showToast('Puedes iniciar sesión con tus nuevas credenciales', 'info');
    }, 1000);
}

// Manejar recuperación de contraseña
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showToast('Por favor, ingresa tu email', 'error');
        return;
    }
    
    // Simular envío de email
    showToast('Se ha enviado un enlace de recuperación a tu email', 'success');
    
    // Cerrar modal
    const forgotModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    forgotModal.hide();
    
    // Limpiar formulario
    document.getElementById('forgotPasswordForm').reset();
}

// Agregar producto al carrito
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
        
        // Animación del botón
        const button = event.target.closest('button');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// Sistema de imágenes con fallback inteligente
const imageCache = new Map();

// Múltiples fuentes de imágenes con fallback
const imageSources = {
    1: [ // Swimming - Mac Miller
        'images/swimming.jpg', // Imagen local
        'https://via.placeholder.com/300x300/667eea/ffffff?text=Swimming' // Placeholder fallback
    ],
    2: [ // Hybrid Theory - Linkin Park
        'images/hybrid-theory.jpg', // Imagen local
        'https://via.placeholder.com/300x300/f093fb/ffffff?text=Hybrid+Theory' // Placeholder fallback
    ],
    3: [ // Circles - Mac Miller
        'images/circles.jpg', // Imagen local
        'https://via.placeholder.com/300x300/4facfe/ffffff?text=Circles' // Placeholder fallback
    ],
    4: [ // Meteora - Linkin Park
        'images/meteora.jpg', // Imagen local
        'https://via.placeholder.com/300x300/43e97b/ffffff?text=Meteora' // Placeholder fallback
    ]
};

// Gradientes de fallback para cada álbum
const fallbackGradients = {
    1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Swimming - azul-púrpura
    2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Hybrid Theory - rosa-rojo
    3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Circles - azul-cyan
    4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'  // Meteora - verde-turquesa
};

// Función para crear imagen con fallback múltiple
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
    
    // Crear imagen
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
    
    // Crear texto de fallback
    const text = document.createElement('div');
    text.textContent = productName;
    text.style.cssText = `
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 20px;
        display: none;
    `;
    
    // Función para manejar el error de imagen
    const handleImageError = () => {
        console.log(`Imagen falló para producto ${productId}, usando gradiente`);
        img.style.opacity = '0';
        text.style.display = 'block';
    };
    
    // Función para manejar la carga exitosa
    const handleImageLoad = () => {
        console.log(`Imagen cargada exitosamente para producto ${productId}`);
        img.style.opacity = '1';
        text.style.display = 'none';
    };
    
    // Configurar eventos
    img.onerror = handleImageError;
    img.onload = handleImageLoad;
    
    // Cargar la primera imagen (placeholder confiable)
    const sources = imageSources[productId] || [];
    if (sources.length > 0) {
        img.src = sources[0];
    } else {
        // Si no hay fuentes, mostrar gradiente
        img.style.opacity = '0';
        text.style.display = 'block';
    }
    
    // Agregar elementos al contenedor
    container.appendChild(img);
    container.appendChild(text);
    
    return container;
}

// Función para precargar imágenes
function preloadImages() {
    Object.keys(imageSources).forEach(productId => {
        const sources = imageSources[productId];
        if (sources && sources.length > 0) {
            // Intentar precargar la primera fuente
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

// Función para inicializar las imágenes de productos
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

// Obtener producto por ID
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

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Cargar usuarios registrados desde localStorage
function loadUsersFromStorage() {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        registeredUsers = JSON.parse(savedUsers);
    }
}

// Guardar usuarios registrados en localStorage
function saveUsersToStorage() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// Generar ID único para usuarios
function generateUserId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Verificar si un email ya está registrado
function isEmailRegistered(email) {
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Buscar usuario por email
function findUserByEmail(email) {
    return registeredUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Hash simple de contraseña (en producción usar bcrypt)
function hashPassword(password) {
    // Hash simple para demostración - en producción usar bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32bit integer
    }
    return hash.toString();
}

// Verificar contraseña
function verifyPassword(password, hashedPassword) {
    return hashPassword(password) === hashedPassword;
}

// Mostrar notificación toast
function showToast(message, type = 'info') {
    // Crear contenedor si no existe
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Crear toast
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
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    // Configurar Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 5000
    });
    
    bsToast.show();
}

// Función para buscar productos
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

// Función para filtrar productos por categoría
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

// Función para ordenar productos
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
    
    // Reorganizar elementos en el DOM
    products.forEach(product => productContainer.appendChild(product));
}

// Función para mostrar/ocultar detalles del producto
function toggleProductDetails(productId) {
    const detailsElement = document.getElementById(`details-${productId}`);
    if (detailsElement) {
        detailsElement.classList.toggle('d-none');
    }
}

// Función para actualizar cantidad en carrito
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

// Función para calcular total del carrito
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para vaciar carrito
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showToast('Carrito vaciado', 'info');
}

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'warning');
        return;
    }
    
    // Aquí se implementaría la lógica de checkout
    showToast('Redirigiendo al checkout...', 'info');
}

// Función para mostrar/ocultar carrito
function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.toggle('show');
    }
}

// Función para cerrar carrito
function closeCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.remove('show');
    }
}

// Función para mostrar modal de producto
function showProductModal(productId) {
    const product = getProductById(productId);
    if (product) {
        // Aquí se implementaría la lógica para mostrar un modal con detalles del producto
        showToast(`Mostrando detalles de ${product.name}`, 'info');
    }
}

// Función para agregar a favoritos
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

// Función para remover de favoritos
function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showToast('Producto removido de favoritos', 'info');
}

// Función para verificar si un producto está en favoritos
function isInFavorites(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(productId);
}

// Función para mostrar/ocultar contraseña en formularios
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

// Función para validar formulario completo
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

// Función para limpiar formulario
function clearForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    
    // Limpiar errores
    const errorElements = form.querySelectorAll('.invalid-feedback');
    errorElements.forEach(error => error.remove());
    
    const invalidInputs = form.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => input.classList.remove('is-invalid'));
}

// Función para mostrar loading en botones
function showButtonLoading(button, text = 'Cargando...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="loading"></span> ${text}`;
    button.disabled = true;
    
    return function hideLoading() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Función para debounce (optimizar búsquedas)
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

// Configurar búsqueda con debounce
const debouncedSearch = debounce(searchProducts, 300);

// Event listeners adicionales
document.addEventListener('keydown', function(e) {
    // Cerrar modales con Escape
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

// Función para inicializar tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para inicializar popovers
function initializePopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Función para obtener todos los usuarios registrados
function getAllUsers() {
    return registeredUsers;
}

// Función para obtener un usuario por ID
function getUserById(userId) {
    return registeredUsers.find(user => user.id === userId);
}

// Función para actualizar información de usuario
function updateUser(userId, updateData) {
    const userIndex = registeredUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updateData };
        saveUsersToStorage();
        return true;
    }
    return false;
}

// Función para desactivar usuario
function deactivateUser(userId) {
    return updateUser(userId, { isActive: false });
}

// Función para activar usuario
function activateUser(userId) {
    return updateUser(userId, { isActive: true });
}

// Función para eliminar usuario
function deleteUser(userId) {
    const userIndex = registeredUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        registeredUsers.splice(userIndex, 1);
        saveUsersToStorage();
        return true;
    }
    return false;
}

// Función para obtener estadísticas de usuarios
function getUserStats() {
    const totalUsers = registeredUsers.length;
    const activeUsers = registeredUsers.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    // Usuarios registrados en los últimos 30 días
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

// Función para verificar si hay usuarios logueados al cargar la página
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showToast(`¡Bienvenido de nuevo ${currentUser.firstName}!`, 'info');
        updateUserMenu();
    }
}

// Función para actualizar el menú de usuario en la navegación
function updateUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (currentUser) {
        // Mostrar menú de usuario
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.firstName;
        if (loginLink) loginLink.style.display = 'none';
    } else {
        // Mostrar enlace de login
        if (userMenu) userMenu.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
    }
}

// Función para cerrar sesión
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showToast('Has cerrado sesión correctamente', 'info');
    
    // Actualizar menú de usuario
    updateUserMenu();
    
    // Redirigir a login si no estamos ya ahí
    if (!window.location.pathname.includes('login.html')) {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Función para mostrar información del usuario logueado
function showUserInfo() {
    if (currentUser) {
        showToast(`Usuario: ${currentUser.name} (${currentUser.email})`, 'info');
    } else {
        showToast('No hay usuario logueado', 'warning');
    }
}

// Función para cambiar contraseña
function changePassword(userId, oldPassword, newPassword) {
    const user = getUserById(userId);
    if (user && verifyPassword(oldPassword, user.password)) {
        const hashedNewPassword = hashPassword(newPassword);
        return updateUser(userId, { password: hashedNewPassword });
    }
    return false;
}

// Función para exportar datos de usuarios (para administración)
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

// Función para importar datos de usuarios (para administración)
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

// Inicializar tooltips y popovers cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    initializePopovers();
    checkLoggedInUser();
});

// Función de depuración para verificar el estado
function debugUsers() {
    console.log('Usuarios registrados:', registeredUsers);
    console.log('Usuario actual:', currentUser);
    console.log('localStorage cart:', localStorage.getItem('cart'));
    console.log('localStorage users:', localStorage.getItem('registeredUsers'));
    console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
}

// Función para limpiar todos los datos (solo para desarrollo)
function clearAllData() {
    localStorage.clear();
    registeredUsers = [];
    currentUser = null;
    cart = [];
    console.log('Todos los datos han sido limpiados');
}

// Exportar funciones para uso global
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
