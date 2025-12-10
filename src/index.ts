import { chromium } from 'playwright';

async function scrapeRepo(url: string) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log(`Search url: ${url}`);

    try {
        await page.goto(url);

        if (await page.getByText('Page not found').isVisible()) {
            console.error("Repo does not exist or is private!");
            await browser.close();
            return;
        }

        const description = await page.locator('.Layout-sidebar .f4').first().innerText().catch(() => "");

        const tags = await page.locator('.topic-tag').allInnerTexts();

        await page.waitForLoadState('networkidle');

        await page.screenshot({
            path: 'repo-preview.png',
            clip: { x: 0, y: 0, width: 1280, height: 800 }
        });

        console.log("Scraped data:");
        console.log({
            description: description.trim(),
            tags: tags,
            screenshot: "Saved as repo-preview.png"
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
}

scrapeRepo('https://github.com/microsoft/playwright');