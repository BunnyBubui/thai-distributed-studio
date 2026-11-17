"""Browser smoke test: pip install playwright && playwright install chromium."""
import asyncio
import pathlib
from playwright.async_api import async_playwright

ROOT=pathlib.Path(__file__).resolve().parents[1]

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        page=await browser.new_page(viewport={"width":1280,"height":900},accept_downloads=True)
        errors=[]
        page.on("pageerror",lambda err: errors.append(str(err)))
        html=(ROOT/"index.html").read_text(encoding="utf-8")
        for ref in ['<link rel="stylesheet" href="styles.css">','<script defer src="src/typesetting.js"></script>','<script defer src="src/app.js"></script>']:
            html=html.replace(ref,"")
        await page.set_content(html)
        await page.add_style_tag(content=(ROOT/"styles.css").read_text(encoding="utf-8"))
        for path in ("src/typesetting.js","src/app.js"):
            await page.add_script_tag(content=(ROOT/path).read_text(encoding="utf-8"))
        assert await page.locator("#preview svg").count()==1
        original=await page.locator("#content").input_value()
        await page.locator("#content").focus()
        await page.keyboard.press("Control+Home")
        await page.keyboard.press("Tab")
        assert (await page.locator("#content").input_value()).startswith("\t")
        await page.keyboard.press("Shift+Tab")
        assert await page.locator("#content").input_value()==original
        for kind in ("png","svg","webp","jpeg"):
            async with page.expect_download() as info:
                await page.locator(f'[data-format="{kind}"]').click()
            dl=await info.value
            assert dl.suggested_filename
        await page.set_viewport_size({"width":390,"height":844})
        assert await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
        assert not errors,errors
        print("PASS: preview, Tab, exports, mobile")
        await browser.close()

if __name__=="__main__":
    asyncio.run(main())
