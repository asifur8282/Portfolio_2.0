document.addEventListener("DOMContentLoaded", () => {
    const animElements = document.querySelectorAll(".slide-in");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animElements.forEach(el => observer.observe(el));
    const darkToggle = document.getElementById('darkModeToggle');
    const darkIcon = document.getElementById('darkModeIcon');
    const darkText = document.getElementById('darkModeText');
    function setDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        if (isDark) {
            darkIcon.textContent = '☀️';
            darkText.textContent = 'Light Mode';
        } else {
            darkIcon.textContent = '🌙';
            darkText.textContent = 'Dark Mode';
        }
    }
    const darkPref = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(darkPref);
    darkToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        setDarkMode(isDark);
        localStorage.setItem('dark-mode', isDark);
    });
    const contactIconsContainer = document.querySelector('.contact-icons'); 
    const locationIconWrapper = document.getElementById('locationIconWrapper');
    let hoverEnterTimeout; 
    let hoverLeaveTimeout; 
    function applyHoverAnimations() {
        contactIconsContainer.classList.add('animate-wrap'); 
        locationIconWrapper.classList.add('animate-hover'); 
    }
    function resetAnimations() {
        contactIconsContainer.classList.remove('animate-wrap'); 
        locationIconWrapper.classList.remove('animate-hover'); 
    }
    if (locationIconWrapper) {
        locationIconWrapper.addEventListener('mouseenter', () => {
            clearTimeout(hoverLeaveTimeout); 
            clearTimeout(hoverEnterTimeout); 
            hoverEnterTimeout = setTimeout(() => {
                applyHoverAnimations();
            }, 1000); 
        });
        locationIconWrapper.addEventListener('mouseleave', () => {
            clearTimeout(hoverEnterTimeout); 
            hoverLeaveTimeout = setTimeout(() => {
                resetAnimations();
            }, 3500); 
        });
    }
});