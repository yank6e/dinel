// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Данные приложения
let cart = [];
const categories = [
    { id: 'burgers', name: 'Бургеры' },
    { id: 'pizza', name: 'Пицца' },
    { id: 'sushi', name: 'Суши' }
];

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupBackButton();
});

// Загрузка корзины из localStorage
function loadCart() {
    const savedCart = localStorage.getItem('dinelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Открытие категории
function openCategory(categoryId) {
    window.location.href = `menu/index.html?category=${categoryId}`;
}

// Открытие корзины
function openCart() {
    if (cart.length === 0) {
        tg.showAlert('Ваша корзина пуста');
        return;
    }
    window.location.href = 'cart/index.html';
}

// Настройка кнопки "Назад"
function setupBackButton() {
    if (tg.BackButton) {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                tg.close();
            }
        });
    }
}

// Экспорт функций для других модулей
window.app = {
    tg,
    cart,
    updateCartCount,
    saveCart: () => {
        localStorage.setItem('dinelCart', JSON.stringify(cart));
        updateCartCount();
    }
};