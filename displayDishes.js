document.addEventListener('DOMContentLoaded', function() {
    // Получаем секции для каждой категории
    const mainSection = document.querySelector('.category:nth-of-type(1) .dishes-grid');
    const dessertSection = document.querySelector('.category:nth-of-type(2) .dishes-grid');
    const beverageSection = document.querySelector('.category:nth-of-type(3) .dishes-grid');

    // Сортируем блюда по категориям и по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

    // Группируем по категориям
    const mains = sortedDishes.filter(dish => dish.category === 'main');
    const desserts = sortedDishes.filter(dish => dish.category === 'dessert');
    const beverages = sortedDishes.filter(dish => dish.category === 'beverage');

    // Функция для создания карточки блюда
    function createDishCard(dish) {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.setAttribute('data-dish', dish.keyword); // Добавляем data-атрибут

        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price}₽</p>
            <p class="name">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button>Добавить</button>
        `;

        // Добавляем обработчик клика
        card.addEventListener('click', function() {
            addToOrder(dish);
        });

        return card;
    }

    // Очищаем содержимое секций (на случай, если там что-то есть)
    mainSection.innerHTML = '';
    dessertSection.innerHTML = '';
    beverageSection.innerHTML = '';

    // Добавляем блюда в соответствующие секции
    mains.forEach(dish => mainSection.appendChild(createDishCard(dish)));
    desserts.forEach(dish => dessertSection.appendChild(createDishCard(dish)));
    beverages.forEach(dish => beverageSection.appendChild(createDishCard(dish)));
});