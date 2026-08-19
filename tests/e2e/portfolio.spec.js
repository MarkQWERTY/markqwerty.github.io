const { test, expect } = require('@playwright/test');

test.describe('Portfolio & Admin Dashboard End-to-End Tests', () => {

  test('1. Home page loads with header, bio, CV link and projects list', async ({ page }) => {
    await page.goto('/');

    // Check title & branding
    await expect(page).toHaveTitle(/Marcos García/);
    await expect(page.locator('text=MARCOS GARCÍA').first()).toBeVisible();

    // Check CV Download button
    const cvBtn = page.locator('a:has-text("DESCARGAR CV")');
    await expect(cvBtn).toBeVisible();
    await expect(cvBtn).toHaveAttribute('href', '/static/cv.pdf');

    // Check projects grid
    const projectCards = page.locator('#projects-grid > div');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2. Can navigate to project detail page', async ({ page }) => {
    await page.goto('/');
    const firstDetailLink = page.locator('#projects-grid a:has-text("Ver Detalle")').first();
    await expect(firstDetailLink).toBeVisible();

    await firstDetailLink.click();
    await expect(page.url()).toContain('/projects/');
    await expect(page.locator('text=VISIÓN GENERAL')).toBeVisible();
  });

  test('3. Can submit contact form successfully', async ({ page }) => {
    await page.goto('/#contact');

    await page.fill('#contact-name', 'Ana López');
    await page.fill('#contact-email', 'ana@ejemplo.com');
    await page.fill('#contact-phone', '+34600112233');
    await page.fill('#contact-message', 'Hola Marcos, nos gustaría contratarte para un proyecto Go.');

    await page.click('#contact-form button[type="submit"]');

    const alertBox = page.locator('#contact-alert');
    await expect(alertBox).toBeVisible();
    await expect(alertBox).toContainText('Mensaje enviado con éxito');
  });

  test('4. Admin Login and Project CRUD Operations', async ({ page }) => {
    await page.goto('/admin/login');

    // Login with default credentials
    await page.fill('#login-id', '1');
    await page.fill('#login-password', 'admin123');
    await page.click('#login-form button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('text=PANEL ADMINISTRADOR')).toBeVisible();

    // Create a new project
    await page.click('#btn-new-project');
    await expect(page.locator('#project-form-container')).toBeVisible();

    const timestamp = Date.now();
    const newProjName = `Proyecto Test ${timestamp}`;
    await page.fill('#project-nombre', newProjName);
    await page.fill('#project-descripcion', 'Descripción de proyecto automatizado en E2E Playwright.');
    await page.fill('#project-github', 'https://github.com/test/e2e-project');
    await page.fill('#project-enlace', 'https://e2e.ejemplo.com');

    await page.click('#project-form button[type="submit"]');

    // Check project appears in table
    await expect(page.locator('#projects-table-body')).toContainText(newProjName);

    // View submissions tab
    await page.click('#tab-submissions');
    await expect(page.locator('#submissions-table-body')).toContainText('Ana López');

    // Logout
    await page.click('#logout-btn');
    await expect(page).toHaveURL('/admin/login');
  });

});
