// slider

var swiper = new Swiper(".slider", {
    slidesPerView: 'auto',
    spaceBetween: 8,
    breakpoints: {
        768: {
            spaceBetween: 20
        }
    },
});

// texts
const randomTextElements = document.querySelectorAll('.js-random-text');
const randomIndex = Math.floor(Math.random(0, 2) * 3);

randomTextElements.forEach(el => el.style.display = 'none');
document.querySelectorAll(`.js-random-text:nth-child(${randomIndex + 1})`).forEach(el => el.style.display = 'block');
