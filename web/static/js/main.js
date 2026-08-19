document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const alertBox = document.getElementById('contact-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const message = document.getElementById('contact-message').value.trim();

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
                    showAlert(alertBox, '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                    contactForm.reset();
                } else {
                    showAlert(alertBox, data.error || 'Error al enviar el mensaje', 'error');
                }
            } catch (err) {
                showAlert(alertBox, 'Error de conexión con el servidor', 'error');
            }
        });
    }

    function showAlert(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.classList.remove('hidden', 'bg-green-950', 'text-green-200', 'border-green-800', 'bg-red-950', 'text-red-200', 'border-red-800');
        if (type === 'success') {
            el.classList.add('bg-green-950', 'text-green-200', 'border', 'border-green-800');
        } else {
            el.classList.add('bg-red-950', 'text-red-200', 'border', 'border-red-800');
        }
        el.classList.remove('hidden');
    }
});
