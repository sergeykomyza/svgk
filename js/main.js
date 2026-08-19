// ================================================== MENU
const menu = () => {
    const menuToggle = document.querySelector('.js-toggleMenu')
    const menuMobile = document.querySelector('.header-menu')
    menuToggle.addEventListener('click', function(){
        this.classList.toggle('is-active')
        menuMobile.classList.toggle('is-active')
        document.documentElement.classList.toggle('fixed')
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ПРОКРУТКА, ШАПКА
// document.addEventListener('DOMContentLoaded', function () {
//     // СКРОЛЛ К НУЖНОЙ СЕКЦИИ ПО КЛИКУ НА ПУНКТАХ МЕНЮ
//     $('.menu__link').click(function () {
//         var scroll_elem = $(this).attr('href');
//         $('html, body').animate({
//             scrollTop: $(scroll_elem).offset().top
//         }, 1000);
//     });
//     // ДОБАВЛЯЕМ АКТИВНЫЙ КЛАСС ШАПКЕ
//     function headerActiveToggle() {
//         const scrollSize = window.pageYOffset
//         scrollSize > 1 ? header.classList.add('active') : header.classList.remove('active')
//     }
//     window.addEventListener('load', headerActiveToggle) // ПРИ ПЕРЕЗАГРУЗКЕ СТРАНИЦЫ ЕСЛИ СТРАНИЦА УЖЕ ПРОСКРОЛЛЕНА
//     window.addEventListener('scroll', headerActiveToggle) // ПРИ СКРОЛЛЕ
// });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ МАСКА ДЛЯ ИНПУТОВ (https://github.com/RobinHerbots/Inputmask)
const inputMask = () => {
    let selectors = document.querySelectorAll(".js-inputmask");
    selectors.forEach(item => {
        Inputmask(
            {
                "mask": "+7 (999) 999-99-99"
            }).mask(item);
    })

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ СЛАЙДЕР SWIPER (https://swiperjs.com/get-started) 
const sliders = () => {
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'vertical',
        loop: true,
    
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },
    
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    
        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ КАРТА C ТАБАМИ(Яндекс.Карты), ОТЛОЖЕННАЯ ЗАГРУЗКА 
// Адреса и координаты берутся из data-атрибутов кнопок .js-showMap (массив в _contacts.pug)
const map = () => {
    const mapEl = document.getElementById('map')
    if (!mapEl) return

    const btns = document.querySelectorAll('.js-showMap')
    const placemarks = {}
    let myMap = null

    function parseCoords(str) {
        return str.split(',').map(Number)
    }

    function init() {
        const firstCoords = (btns[0] && parseCoords(btns[0].dataset.coords)) || [53.1959, 50.1008]
        myMap = new ymaps.Map('map', {
            center: firstCoords,
            zoom: 8,
            controls: ['smallMapDefaultSet']
        }, {
            searchControlProvider: 'yandex#search'
        })

        btns.forEach(btn => {
            const key = btn.dataset.coords
            if (placemarks[key]) return
            const coords = parseCoords(key)
            const placemark = new ymaps.Placemark(coords, {
                balloonContentHeader: btn.dataset.title,
                balloonContentBody: btn.dataset.address,
                hintContent: btn.dataset.title
            }, {
                preset: 'islands#blueCircleDotIconWithCaption',
                iconCaptionMaxWidth: '200'
            })
            myMap.geoObjects.add(placemark)
            placemarks[key] = placemark
        })

        myMap.behaviors.disable('scrollZoom')
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            myMap.behaviors.disable('drag')
        }

        btns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault()
                const key = this.dataset.coords
                if (!placemarks[key]) return
                const coords = parseCoords(key)
                myMap.setCenter(coords, 16)
                placemarks[key].balloon.open()
                mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            })
        })
    }

    function loadAPI() {
        if (window.ymaps) {
            ymaps.ready(init)
            return
        }
        const script = document.createElement('script')
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
        script.onload = () => ymaps.ready(init)
        document.body.appendChild(script)
    }

    setTimeout(loadAPI, 3000)
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ КАРТА ПРОСТАЯ(Яндекс.Карты), ОТЛОЖЕННАЯ ЗАГРУЗКА
// Контейнер: #placemap. API подгружается лениво (скрипт подключается только на страницах с картой).
const placeMap = () => {
    const mapEl = document.getElementById('placemap')
    if (!mapEl) return

    function init() {
        const myMap2 = new ymaps.Map("placemap", {
            center: [55.917879, 37.806326],
            zoom: 13,
            controls: ['smallMapDefaultSet']
        }, {
            searchControlProvider: 'yandex#search'
        });

        myMap2.geoObjects
            .add(new ymaps.Placemark([53.188967, 50.107002], {
                balloonContent: '<strong></strong>',
                iconCaption: '443010, г. Самара, ул. Льва Толстого, 95'
            }, {
                preset: 'islands#blueCircleDotIconWithCaption',
                iconCaptionMaxWidth: '200'
            }));

        myMap2.setType('yandex#publicMap');

        myMap2.behaviors.disable('scrollZoom');
        //на мобильных устройствах... (проверяем по userAgent браузера)
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            //... отключаем перетаскивание карты
            myMap2.behaviors.disable('drag');
        }
    }

    function loadAPI() {
        if (window.ymaps) {
            ymaps.ready(init)
            return
        }
        const script = document.createElement('script')
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
        script.onload = () => ymaps.ready(init)
        document.body.appendChild(script)
    }

    setTimeout(loadAPI, 4000)
}

// ==================================================
const toggleMenuMobile = () => {
    const menuMobile = document.querySelector('.header-menu')
    if(window.innerWidth <= 992){
        const btn = menuMobile.querySelectorAll('.js-toggleSubMenu')
        btn.forEach(item => {
            item.addEventListener('click', function(){
                item.closest('.header-menu__item').classList.toggle('is-active')
            })
        })
    }
}

// ================================================== АККОРДЕОН (универсальный)
// Контейнер: .accordion. Элемент: .accordion__item > .accordion__header (кнопка) + .accordion__panel
// Открытый элемент получает класс .is-open (одновременно открыт один элемент внутри контейнера)
const accordion = () => {
    const accordions = document.querySelectorAll('.accordion')
    if (!accordions.length) return
    accordions.forEach(group => {
        const items = group.querySelectorAll('.accordion__item')
        items.forEach(item => {
            const header = item.querySelector('.accordion__header')
            if (!header) return
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open')
                items.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('is-open')
                        const h = i.querySelector('.accordion__header')
                        if (h) h.setAttribute('aria-expanded', 'false')
                    }
                })
                item.classList.toggle('is-open', !isOpen)
                header.setAttribute('aria-expanded', String(!isOpen))
            })
        })
    })
}

// ================================================== ТАБЫ (универсальные)
const tabs = () => {
    const groups = document.querySelectorAll('[data-tabs]')
    if (!groups.length) return
    groups.forEach(group => {
        const target = group.dataset.tabsTarget
        if (!target) return
        // По какому data-атрибуту фильтровать. По умолчанию data-type.
        // Если нужно (коллизия с другой библиотекой) — задаётся через data-tabs-attr="filter".
        const filterAttr = group.dataset.tabsAttr || 'type'
        const items = document.querySelectorAll(target)
        const btns = group.querySelectorAll('.js-tab')
        btns.forEach(btn => {
            btn.addEventListener('click', function () {
                btns.forEach(b => b.classList.remove('is-active'))
                this.classList.add('is-active')
                const filter = this.dataset.tab
                let firstSeen = false
                items.forEach(item => {
                    const show = (filter === 'all' || item.dataset[filterAttr] === filter)
                    item.style.display = show ? '' : 'none'
                    // Нормализация разделителей: убираем верхнюю границу у первого видимого элемента
                    if (show) {
                        item.classList.toggle('is-first-visible', !firstSeen)
                        firstSeen = true
                    } else {
                        item.classList.remove('is-first-visible')
                    }
                })
            })
        })
    })
}


// ================================================== ЗАГРУЗКА ФАЙЛОВ (Dropzone, https://www.dropzone.dev)
// Контейнер: .js-dropzone. Автопоиск плагина отключён — инициализация только по классу.
// Ошибки (лимит файлов, размер, тип) выводятся в .dropzone-alert под зоной загрузки.
const fileUpload = () => {
    if (typeof Dropzone === 'undefined') return
    Dropzone.autoDiscover = false

    document.querySelectorAll('.js-dropzone').forEach(el => {
        const alertBox = document.createElement('div')
        alertBox.className = 'dropzone-alert'
        el.insertAdjacentElement('afterend', alertBox)

        let alertTimer = null
        const showAlert = (message) => {
            alertBox.textContent = message
            alertBox.classList.add('is-visible')
            clearTimeout(alertTimer)
            alertTimer = setTimeout(() => {
                alertBox.classList.remove('is-visible')
                alertBox.textContent = ''
            }, 4000)
        }

        new Dropzone(el, {
            url: '/upload',
            autoProcessQueue: false, // файлы только выбираются, отправка — сабмитом формы
            addRemoveLinks: true,
            maxFiles: 5,
            maxFilesize: 10, // MB — встроенная проверка плагина (считает в MiB)
            acceptedFiles: '.pdf, .jpg, .jpeg, .png',
            // Кастомный accept заменяет ВСЕ встроенные проверки (размер и acceptedFiles),
            // поэтому обе проверяем здесь явно:
            // 1) размер: 10 МБ = 10 000 000 байт, как в проводнике
            //    (встроенная проверка срабатывает только после 10 485 760 байт — MiB)
            // 2) формат: по списку acceptedFiles (расширения ".pdf" или MIME "image/*")
            accept(file, done) {
                if (file.size > 10 * 1000 * 1000) {
                    return done('Файл больше 10 МБ')
                }
                const allowed = this.options.acceptedFiles.split(',').map(s => s.trim().toLowerCase())
                const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
                const ok = allowed.some(rule => {
                    if (rule.startsWith('.')) return ext === rule
                    if (rule.endsWith('/*')) return file.type.split('/')[0] === rule.slice(0, -2)
                    return file.type === rule
                })
                if (!ok) {
                    return done('Недопустимый тип файла')
                }
                done()
            },
            dictRemoveFile: 'Удалить',
            dictMaxFilesExceeded: 'Можно прикрепить не более 5 файлов',
            dictFileTooBig: 'Файл больше 10 МБ',
            dictInvalidFileType: 'Недопустимый тип файла',
            init() {
                // Превышен лимит файлов — отбрасываем лишний и сообщаем
                this.on('maxfilesexceeded', file => {
                    this.removeFile(file)
                    showAlert(this.options.dictMaxFilesExceeded)
                })
                // Файл не прошёл проверку (размер/тип) — убираем из очереди и сообщаем
                this.on('error', (file, message) => {
                    if (file) this.removeFile(file)
                    showAlert(typeof message === 'string' ? message : 'Не удалось добавить файл')
                })
            }
        })
    })
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INIT
menu()
inputMask()
tabs()
accordion()
map()
placeMap()
toggleMenuMobile()
fileUpload()
