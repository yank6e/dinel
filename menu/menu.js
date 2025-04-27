document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
  
    if (!category || !window.menuData || !window.menuData[category]) {
      tg.showAlert("Категория не найдена");
      window.location.href = "../index.html";
      return;
    }
  
    document.getElementById('category-title').textContent = 
      category === 'burgers' ? 'Бургеры' :
      category === 'pizza' ? 'Пицца' : 'Суши';
  
    renderMenu(category);
    window.loadCart();
  
    // Кнопка назад
    if (window.Telegram && window.Telegram.WebApp.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        window.location.href = "../index.html";
      });
    }
  });
  
  function renderMenu(category) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';
  
    console.log("Данные меню:", window.menuData); // Для отладки
  
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