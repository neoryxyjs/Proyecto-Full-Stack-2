# Vinilos Store

Una tienda online moderna y responsive para la venta de vinilos, construida con HTML5, CSS3, JavaScript y Bootstrap 5.

## Características

- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Sistema de Autenticación**: Login y registro de usuarios con validación
- **Carrito de Compras**: Funcionalidad completa de carrito con persistencia local
- **Galería de Productos**: Muestra de vinilos con imágenes y fallbacks
- **Animaciones**: Efectos visuales suaves y modernos
- **Notificaciones Toast**: Sistema de notificaciones elegante
- **Navegación Intuitiva**: Menú responsive con indicadores activos

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y gradientes
- **JavaScript ES6+**: Funcionalidad interactiva y manejo de estado
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Font Awesome**: Iconografía profesional
- **LocalStorage**: Persistencia de datos del usuario

## Estructura del Proyecto

```
vinilos-store/
├── index.html          # Página principal
├── login.html          # Página de login y registro
├── nosotros.html       # Página sobre nosotros
├── css/
│   └── style.css       # Estilos personalizados
├── js/
│   └── script.js       # Funcionalidad JavaScript
├── images/             # Imágenes de productos
└── README.md          # Documentación del proyecto
```

## Funcionalidades Principales

### Sistema de Usuarios
- Registro de nuevos usuarios con validación
- Login con recordar sesión
- Recuperación de contraseña
- Perfil de usuario con información personalizada

### Catálogo de Productos
- Galería de vinilos con imágenes
- Sistema de fallback para imágenes
- Información detallada de cada producto
- Precios y calificaciones

### Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Persistencia en localStorage
- Cálculo de totales

### Interfaz de Usuario
- Navegación responsive
- Animaciones de entrada
- Notificaciones toast
- Scroll suave
- Botón de volver arriba

## Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd vinilos-store
   ```

2. **Abrir en el navegador**:
   - Simplemente abre `index.html` en tu navegador web
   - O usa un servidor local como Live Server en VS Code

3. **Funcionalidades disponibles**:
   - Navegar por las diferentes páginas
   - Registrar una nueva cuenta
   - Iniciar sesión
   - Explorar productos
   - Agregar productos al carrito

## Personalización

### Colores
Los colores principales se definen en las variables CSS en `css/style.css`:
```css
:root {
    --primary-color: #0d6efd;
    --secondary-color: #6c757d;
    /* ... más variables */
}
```

### Productos
Para agregar nuevos productos, edita la función `getProductById()` en `js/script.js`:
```javascript
const products = {
    // Agregar nuevos productos aquí
};
```

### Imágenes
Coloca las imágenes de productos en la carpeta `images/` y actualiza las referencias en `imageSources`.

## Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

- **Proyecto**: Vinilos Store
- **Año**: 2025
- **Tecnologías**: HTML5, CSS3, JavaScript, Bootstrap 5

---

Desarrollado con ❤️ para los amantes de la música y los vinilos.
