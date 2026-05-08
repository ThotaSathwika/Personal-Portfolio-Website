const glow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX - 150}px`;
    glow.style.top = `${e.clientY - 150}px`;
});

const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const top = window.scrollY;
        const offset = section.offsetTop - 300;

        if(top > offset){
            section.classList.add('show');
        }
    });
});
