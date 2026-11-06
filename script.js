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
    const storedPref = localStorage.getItem('dark-mode');
    const darkPref = storedPref === null ? true : storedPref === 'true';
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

    const form = document.getElementById('form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (form && submitBtn) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("access_key", "ab36b73b-83e4-4aba-8e0b-6f9c22c0b462");

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Success! Your message has been sent.");
                    form.reset();
                } else {
                    alert("Error: " + data.message);
                }

            } catch (error) {
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Image Lightbox / Modal for Zooming Images
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Preview';
        if (lightboxCaption) {
            lightboxCaption.textContent = alt || '';
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        setTimeout(() => {
            if (!lightbox.classList.contains('active') && lightboxImg) {
                lightboxImg.src = '';
            }
        }, 300);
    }

    if (lightbox) {
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Attach zoom badge and click handler to zoomable images
    const zoomableWrappers = document.querySelectorAll('.vibecoded-img-wrapper, .achievement-img-wrapper, .photo-frame');
    zoomableWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return; // Skip wrappers with only SVG placeholders

        wrapper.classList.add('zoomable-wrapper');

        // Create hover badge
        const badge = document.createElement('div');
        badge.className = 'zoom-badge';
        badge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Click to enlarge</span>
        `;
        wrapper.appendChild(badge);

        wrapper.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openLightbox(img.currentSrc || img.src, img.alt);
        });
    });
});
