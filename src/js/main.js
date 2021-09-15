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


// form 
const submitButton = document.querySelector('input[type="submit"]');
const form = document.querySelector('form');
submitButton.addEventListener('click', function(e) {
    e.preventDefault();

    let formData = new FormData();
    document.querySelectorAll('input[name]').forEach(el => {
        formData.append(el.name, el.value);
    })

    fetch(form.action,
        {
            body: formData,
            method: "post"
        });

    form.classList.add('done');
})


const copyButton = document.querySelector('.js-copy-button');
copyButton.addEventListener('click', function(e) {
    e.preventDefault();

    navigator.clipboard.writeText(location).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
})
