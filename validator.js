// combo-validator.js

// Определение возможных комбинаций блюд
const AVAILABLE_COMBOS = [
    {
        name: "Основное блюдо + Салат + Напиток",
        requiredCategories: ['main', 'starter', 'beverage'],
        id: 'combo1'
    },
    {
        name: "Основное блюдо + Десерт + Напиток",
        requiredCategories: ['main', 'dessert', 'beverage'],
        id: 'combo2'
    },
    {
        name: "Основное блюдо + Десерт + Салат",
        requiredCategories: ['main', 'dessert', 'starter'],
        id: 'combo3'
    }
];

// Функция для проверки соответствия заказа одному из комбо
function validateOrderCombo(currentOrder) {
    const selectedCategories = Object.entries(currentOrder)
        .filter(([_, dish]) => dish !== null)
        .map(([category, _]) => category);
    
    const selectedSet = new Set(selectedCategories);
    
    const matchedCombo = AVAILABLE_COMBOS.find(combo => {
        const requiredSet = new Set(combo.requiredCategories);
        return selectedSet.size === 3 && 
               combo.requiredCategories.every(cat => selectedSet.has(cat));
    });
    
    return matchedCombo;
}

// Функция для получения названия категории на русском
function getCategoryName(category) {
    switch(category) {
        case 'main': return 'Основное блюдо';
        case 'starter': return 'Салат';
        case 'dessert': return 'Десерт';
        case 'beverage': return 'Напиток';
        default: return category;
    }
}

// Функция для отображения простого уведомления
function showSimpleNotification(missingCategories) {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.simple-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'simple-overlay';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'simple-notification';
    
    // Получаем выбранные категории
    const selectedCount = Object.values(currentOrder).filter(dish => dish !== null).length;
    let message = '';
    
    if (selectedCount === 0) {
        message = 'Вы не выбрали ни одного блюда';
    } else if (selectedCount < 3) {
        // Определяем недостающие категории
        const allCategories = ['main', 'starter', 'dessert', 'beverage'];
        const selectedCategories = Object.entries(currentOrder)
            .filter(([_, dish]) => dish !== null)
            .map(([category, _]) => category);
        const selectedSet = new Set(selectedCategories);
        
        const missing = allCategories
            .filter(cat => !selectedSet.has(cat))
            .map(cat => getCategoryName(cat))
            .join(', ');
        
        message = `Недостаёт: ${missing}`;
    } else if (selectedCount > 3) {
        message = 'Слишком много блюд. Выберите ровно 3 блюда для комбо';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-text">${message}</div>
            <button class="notification-ok-btn">Окей</button>
        </div>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Обработчики событий
    const okBtn = notification.querySelector('.notification-ok-btn');
    
    // Функция для закрытия уведомления
    function closeNotification() {
        notification.style.opacity = '0';
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
            overlay.remove();
        }, 200);
    }
    
    // Закрытие по кнопке Окей
    okBtn.addEventListener('click', closeNotification);
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', closeNotification);
    
    // Закрытие по Escape
    document.addEventListener('keydown', function handleEscape(event) {
        if (event.key === 'Escape') {
            closeNotification();
            document.removeEventListener('keydown', handleEscape);
        }
    });
    
    // Эффект при наведении на кнопку "Окей"
    okBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#ff4498';
        this.style.color = 'white';
    });
    
    okBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'white';
        this.style.color = '#333';
    });
    
    // Плавное появление
    setTimeout(() => {
        overlay.style.opacity = '1';
        notification.style.opacity = '1';
    }, 10);
}

// Функция для удаления уведомления
function clearNotification() {
    const existingNotification = document.querySelector('.simple-notification');
    const existingOverlay = document.querySelector('.simple-overlay');
    
    if (existingNotification && existingOverlay) {
        existingNotification.style.opacity = '0';
        existingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            existingNotification.remove();
            existingOverlay.remove();
        }, 200);
    }
}

// Добавляем обработчик отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        const matchedCombo = validateOrderCombo(currentOrder);
        
        if (!matchedCombo) {
            event.preventDefault();
            
            // Определяем недостающие категории
            const allCategories = ['main', 'starter', 'dessert', 'beverage'];
            const selectedCategories = Object.entries(currentOrder)
                .filter(([_, dish]) => dish !== null)
                .map(([category, _]) => category);
            const selectedSet = new Set(selectedCategories);
            const missingCategories = allCategories
                .filter(cat => !selectedSet.has(cat));
            
            // Показываем простое уведомление
            showSimpleNotification(missingCategories);
        } else {
            clearNotification();
            
            const comboInput = document.createElement('input');
            comboInput.type = 'hidden';
            comboInput.name = 'combo_type';
            comboInput.value = matchedCombo.name;
            form.appendChild(comboInput);
        }
    });
    
    // Очищаем уведомление при сбросе формы
    const resetButton = form.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            currentOrder = {
                main: null,
                starter: null,
                dessert: null,
                beverage: null
            };
            updateOrderDisplay();
            clearNotification();
        });
    }
    
    // Очищаем уведомление при изменении заказа
    const originalAddToOrder = addToOrder;
    addToOrder = function(dish) {
        originalAddToOrder.call(this, dish);
        clearNotification();
    };
});

// Добавляем CSS стили
const style = document.createElement('style');
style.textContent = `
    .simple-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    .simple-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.2s ease;
        min-width: 300px;
        max-width: 400px;
        overflow: hidden;
    }
    
    .notification-content {
        padding: 20px;
        text-align: center;
    }
    
    .notification-text {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
        line-height: 1.4;
    }
    
    .notification-ok-btn {
        background-color: white;
        color: #333;
        border: none;
        padding: 10px 30px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
    }
    
    .notification-ok-btn:hover {
        background-color: #ff4498;
        color: white;
    }
    
    .notification-ok-btn:active {
        transform: scale(0.98);
    }
`;
document.head.appendChild(style);