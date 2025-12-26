document.addEventListener('DOMContentLoaded', function() {
    // Получаем секции для каждой категории
    const mainSection = document.querySelector('.category:nth-of-type(1) .dishes-grid');
    const starterSection = document.querySelector('.category:nth-of-type(2) .dishes-grid');
    const dessertSection = document.querySelector('.category:nth-of-type(3) .dishes-grid');
    const beverageSection = document.querySelector('.category:nth-of-type(4) .dishes-grid');

    // Функция для создания фильтров
    function createFilters(container, category, filterNames, filterKinds) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'filters';

        filterNames.forEach((name, index) => {
            const button = document.createElement('button');
            button.textContent = name;
            button.setAttribute('data-kind', filterKinds[index]);
            button.addEventListener('click', () => toggleFilter(button, category));
            filtersContainer.appendChild(button);
        });

        container.parentNode.insertBefore(filtersContainer, container);
    }

    // Функция для переключения фильтра
    function toggleFilter(button, category) {
        const buttons = button.parentNode.querySelectorAll('button');
        buttons.forEach(btn => btn.classList.remove('active'));

        if (!button.classList.contains('active')) {
            button.classList.add('active');
            applyFilter(category, button.getAttribute('data-kind'));
        } else {
            applyFilter(category, null); // Показать все
        }
    }

    // Функция для применения фильтра
    function applyFilter(category, kind) {
        let section;
        switch(category) {
            case 'main': section = mainSection; break;
            case 'starter': section = starterSection; break;
            case 'beverage': section = beverageSection; break;
            case 'dessert': section = dessertSection; break;
        }

        // Очищаем контейнер
        section.innerHTML = '';

        // Фильтруем блюда
        let filteredDishes = dishes.filter(dish => dish.category === category);
        if (kind) {
            filteredDishes = filteredDishes.filter(dish => dish.kind === kind);
        }
        // Сортируем по алфавиту
        filteredDishes.sort((a, b) => a.name.localeCompare(b.name));

        // Добавляем карточки
        filteredDishes.forEach(dish => section.appendChild(createDishCard(dish)));
    }

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

    // Создаем фильтры
    createFilters(mainSection, 'main', ['рыбное', 'мясное', 'вегетарианское'], ['sea', 'bird', 'veg']);
    createFilters(starterSection, 'starter', ['рыбный', 'мясной', 'вегетарианский'], ['fish', 'meat', 'veg']);
    createFilters(beverageSection, 'beverage', ['холодный', 'горячий'], ['cold', 'hot']);
    createFilters(dessertSection, 'dessert', ['поштучные', 'тортик'], ['small', 'cake']);

    // Вызываем applyFilter для ВСЕХ категорий при загрузке страницы
    // чтобы блюда отобразились сразу
    applyFilter('main', null);
    applyFilter('starter', null);
    applyFilter('dessert', null);
    applyFilter('beverage', null);
});