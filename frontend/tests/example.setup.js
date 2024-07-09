// @ts-check
const { test, expect } = require('@playwright/test');
  test('Is Add a new workout heading visible', async ({page}) => {
    await page.goto('http://localhost:3000/login')
    await page.locator("[name='email']").fill('dpj21@gmail.com');
    await page.locator("[name='password']").fill('Deep@1998');
    await page.locator("[name='login']").click();
    await page.waitForURL('http://localhost:3000');
    await expect(page.getByRole('heading', { name: 'Add a New Workout' })).toBeVisible();
  });

  test('Are we able to fill workout form', async({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.locator("[name='email']").fill('dpj21@gmail.com');
    await page.locator("[name='password']").fill('Deep@1998');
    await page.locator("[name='login']").click();
    await page.waitForURL('http://localhost:3000');

    //fill up workout form
    await page.locator("[name='title']").fill('Dumbells');
    await page.locator("[name='load']").fill('10');
    await page.locator("[name='reps']").fill('10');
    await page.locator("[name='addWorkout']").click();
    //check if card created
    await  expect(page.getByTestId('workoutTitle').first()).toHaveText("Dumbells"); 
    await page.locator("[data-reps= 'workoutReps']", {hasText: "10"}).isVisible();
    await page.locator("[data-load = 'workoutLoad']", {hasText: "10"}).isVisible();
  });

  test('test logout flow', async({page}) => {
    await page.goto('http://localhost:3000/login')
    await page.getByTestId("[name='email']").fill('dpj21@gmail.com');
    await page.locator("[name='password']").fill('Deep@1998');
    await page.locator("[name='login']").click();
    await page.waitForURL('http://localhost:3000');
    await page.locator("[name = 'logout']").click();
    await page.goto('http://localhost:3000/login');
  });  


  test('delete workout', async({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.locator("[name='email']").fill('dpj21@gmail.com');
    await page.locator("[name='password']").fill('Deep@1998');
    await page.locator("[name='login']").click();
    await page.waitForURL('http://localhost:3000');

    await page.locator("[name='title']").fill('Dumbells');
    await page.locator("[name='load']").fill('10');
    await page.locator("[name='reps']").fill('10');
    await page.locator("[name='addWorkout']").click();
    await page.locator("[data-workout = 'workoutTitle']", {hasText: "Dumbells"}).isVisible();
    //delete flow 
    // await page.click([])


  });