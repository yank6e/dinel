document.addEventListener('DOMContentLoaded', () => {
    const tg = window.tg; // Используем глобальный tg из app.js
  
    // Проверяем Telegram WebApp
    if (!tg) {
      console.log("Приложение запущено вне Telegram");
    }
  
    // Кнопка "Назад"
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        window.location.href = "../index.html";
      });
    }
  
    // Получаем категорию из URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
  
    // Проверяем категорию
    if (!category || !window.menuData?.[category]) {
      if (tg) tg.showAlert("Категория не найдена");
      window.location.href = "../index.html";
      return;
    }
  
    // Устанавливаем заголовок
    document.getElementById('category-title').textContent = 
      category === 'burgers' ? 'Бургеры' :
      category === 'pizza' ? 'Пицца' : 'Суши';
  
    // Рендерим меню
    renderMenu(category);
    window.loadCart();
  });
  
  function renderMenu(category) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';
  
    const items = window.menuData[category];
    if (!items) return;
  
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'menu-item';
      itemElement.innerHTML = `
        <img src="../../assets/${item.image}" alt="${item.name}">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-price">${item.price} ₽</span>
        </div>
        <button class="add-to-cart" onclick="window.addToCart(${item.id}, '${category}')">
          В корзину
        </button>
      `;
      menuItemsContainer.appendChild(itemElement);
    });
  }