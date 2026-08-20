const { test, expect } = require('@playwright/test');

test.describe('Portfolio SEO, GEO, Accessibility & Functionality E2E Tests', () => {

  test('1. Home page contains valid SEO, GEO, JSON-LD Schema and a11y landmarks', async ({ page }) => {
    await page.goto('/');

    // SEO Meta title & description
    await expect(page).toHaveTitle(/Marcos García \| Desarrollador Backend Go & Full Stack/);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /Golang.*PostgreSQL/);

    // GEO Metas
    const geoRegion = page.locator('meta[name="geo.region"]');
    await expect(geoRegion).toHaveAttribute('content', 'ES-MD');

    const geoPlace = page.locator('meta[name="geo.placename"]');
    await expect(geoPlace).toHaveAttribute('content', 'Madrid');

    // Structured data (JSON-LD)
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('Person');
    expect(jsonLd).toContain('Marcos García');
    expect(jsonLd).toContain('Madrid');

    // Accessibility: Skip link
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Accessibility: Landmarks
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('header nav[aria-label="Navegación principal"]')).toBeVisible();

    // Visual Branding & Projects
    await expect(page.locator('text=MARCOS GARCÍA').first()).toBeVisible();
    const projectCards = page.locator('#projects-grid article');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2. Technical SEO files (robots.txt & sitemap.xml) are accessible', async ({ page }) => {
    const robotsRes = await page.goto('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsText = await robotsRes.text();
    expect(robotsText).toContain('User-agent: *');
    expect(robotsText).toContain('Disallow: /admin');
    expect(robotsText).toContain('Sitemap:');

    const sitemapRes = await page.goto('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain('<urlset');
    expect(sitemapXml).toContain('https://marcosgarciaguerra.github.io/');
  });

  test('3. Can navigate to project detail page with SEO Schema and a11y breadcrumbs', async ({ page }) => {
    await page.goto('/');
    const firstDetailLink = page.locator('#projects-grid a:has-text("Detalle")').first();
    await expect(firstDetailLink).toBeVisible();

    await firstDetailLink.click();
    await expect(page.url()).toContain('/projects/');
    await expect(page.locator('text=VISIÓN GENERAL')).toBeVisible();

    // Check project page schema
    const projectSchema = await page.locator('script[type="application/ld+json"]').textContent();
    expect(projectSchema).toContain('CreativeWork');
  });

  test('4. Contact form submission with accessible feedback and validation', async ({ page }) => {
    await page.goto('/#contact');

    // Check accessible labels and form attributes
    await expect(page.locator('label[for="contact-name"]')).toBeVisible();
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
    await expect(page.locator('label[for="contact-message"]')).toBeVisible();

    await page.fill('#contact-name', 'Elena Ramos');
    await page.fill('#contact-email', 'elena@techcompany.es');
    await page.fill('#contact-phone', '+34655443322');
    await page.fill('#contact-message', 'Hola Marcos, queremos entrevistarte para una posición Senior Go en Madrid.');

    await page.click('#contact-form button[type="submit"]');

    const alertBox = page.locator('#contact-alert');
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText('Mensaje enviado con éxito');
    await expect(alertBox).toHaveAttribute('role', 'status');
  });

  test('5. Admin Login and Project CRUD Operations', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#login-id', '1');
    await page.fill('#login-password', 'admin123');
    await page.click('#login-form button[type="submit"]');

    await expect(page).toHaveURL('/admin');
    await expect(page.locator('text=PANEL ADMINISTRADOR')).toBeVisible();

    // Create a new project
    await page.click('#btn-new-project');
    await expect(page.locator('#project-form-container')).toBeVisible();

    const timestamp = Date.now();
    const newProjName = `API Go SEO ${timestamp}`;
    await page.fill('#project-nombre', newProjName);
    await page.fill('#project-descripcion', 'Servicio microservicios optimizado en rendimiento.');
    await page.fill('#project-github', 'https://github.com/test/go-seo-api');
    await page.fill('#project-enlace', 'https://demo-seo.ejemplo.com');

    await page.click('#project-form button[type="submit"]');

    // Check project appears in table
    await expect(page.locator('#projects-table-body')).toContainText(newProjName);

    // Logout
    await page.click('#logout-btn');
    await expect(page).toHaveURL('/admin/login');
  });

  test('6. Admin CV Upload and Status Verification', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('#login-id', '1');
    await page.fill('#login-password', 'admin123');
    await page.click('#login-form button[type="submit"]');

    await expect(page).toHaveURL('/admin');

    // Go to CV tab
    await page.click('#tab-cv');
    await expect(page.locator('#section-cv')).toBeVisible();

    // Upload a test PDF file
    await page.locator('#cv-file-input').setInputFiles({
      name: 'marcos-garcia-cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\nxref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \ntrailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n115\n%%EOF')
    });

    await page.click('#btn-submit-cv');

    const cvAlert = page.locator('#cv-alert');
    await expect(cvAlert).toBeVisible();
    await expect(cvAlert).toContainText('CV actualizado');

    // Verify CV button is now visible on home page
    await page.goto('/');
    const cvDownloadBtn = page.locator('a:has-text("DESCARGAR CV")');
    await expect(cvDownloadBtn).toBeVisible();
    await expect(cvDownloadBtn).toHaveAttribute('href', '/static/cv.pdf');
  });

});
