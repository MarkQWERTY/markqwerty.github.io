document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    // 2. IntersectionObserver for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback if IntersectionObserver is not supported
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 3. Contact Form Submission with Full A11y Feedback
    const contactForm = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const phoneInput = document.getElementById('contact-phone');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                showAlert(alertBox, 'Por favor, completa todos los campos requeridos (*).', 'error');
                return;
            }

            // Visual feedback on button
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `ENVIANDO... <span class="material-symbols-outlined animate-spin text-sm" aria-hidden="true">sync</span>`;

            try {
                const response = await fetch('/api/v1/contact-submissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: name,
                        mail: email,
                        telefono: phone,
                        texto: message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert(alertBox, '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la brevedad.', 'success');
                    contactForm.reset();
                    alertBox.focus();
                } else {
                    showAlert(alertBox, data.error || 'Error al procesar el mensaje.', 'error');
                    alertBox.focus();
                }
            } catch (err) {
                showAlert(alertBox, 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.', 'error');
                alertBox.focus();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showAlert(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.classList.remove('hidden', 'bg-green-950', 'text-green-200', 'border-green-800', 'bg-red-950', 'text-red-200', 'border-red-800');
        
        if (type === 'success') {
            el.classList.add('bg-green-950', 'text-green-200', 'border', 'border-green-800');
            el.setAttribute('role', 'status');
        } else {
            el.classList.add('bg-red-950', 'text-red-200', 'border', 'border-red-800');
            el.setAttribute('role', 'alert');
        }
        
        el.setAttribute('tabindex', '-1');
        el.classList.remove('hidden');
    }
});
