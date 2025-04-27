document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItemsContainer.innerHTML = '';
    
    if (window.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        totalPriceElement.textContent = '0 ₽';
        return;
    }
    
    let totalPrice = 0;
    
    window.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="../assets/${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-name-price">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} ₽</span>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="window.changeQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="window.changeQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="window.removeItem(${item.id})">Удалить</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = `${totalPrice} ₽`;
}