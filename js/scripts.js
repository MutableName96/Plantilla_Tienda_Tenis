// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const cartBtn = document.querySelector('.btn-outline-dark[type="submit"]');
    const cartBadge = cartBtn.querySelector('.badge');
    const addToCartBtns = document.querySelectorAll('.btn-outline-dark:not([type="submit"])');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart); // Verifica el contenido del carrito al cargar la página
    
    // Actualizar el badge del carrito
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        console.log('Total de artículos en el carrito:', totalItems); // Verifica el total de artículos
        cartBadge.textContent = totalItems;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Función para agregar producto al carrito
    function addToCart(event) {
        const button = event.target;
        console.log('Botón presionado:', button); // Verifica el botón que fue presionado
        const card = button.closest('.card');
        const productName = card.querySelector('.fw-bolder').textContent;
        
        // Extraer precio (maneja diferentes formatos de precio)
        let priceText = card.querySelector('.card-body').textContent;
        let price;
        
        // Buscar el precio más bajo si hay un rango
        if (priceText.includes('-')) {
            const prices = priceText.match(/\$\d+\.\d+/g);
            price = parseFloat(prices[0].replace('$', ''));
        } 
        // Buscar precio con descuento
        else if (priceText.includes('text-decoration-line-through')) {
            const prices = priceText.match(/\$\d+\.\d+/g);
            price = parseFloat(prices[1].replace('$', ''));
        }
        // Precio normal
        else {
            const priceMatch = priceText.match(/\$\d+\.\d+/);
            price = priceMatch ? parseFloat(priceMatch[0].replace('$', '')) : 0;
        }
        
        // Buscar imagen
        const image = card.querySelector('.card-img-top').src;
        
        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        updateCartBadge();
        
        // Mostrar notificación
        showNotification(`${productName} añadido al carrito`);
    }
    
    // Función para mostrar notificación
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#28a745';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        notification.style.animation = 'slideIn 0.5s, fadeOut 0.5s 2.5s forwards';
        
        document.body.appendChild(notification);
        
        // Eliminar la notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Función para manejar el clic en el botón del carrito
    function handleCartClick() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Crear modal del carrito
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.zIndex = '1000';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        
        // Contenido del modal
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.maxWidth = '600px';
        modalContent.style.width = '90%';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflowY = 'auto';
        
        // Título
        const title = document.createElement('h2');
        title.textContent = 'Tu Carrito';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        
        // Lista de productos
        const productList = document.createElement('div');
        
        // Total
        const totalDiv = document.createElement('div');
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.marginTop = '20px';
        totalDiv.style.textAlign = 'right';
        
        // Botones
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.justifyContent = 'space-between';
        buttonsDiv.style.marginTop = '20px';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Cerrar';
        closeBtn.className = 'btn btn-secondary';
        closeBtn.onclick = () => modal.remove();
        
        const checkoutBtn = document.createElement('button');
        checkoutBtn.textContent = 'Finalizar Compra';
        checkoutBtn.className = 'btn btn-primary';
        checkoutBtn.onclick = () => {
            modal.remove();
            window.location.href = 'checkout.html'; // Redirige a la página de pago
        };
        
        
        buttonsDiv.appendChild(closeBtn);
        buttonsDiv.appendChild(checkoutBtn);
        
        // Función para actualizar el contenido del carrito
        function updateCartContent() {
            console.log(cart); // Verifica el contenido del carrito antes de mostrar el modal
            productList.innerHTML = '';
            
            if (cart.length === 0) {
                productList.innerHTML = '<p>Tu carrito está vacío</p>';
                totalDiv.textContent = '';
                checkoutBtn.disabled = true;
                return;
            }
            
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.marginBottom = '15px';
                itemDiv.style.paddingBottom = '15px';
                itemDiv.style.borderBottom = '1px solid #eee';
                
                // Imagen
                const img = document.createElement('img');
                img.src = item.image;
                img.style.width = '80px';
                img.style.height = '80px';
                img.style.objectFit = 'cover';
                img.style.marginRight = '15px';
                
                // Info
                const infoDiv = document.createElement('div');
                infoDiv.style.flexGrow = '1';
                
                const name = document.createElement('h5');
                name.textContent = item.name;
                name.style.margin = '0';
                name.style.fontSize = '1rem';
                
                const price = document.createElement('p');
                price.textContent = `$${item.price.toFixed(2)} x ${item.quantity}`;
                price.style.margin = '5px 0';
                
                const subtotal = document.createElement('p');
                subtotal.textContent = `Subtotal: $${(item.price * item.quantity).toFixed(2)}`;
                subtotal.style.fontWeight = 'bold';
                
                // Controles de cantidad
                const controlsDiv = document.createElement('div');
                controlsDiv.style.display = 'flex';
                controlsDiv.style.alignItems = 'center';
                
                const decreaseBtn = document.createElement('button');
                decreaseBtn.textContent = '-';
                decreaseBtn.style.width = '30px';
                decreaseBtn.style.height = '30px';
                decreaseBtn.style.margin = '0 5px';
                decreaseBtn.onclick = () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCartContent();
                    updateCartBadge();
                };
                
                const quantitySpan = document.createElement('span');
                quantitySpan.textContent = item.quantity;
                quantitySpan.style.margin = '0 5px';
                
                const increaseBtn = document.createElement('button');
                increaseBtn.textContent = '+';
                increaseBtn.style.width = '30px';
                increaseBtn.style.height = '30px';
                increaseBtn.style.margin = '0 5px';
                increaseBtn.onclick = () => {
                    item.quantity++;
                    updateCartContent();
                    updateCartBadge();
                };
                
                controlsDiv.appendChild(decreaseBtn);
                controlsDiv.appendChild(quantitySpan);
                controlsDiv.appendChild(increaseBtn);
                
                infoDiv.appendChild(name);
                infoDiv.appendChild(price);
                infoDiv.appendChild(controlsDiv);
                infoDiv.appendChild(subtotal);
                
                itemDiv.appendChild(img);
                itemDiv.appendChild(infoDiv);
                
                productList.appendChild(itemDiv);
                
                total += item.price * item.quantity;
            });
            
            totalDiv.textContent = `Total: $${total.toFixed(2)}`;
            checkoutBtn.disabled = false;
        }
        
        // Construir modal
        modalContent.appendChild(title);
        modalContent.appendChild(productList);
        modalContent.appendChild(totalDiv);
        modalContent.appendChild(buttonsDiv);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Actualizar contenido inicial
        updateCartContent();
        
        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Event listeners
    addToCartBtns.forEach(btn => {
        if (btn.textContent.includes('Add to cart')) {
            btn.addEventListener('click', addToCart);
        }
    });
    
    cartBtn.addEventListener('click', function() {
        console.log('Carrito abierto'); // Verifica que el carrito se abre correctamente
        handleCartClick();
    });
    
    // Actualizar badge al cargar la página
    updateCartBadge();
    
    // Agregar estilos CSS para las animaciones de notificación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
