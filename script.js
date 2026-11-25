// ====================== HELPERS ======================
const $ = id => document.getElementById(id);
const MONTHS = ['января','февраля','марта','апреля','мая','июня',
                'июля','августа','сентября','октября','ноября','декабря'];

function formatMoney(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function formatDate(d) {
    return d.getDate() + ' ' + MONTHS[d.getMonth()];
}

function formatShortDate(iso) {
    const d = new Date(iso);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

function pluralizeNights(n) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'ночь';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'ночи';
    return 'ночей';
}

function pluralizeGuests(n) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'гость';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'гостя';
    return 'гостей';
}

// ====================== AUTH / STORAGE ======================
const USER_KEY = 'aurora_user';
const BOOKINGS_KEY = 'aurora_bookings';

function getCurrentUser() {
    try {
        const data = localStorage.getItem(USER_KEY);
        if (!data) return null;
        const user = JSON.parse(data);
        if (!user || !user.name || !user.email) { localStorage.removeItem(USER_KEY); return null; }
        return user;
    } catch { return null; }
}

function saveUser(user) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
    catch { alert('Ошибка: браузер блокирует сохранение. Запустите через Live Server.'); }
}

function logout() {
    localStorage.removeItem(USER_KEY);
    window.location.href = 'index.html';
}

function getBookings() {
    try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []; }
    catch { return []; }
}

function saveBooking(booking) {
    const bookings = getBookings();
    bookings.unshift(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// ====================== ROOM DATA ======================
const ROOM_DATA = {
    standard: {
        name: 'Стандарт',
        category: 'STANDARD ROOM',
        price: 12900,
        description: 'Компактный и уютный номер идеально подходит для командировок или коротких поездок. В номере есть всё необходимое: удобная кровать Queen-size, рабочий стол с хорошим освещением, кофемашина и современная ванная комната с душем.',
        amenities: ['24 м²', 'Кровать Queen-size', 'Рабочая зона', 'Кофемашина', 'Смарт-ТВ', 'Кондиционер'],
        images: [
            'images/room-standard.svg',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    deluxe: {
        name: 'Делюкс с видом на город',
        category: 'DELUXE ROOM',
        price: 18900,
        description: 'Светлый и просторный номер с панорамными окнами, из которых открывается захватывающий вид на город. Просторная гостиная зона с мягким диваном, кровать King-size и роскошная мраморная ванная комната сделают ваше пребывание незабываемым.',
        amenities: ['32 м²', 'Вид на город', 'Кровать King-size', 'Мраморная ванная', 'Мини-бар', 'Халаты и тапочки'],
        images: [
            'images/room-deluxe.svg',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    premier: {
        name: 'Премьер с террасой',
        category: 'PREMIER ROOM',
        price: 24500,
        description: 'Роскошный номер для тех, кто ценит личное пространство. Оборудован большой кроватью King-size, дизайнерской мебелью и собственной приватной террасой, где так приятно выпить чашечку кофе утром или встретить закат.',
        amenities: ['48 м²', 'Приватная терраса', 'Кровать King-size', 'Кофемашина', 'Мебель на террасе', 'Ванна и душ'],
        images: [
            'images/room-premier.svg',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    family: {
        name: 'Семейный люкс',
        category: 'FAMILY SUITE',
        price: 29900,
        description: 'Просторный двухкомнатный номер, созданный для комфортного отдыха всей семьей. Включает в себя отдельную гостиную, две спальные зоны (две кровати Queen-size) и всё необходимое для детей. Уютная атмосфера и много места для игр.',
        amenities: ['64 м²', '2 спальные зоны', 'Гостиная', 'Детская кроватка', 'Игровая зона', '2 санузла'],
        images: [
            'images/room-family.svg',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'
        ]
    }
};

const TAX_RATE = 0.12;

// ====================== COMMON UI ======================
function updateAuthLink() {
    const link = $('auth-link');
    if (!link) return;
    const user = getCurrentUser();
    if (user) {
        link.textContent = 'Профиль';
        link.href = 'profile.html';
    } else {
        link.textContent = 'Войти';
        link.href = 'register.html';
    }
}

// ====================== ROOM DETAILS PAGE (room.html) ======================
function initRoomPage() {
    const mainPhoto = $('main-photo');
    if (!mainPhoto) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'standard';
    const room = ROOM_DATA[id];

    if (!room) {
        window.location.href = 'rooms.html';
        return;
    }

    document.title = `AURORA HOTEL — ${room.name}`;
    $('breadcrumb-name').textContent = room.name;
    $('detail-category').textContent = room.category;
    $('detail-name').textContent = room.name;
    $('detail-desc').textContent = room.description;
    $('detail-price').textContent = formatMoney(room.price);

    $('detail-book-btn').href = `booking.html?room=${id}`;

    const amenitiesList = $('detail-amenities');
    amenitiesList.innerHTML = room.amenities.map(a => `<li>${a}</li>`).join('');

    const thumbnails = $('thumbnails');
    mainPhoto.src = room.images[0];

    thumbnails.innerHTML = room.images.map((imgUrl, index) => `
        <img src="${imgUrl}" class="thumb ${index === 0 ? 'active' : ''}" data-src="${imgUrl}" alt="Фото ${index + 1}">
    `).join('');

    thumbnails.addEventListener('click', e => {
        if (e.target.classList.contains('thumb')) {
            mainPhoto.src = e.target.dataset.src;
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
        }
    });
}

// ====================== CALCULATOR (booking.html) ======================
function updateCalculator() {
    const checkinVal = $('calc-checkin').value;
    const checkoutVal = $('calc-checkout').value;
    const roomKey = $('calc-room').value;
    const room = ROOM_DATA[roomKey];

    $('res-category').textContent = room.category;
    $('res-name').textContent = room.name;
    $('res-details').textContent = room.amenities.slice(0, 3).join(' • ');
    $('res-photo-label').textContent = room.name.split(' ')[0].toUpperCase();

    const photo = document.querySelector('.reservation-photo');
    if(photo) {
        photo.classList.remove('standard-res', 'deluxe-res', 'premier-res', 'family-res');
        photo.classList.add(roomKey + '-res');
    }

    let nights = 0, valid = false, warning = '';

    if (checkinVal && checkoutVal) {
        const inDate = new Date(checkinVal);
        const outDate = new Date(checkoutVal);
        if (outDate > inDate) {
            nights = Math.round((outDate - inDate) / 86400000);
            valid = true;
        } else { warning = 'Дата выезда должна быть позже даты заезда.'; }
    } else { warning = 'Укажите даты заезда и выезда.'; }

    if($('calc-warning')) $('calc-warning').textContent = warning;

    if (!valid) {
        ['calc-nights', 'calc-base', 'calc-tax', 'calc-total', 'res-dates', 'res-base', 'res-tax', 'res-total'].forEach(id => {
            if($(id)) $(id).textContent = '—';
        });
        if($('calc-per-night')) $('calc-per-night').textContent = formatMoney(room.price);
        return;
    }

    const inDate = new Date(checkinVal);
    const outDate = new Date(checkoutVal);
    const base = nights * room.price;
    const tax = Math.round(base * TAX_RATE);
    const total = base + tax;

    if($('calc-nights')) $('calc-nights').textContent = nights;
    if($('calc-per-night')) $('calc-per-night').textContent = formatMoney(room.price);
    if($('calc-base')) $('calc-base').textContent = formatMoney(base);
    if($('calc-tax')) $('calc-tax').textContent = formatMoney(tax);
    if($('calc-total')) $('calc-total').textContent = formatMoney(total);

    if($('res-dates')) $('res-dates').innerHTML = formatDate(inDate) + ' – ' + formatDate(outDate) + ' <span>•</span> ' + nights + ' ' + pluralizeNights(nights);
    if($('res-base')) $('res-base').textContent = formatMoney(base);
    if($('res-tax')) $('res-tax').textContent = formatMoney(tax);
    if($('res-total')) $('res-total').textContent = formatMoney(total);
}

function initCalculator() {
    const checkinInput = $('calc-checkin');
    const checkoutInput = $('calc-checkout');
    if (!checkinInput || !checkoutInput) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkout = new Date(today);
    checkout.setDate(today.getDate() + 3);

    const toISO = d => d.toISOString().slice(0, 10);
    checkinInput.value = toISO(today);
    checkoutInput.value = toISO(checkout);
    checkinInput.min = toISO(today);
    checkoutInput.min = toISO(today);

    const params = new URLSearchParams(window.location.search);
    const preSelectedRoom = params.get('room');
    if (preSelectedRoom && ROOM_DATA[preSelectedRoom]) {
        $('calc-room').value = preSelectedRoom;
    }

    ['calc-checkin', 'calc-checkout', 'calc-room', 'calc-guests'].forEach(id => {
        const el = $(id);
        if (!el) return;
        el.addEventListener('input', updateCalculator);
        el.addEventListener('change', updateCalculator);
    });

    updateCalculator();
}

// ====================== GUEST FORM (booking.html) ======================
function initGuestForm() {
    const form = $('guest-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
            if (confirm('Чтобы сохранить бронь, войдите или зарегистрируйтесь. Перейти к регистрации?')) {
                window.location.href = 'register.html';
            }
            return;
        }

        const roomKey = $('calc-room').value;
        const room = ROOM_DATA[roomKey];
        const checkin = $('calc-checkin').value;
        const checkout = $('calc-checkout').value;
        const guests = $('calc-guests').value;
        const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);

        if (!checkin || !checkout || nights <= 0) {
            alert('Пожалуйста, корректно заполните даты');
            return;
        }

        const base = nights * room.price;
        const tax = Math.round(base * TAX_RATE);
        const total = base + tax;

        saveBooking({
            id: Date.now(), roomKey, roomName: room.name, roomCategory: room.category, roomLabel: room.name.split(' ')[0],
            checkin, checkout, nights, guests, base, tax, total, createdAt: new Date().toISOString()
        });

        alert('Бронирование успешно сохранено!');
        window.location.href = 'profile.html';
    });
}

// ====================== REGISTER ======================
function initRegister() {
    const form = $('register-form');
    if (!form) return;
    if (getCurrentUser()) { window.location.href = 'profile.html'; return; }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = $('reg-name').value.trim();
        const email = $('reg-email').value.trim();
        const phone = $('reg-phone').value.trim();
        const password = $('reg-password').value;
        const confirm = $('reg-confirm').value;
        const error = $('register-error');
        error.textContent = '';

        if (!name || !email || !phone) { error.textContent = 'Заполните все поля'; return; }
        if (password.length < 4) { error.textContent = 'Пароль должен быть минимум 4 символа'; return; }
        if (password !== confirm) { error.textContent = 'Пароли не совпадают'; return; }

        saveUser({ name, email, phone, createdAt: new Date().toISOString() });
        setTimeout(() => { window.location.href = 'profile.html'; }, 100);
    });
}

// ====================== PROFILE ======================
function getInitials(name) {
    if(!name) return '?';
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function initProfile() {
    const nameEl = $('profile-name');
    if (!nameEl) return;
    const user = getCurrentUser();
    if (!user) { window.location.href = 'register.html'; return; }

    $('profile-avatar').textContent = getInitials(user.name);
    nameEl.textContent = user.name;
    $('profile-email').textContent = user.email;
    $('profile-info-name').textContent = user.name;
    $('profile-info-email').textContent = user.email;
    $('profile-info-phone').textContent = user.phone || 'Не указан';

    const logoutBtn = $('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    const list = $('bookings-list');
    const bookings = getBookings();

    if (bookings.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>У вас пока нет бронирований.</p><a class="primary-button" href="booking.html">Забронировать номер</a></div>`;
        return;
    }

    list.innerHTML = bookings.map(b => `
        <article class="booking-item">
            <div class="booking-item-main">
                <p class="room-category">${b.roomCategory}</p>
                <h3>${b.roomName}</h3>
                <p class="room-details">${formatShortDate(b.checkin)} — ${formatShortDate(b.checkout)} <span>•</span> ${b.nights} ${pluralizeNights(b.nights)}</p>
                <p class="room-details">${b.guests} ${pluralizeGuests(b.guests)}</p>
            </div>
            <div class="booking-item-price">
                <span>Итого</span>
                <strong>${formatMoney(b.total)}</strong>
            </div>
        </article>
    `).join('');
}

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
    updateAuthLink();
    initRoomPage();
    initCalculator();
    initGuestForm();
    initRegister();
    initProfile();
});