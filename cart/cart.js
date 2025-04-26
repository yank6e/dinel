document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    // Очистка контейнера
    cartItemsContainer.innerHTML = '';
    
    if (window.app.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        totalPriceElement.textContent = '0 ₽';
        return;
    }
    
    let totalPrice = 0;
    
    // Добавление товаров в корзину
    window.app.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-name-price">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} ₽</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">Удалить</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Обновление итоговой суммы
    totalPriceElement.textContent = `${totalPrice} ₽`;
}

// Глобальные функции для обработки событий
window.changeQuantity = function(itemId, delta) {
    const item = window.app.cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            window.app.cart = window.app.cart.filter(i => i.id !== itemId);
        }
        window.app.saveCart();
        renderCart();
    }
};

window.removeItem = function(itemId) {
    window.app.cart = window.app.cart.filter(i => i.id !== itemId);
    window.app.saveCart();
    renderCart();
};

window.checkout = function() {
    if (window.app.cart.length === 0) {
        window.app.tg.showAlert('Ваша корзина пуста');
        return;
    }
    
    window.app.tg.showPopup({
        title: 'Оформление заказа',
        message: 'Функционал оформления заказа будет реализован позже'
    }, () => {
        // В реальном приложении здесь будет переход на страницу оформления
    });
};