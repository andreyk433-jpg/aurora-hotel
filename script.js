// Стоимость номеров и данные для карточки
const ROOM_DATA = {
    standard: {
        name: 'Стандарт',
        category: 'STANDARD ROOM',
        details: '2 гостя • 1 кровать Queen-size • 24 м²',
        label: 'STANDARD',
        price: 12900
    },
    deluxe: {
        name: 'Делюкс с видом на город',
        category: 'DELUXE ROOM',
        details: '2 гостя • 1 большая кровать • 32 м²',
        label: 'DELUXE',
        price: 18900
    },
    premier: {
        name: 'Премьер с террасой',
        category: 'PREMIER ROOM',
        details: '2 гостя • 1 кровать King-size • 48 м²',
        label: 'PREMIER',
        price: 24500
    },
    family: {
        name: 'Семейный люкс',
        category: 'FAMILY SUITE',
        details: '4 гостя • 2 кровати Queen-size • 64 м²',
        label: 'FAMILY',
        price: 29900
    }
};

const TAX_RATE = 0.12;
const MONTHS = ['января','февраля','марта','апреля','мая','июня',
                'июля','августа','сентября','октября','ноября','декабря'];

const $ = id => document.getElementById(id);

function formatMoney(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function formatDate(d) {
    return d.getDate() + ' ' + MONTHS[d.getMonth()];
}

function pluralizeNights(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'ночь';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'ночи';
    return 'ночей';
}

function updateCalculator() {
    const checkinVal = $('calc-checkin').value;
    const checkoutVal = $('calc-checkout').value;
    const roomKey = $('calc-room').value;
    const room = ROOM_DATA[roomKey];

    // Карточка "Ваше бронирование" под выбранный номер
    $('res-category').textContent = room.category;
    $('res-name').textContent = room.name;
    $('res-details').textContent = room.details;
    $('res-photo-label').textContent = room.label;

    const photo = document.querySelector('.reservation-photo');
    photo.classList.remove('standard-res', 'deluxe-res', 'premier-res', 'family-res');
    photo.classList.add(roomKey + '-res');

    // Проверяем даты
    let nights = 0;
    let valid = false;
    let warning = '';

    if (checkinVal && checkoutVal) {
        const inDate = new Date(checkinVal);
        const outDate = new Date(checkoutVal);
        if (outDate > inDate) {
            nights = Math.round((outDate - inDate) / (24 * 60 * 60 * 1000));
            valid = true;
        } else {
            warning = 'Дата выезда должна быть позже даты заезда.';
        }
    } else {
        warning = 'Укажите даты заезда и выезда.';
    }

    $('calc-warning').textContent = warning;

    if (!valid) {
        $('calc-nights').textContent = '—';
        $('calc-per-night').textContent = formatMoney(room.price);
        $('calc-base').textContent = '—';
        $('calc-tax').textContent = '—';
        $('calc-total').textContent = '—';
        $('res-dates').textContent = '—';
        $('res-base').textContent = '—';
        $('res-tax').textContent = '—';
        $('res-total').textContent = '—';
        return;
    }

    const inDate = new Date(checkinVal);
    const outDate = new Date(checkoutVal);
    const base = nights * room.price;
    const tax = Math.round(base * TAX_RATE);
    const total = base + tax;

    // Калькулятор
    $('calc-nights').textContent = nights;
    $('calc-per-night').textContent = formatMoney(room.price);
    $('calc-base').textContent = formatMoney(base);
    $('calc-tax').textContent = formatMoney(tax);
    $('calc-total').textContent = formatMoney(total);

    // Карточка бронирования
    $('res-dates').innerHTML =
        formatDate(inDate) + ' – ' + formatDate(outDate) +
        ' <span>•</span> ' + nights + ' ' + pluralizeNights(nights);
    $('res-base').textContent = formatMoney(base);
    $('res-tax').textContent = formatMoney(tax);
    $('res-total').textContent = formatMoney(total);
}

function initCalculator() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkout = new Date(today);
    checkout.setDate(today.getDate() + 3);

    const toISO = d => d.toISOString().slice(0, 10);
    const checkinInput = $('calc-checkin');
    const checkoutInput = $('calc-checkout');

    checkinInput.value = toISO(today);
    checkoutInput.value = toISO(checkout);
    checkinInput.min = toISO(today);
    checkoutInput.min = toISO(today);

    ['calc-checkin', 'calc-checkout', 'calc-room', 'calc-guests'].forEach(id => {
        const el = $(id);
        if (!el) return;
        el.addEventListener('input', updateCalculator);
        el.addEventListener('change', updateCalculator);
    });

    updateCalculator();
}

document.addEventListener('DOMContentLoaded', initCalculator);