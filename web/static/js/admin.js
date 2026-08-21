document.addEventListener('DOMContentLoaded', () => {
    // LOGIN PAGE
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('login-id').value, 10);
            const password = document.getElementById('login-password').value;
            const alertBox = document.getElementById('login-alert');

            try {
                const res = await fetch('/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, password })
                });

                const data = await res.json();
                if (res.ok) {
                    window.location.href = '/admin';
                } else {
                    showAlert(alertBox, data.error || 'Credenciales incorrectas', 'error');
                }
            } catch (err) {
                showAlert(alertBox, 'Error de conexión con el servidor', 'error');
            }
        });
    }

    // ADMIN DASHBOARD PAGE
    const adminNameTag = document.getElementById('admin-name-tag');
    if (adminNameTag) {
        initDashboard();
    }

    async function initDashboard() {
        // Check auth status asynchronously (non-blocking for UI event binding)
        checkAuth();

        // Tabs setup

        // Tabs setup
        const tabProjects = document.getElementById('tab-projects');
        const tabSubmissions = document.getElementById('tab-submissions');
        const tabCv = document.getElementById('tab-cv');
        const tabSecurity = document.getElementById('tab-security');

        const secProjects = document.getElementById('section-projects');
        const secSubmissions = document.getElementById('section-submissions');
        const secCv = document.getElementById('section-cv');
        const secSecurity = document.getElementById('section-security');

        const allTabs = [tabProjects, tabSubmissions, tabCv, tabSecurity].filter(Boolean);
        const allSecs = [secProjects, secSubmissions, secCv, secSecurity].filter(Boolean);

        tabProjects.addEventListener('click', () => switchTab(tabProjects, secProjects));
        tabSubmissions.addEventListener('click', () => {
            switchTab(tabSubmissions, secSubmissions);
            loadSubmissions();
        });
        if (tabCv) {
            tabCv.addEventListener('click', () => {
                switchTab(tabCv, secCv);
                loadCVStatus();
            });
        }
        tabSecurity.addEventListener('click', () => switchTab(tabSecurity, secSecurity));

        function switchTab(activeTab, activeSec) {
            allTabs.forEach(t => {
                t.classList.remove('border-primary-fixed', 'text-primary-fixed');
                t.classList.add('border-transparent', 'text-on-surface-variant');
            });
            allSecs.forEach(s => s.classList.add('hidden'));

            activeTab.classList.remove('border-transparent', 'text-on-surface-variant');
            activeTab.classList.add('border-primary-fixed', 'text-primary-fixed');
            activeSec.classList.remove('hidden');
        }

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await fetch('/api/v1/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        });

        // Load stats & projects
        loadStats();
        loadProjects();

        // Project Form Setup
        const btnNewProj = document.getElementById('btn-new-project');
        const btnCancelProj = document.getElementById('btn-cancel-project');
        const projFormContainer = document.getElementById('project-form-container');
        const projForm = document.getElementById('project-form');

        btnNewProj.addEventListener('click', () => {
            projForm.reset();
            document.getElementById('project-id').value = '';
            document.getElementById('project-form-title').textContent = 'NUEVO PROYECTO';
            projFormContainer.classList.remove('hidden');
        });

        btnCancelProj.addEventListener('click', () => {
            projFormContainer.classList.add('hidden');
        });

        projForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('project-id').value;
            const nombre_p = document.getElementById('project-nombre').value.trim();
            const descripcion = document.getElementById('project-descripcion').value.trim();
            const github = document.getElementById('project-github').value.trim();
            const enlace = document.getElementById('project-enlace').value.trim();

            const payload = { nombre_p, descripcion, github, enlace };
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/v1/projects/${id}` : '/api/v1/projects';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                projFormContainer.classList.add('hidden');
                projForm.reset();
                loadProjects();
                loadStats();
            } else {
                alert('Error al guardar el proyecto');
            }
        });

        // Change Password / Credentials Form Setup
        const changePassForm = document.getElementById('change-password-form');
        const passAlert = document.getElementById('password-alert');

        changePassForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const newIdVal = document.getElementById('new-id').value;
            const newId = newIdVal ? parseInt(newIdVal, 10) : 0;

            if (!newPassword && !newId) {
                showAlert(passAlert, 'Debes ingresar un nuevo ID o una nueva contraseña', 'error');
                return;
            }

            const res = await fetch('/api/v1/auth/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    old_password: oldPassword, 
                    new_password: newPassword,
                    new_id: newId
                })
            });

            const data = await res.json();
            if (res.ok) {
                showAlert(passAlert, 'Credenciales actualizadas correctamente', 'success');
                changePassForm.reset();
                // Refresh authentication status to show new ID in UI header
                checkAuth();
            } else {
                showAlert(passAlert, data.error || 'Error al actualizar credenciales', 'error');
            }
        });

        // CV Management Setup
        const cvUploadForm = document.getElementById('cv-upload-form');
        const cvAlert = document.getElementById('cv-alert');
        const btnDeleteCv = document.getElementById('btn-delete-cv');

        if (cvUploadForm) {
            cvUploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('cv-file-input');
                const file = fileInput.files[0];
                if (!file) {
                    showAlert(cvAlert, 'Por favor, selecciona un archivo PDF.', 'error');
                    return;
                }

                if (!file.name.toLowerCase().endsWith('.pdf')) {
                    showAlert(cvAlert, 'El archivo seleccionado debe ser un PDF (.pdf).', 'error');
                    return;
                }

                const submitBtn = document.getElementById('btn-submit-cv');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `SUBIENDO... <span class="material-symbols-outlined text-sm animate-spin">sync</span>`;

                const formData = new FormData();
                formData.append('cv', file);

                try {
                    const res = await fetch('/api/v1/cv', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    if (res.ok) {
                        showAlert(cvAlert, '¡CV actualizado y publicado con éxito!', 'success');
                        cvUploadForm.reset();
                        loadCVStatus();
                    } else {
                        showAlert(cvAlert, data.error || 'Error al subir el CV', 'error');
                    }
                } catch (err) {
                    showAlert(cvAlert, 'Error de conexión con el servidor', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        }

        if (btnDeleteCv) {
            btnDeleteCv.addEventListener('click', async () => {
                if (!confirm('¿Estás seguro de que deseas eliminar el archivo del CV? El botón de descarga dejará de estar disponible en el portafolio.')) {
                    return;
                }

                try {
                    const res = await fetch('/api/v1/cv', {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (res.ok) {
                        showAlert(cvAlert, 'CV eliminado exitosamente.', 'success');
                        loadCVStatus();
                    } else {
                        showAlert(cvAlert, data.error || 'Error al eliminar el CV', 'error');
                    }
                } catch (err) {
                    showAlert(cvAlert, 'Error de conexión al eliminar el CV', 'error');
                }
            });
        }
    }

    async function loadCVStatus() {
        const statusTitle = document.getElementById('cv-status-title');
        const statusSubtitle = document.getElementById('cv-status-subtitle');
        const btnViewCv = document.getElementById('btn-view-cv');
        const btnDeleteCv = document.getElementById('btn-delete-cv');
        if (!statusTitle) return;

        try {
            const res = await fetch('/api/v1/cv/status');
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    statusTitle.textContent = 'Archivo CV Disponible (cv.pdf)';
                    statusTitle.className = 'text-sm font-bold text-green-400 block';
                    statusSubtitle.textContent = 'Publicado y listo para descarga en el portafolio.';
                    btnViewCv.classList.remove('hidden');
                    btnDeleteCv.classList.remove('hidden');
                } else {
                    statusTitle.textContent = 'Sin archivo de CV configurado';
                    statusTitle.className = 'text-sm font-bold text-yellow-400 block';
                    statusSubtitle.textContent = 'Actualmente no hay ningún archivo PDF subido.';
                    btnViewCv.classList.add('hidden');
                    btnDeleteCv.classList.add('hidden');
                }
            }
        } catch (err) {
            statusTitle.textContent = 'Error consultando estado del CV';
            statusTitle.className = 'text-sm font-bold text-red-400 block';
        }
    }

    async function loadStats() {
        try {
            const res = await fetch('/api/v1/dashboard/stats');
            if (res.ok) {
                const stats = await res.json();
                document.getElementById('stat-projects').textContent = stats.total_projects;
                document.getElementById('stat-messages').textContent = stats.total_messages;
            }
        } catch (err) {}
    }

    async function loadProjects() {
        const tbody = document.getElementById('projects-table-body');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center">Cargando...</td></tr>';

        try {
            const res = await fetch('/api/v1/projects');
            const projects = await res.json();
            tbody.innerHTML = '';

            if (projects.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center">No hay proyectos.</td></tr>';
                return;
            }

            projects.forEach(p => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-high';
                tr.innerHTML = `
                    <td class="p-4 font-bold text-primary-fixed">#${p.id_proyecto}</td>
                    <td class="p-4 font-bold text-primary">${escapeHtml(p.nombre_p)}</td>
                    <td class="p-4 max-w-xs truncate">${escapeHtml(p.descripcion)}</td>
                    <td class="p-4"><a href="${escapeHtml(p.github)}" target="_blank" class="text-primary-fixed hover:underline">GitHub</a></td>
                    <td class="p-4">${p.enlace ? `<a href="${escapeHtml(p.enlace)}" target="_blank" class="text-primary-fixed hover:underline">Demo</a>` : '-'}</td>
                    <td class="p-4 text-right flex justify-end gap-2">
                        <button class="px-2 py-1 bg-yellow-900 text-yellow-200 text-[10px] font-bold btn-edit" data-id="${p.id_proyecto}">EDITAR</button>
                        <button class="px-2 py-1 bg-red-950 text-red-200 text-[10px] font-bold btn-del" data-id="${p.id_proyecto}">BORRAR</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Bind edit/delete events
            tbody.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', () => editProject(btn.dataset.id, projects));
            });
            tbody.querySelectorAll('.btn-del').forEach(btn => {
                btn.addEventListener('click', () => deleteProject(btn.dataset.id));
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-400">Error al cargar proyectos</td></tr>';
        }
    }

    function editProject(id, projects) {
        const p = projects.find(item => item.id_proyecto == id);
        if (!p) return;
        document.getElementById('project-id').value = p.id_proyecto;
        document.getElementById('project-nombre').value = p.nombre_p;
        document.getElementById('project-descripcion').value = p.descripcion;
        document.getElementById('project-github').value = p.github;
        document.getElementById('project-enlace').value = p.enlace || '';
        document.getElementById('project-form-title').textContent = `EDITAR PROYECTO #${p.id_proyecto}`;
        document.getElementById('project-form-container').classList.remove('hidden');
    }

    async function deleteProject(id) {
        if (!confirm(`¿Seguro que deseas eliminar el proyecto #${id}?`)) return;
        const res = await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadProjects();
            loadStats();
        } else {
            alert('Error al eliminar proyecto');
        }
    }

    async function loadSubmissions() {
        const tbody = document.getElementById('submissions-table-body');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center">Cargando...</td></tr>';

        try {
            const res = await fetch('/api/v1/contact-submissions');
            const list = await res.json();
            tbody.innerHTML = '';

            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center">No hay mensajes recibidos.</td></tr>';
                return;
            }

            list.forEach(c => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-high';
                tr.innerHTML = `
                    <td class="p-4 font-bold text-primary-fixed">#${c.id_form}</td>
                    <td class="p-4 text-[10px]">${new Date(c.created_at).toLocaleString()}</td>
                    <td class="p-4 font-bold text-primary">${escapeHtml(c.nombre)}</td>
                    <td class="p-4">${escapeHtml(c.mail)}</td>
                    <td class="p-4">${escapeHtml(c.telefono || '-')}</td>
                    <td class="p-4 max-w-xs break-words">${escapeHtml(c.texto)}</td>
                    <td class="p-4 text-right">
                        <button class="px-2 py-1 bg-red-950 text-red-200 text-[10px] font-bold btn-del-sub" data-id="${c.id_form}">BORRAR</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('.btn-del-sub').forEach(btn => {
                btn.addEventListener('click', () => deleteSubmission(btn.dataset.id));
            });
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-red-400">Error al cargar mensajes</td></tr>';
        }
    }

    async function deleteSubmission(id) {
        if (!confirm(`¿Seguro que deseas eliminar el mensaje #${id}?`)) return;
        const res = await fetch(`/api/v1/contact-submissions/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadSubmissions();
            loadStats();
        } else {
            alert('Error al eliminar mensaje');
        }
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

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    async function checkAuth() {
        try {
            const res = await fetch('/api/v1/auth/me');
            if (!res.ok) {
                window.location.href = '/admin/login';
                return;
            }
            const admin = await res.json();
            const adminNameTag = document.getElementById('admin-name-tag');
            if (adminNameTag) {
                adminNameTag.textContent = `Admin: ${admin.nombre} ${admin.apellidos} (ID: ${admin.id})`;
            }
        } catch (err) {
            window.location.href = '/admin/login';
        }
    }
});
