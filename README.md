# Thai Distributed Studio

เครื่องมือจัดกระจายข้อความภาษาไทยให้เต็มบรรทัดสำหรับโปสเตอร์ งานวิจัย และ Canva โดยไม่ต้องมี Backend และไม่อัปโหลดข้อความไปยังเซิร์ฟเวอร์

## ฟีเจอร์

- Thai Distributed ผ่านการตัดบรรทัดด้วย `Intl.Segmenter` และเว้นระยะระหว่าง grapheme cluster (ไม่แยกวรรณยุกต์)
- รองรับ Tab / Shift+Tab ทั้งบรรทัดเดียวและหลายบรรทัด
- แสดงตัวอย่างสด เลือกฟอนต์ Noto Sans Thai / Sarabun / Tahoma เปลี่ยนฟอนต์ น้ำหนัก สี ความกว้าง ระยะบรรทัด
- ส่งออก PNG, SVG, WebP, JPG; ภาพ raster ความละเอียด 2× / 4× / 6×; พื้นหลังโปร่งใสหรือสีพื้น
- Responsive layout, keyboard accessibility, FAQ แบบเนื้อหา HTML ที่ Google อ่านได้
- Metadata, Open Graph (PNG), JSON-LD WebApplication; สร้าง canonical/robots/sitemap เมื่อทราบ URL จริง

![หน้าตาเว็บบนคอมพิวเตอร์](docs/screenshot-desktop.png)

## เริ่มใช้งาน

เปิด `index.html` ใน Chrome/Edge (ต้องเชื่อมต่ออินเทอร์เน็ตครั้งแรกหากต้องการโหลด Noto Sans Thai จาก Google Fonts) หรือใช้เว็บเซิร์ฟเวอร์:

```bash
python -m http.server 8080
```

เข้าหน้า `http://localhost:8080/`

## สร้างไฟล์สำหรับเผยแพร่ / SEO

ต้องมี Node.js 20+:

```bash
SITE_URL="https://example.com/" node scripts/build.mjs
```

ระบบจะสร้าง `dist/` พร้อม canonical URL, OG URL, `robots.txt` และ `sitemap.xml` ที่ถูกต้องตาม URL ที่กำหนด **อย่าปล่อย sitemap ด้วย URL ตัวอย่าง** ให้ใช้งานจริง

## GitHub Pages

1. สร้าง Public Repository ใหม่ เช่น `thai-distributed-studio` แล้ว push ไฟล์ทั้งโปรเจกต์
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**
3. Workflow `.github/workflows/deploy.yml` จะเผยแพร่ไฟล์ `dist/` และสร้าง sitemap ตาม URL ของ GitHub Pages โดยอัตโนมัติ
4. เปิดเว็บไซต์ ตรวจสอบลิงก์ `robots.txt` / `sitemap.xml` แล้วเพิ่มเว็บไซต์ใน [Google Search Console](https://search.google.com/search-console/)
5. ส่ง sitemap และใช้ URL Inspection → Request indexing (การติดอันดับไม่รับประกันและต้องใช้เวลา)

## หมายเหตุ

- เครื่องมือนี้เลียนแบบพฤติกรรม Thai Distributed โดยใช้การเว้นระยะระหว่างกลุ่มอักษร แต่ไม่ใช่ layout engine เดียวกับ Microsoft Word
- PNG/WebP/JPG วาดด้วย Canvas โดยตรง ส่วน SVG เก็บ glyph เป็น `<text>` ที่ระบุตำแหน่ง (ไม่มีภาพ bitmap ฝังอยู่) SVG จึงอาจแสดงฟอนต์ต่างกันหากนำเข้าโปรแกรมอื่นที่ไม่มีฟอนต์นั้น
- JPEG ไม่รองรับ transparency จึงใช้พื้นหลังสีขาวหากไม่ได้เลือกสีพื้น
- ข้อความทำงานในเบราว์เซอร์ ไม่ส่งเซิร์ฟเวอร์ แต่การโหลดฟอนต์เว็บมีการเชื่อมต่อกับ Google Fonts
- ห้ามอัปโหลดงานที่มีข้อมูลส่วนบุคคลลง GitHub โดยตรง ไฟล์ `legacy-v1.html` เป็นโค้ดรุ่นเดิมสำหรับการอ้างอิงเท่านั้น

หมายเหตุ GitHub Pages แบบ project site: กฎ robots.txt มีผลเฉพาะเมื่ออยู่ที่ root ของ host เท่านั้น ดังนั้นไฟล์ภายใต้ `/repo/robots.txt` อาจไม่ถูกใช้โดย crawler แต่ `sitemap.xml` ที่ส่งใน Search Console ยังใช้งานได้

## ทดสอบ

```bash
pip install playwright
python -m playwright install chromium
python tests/test_browser.py
```

## GitHub และการเผยแพร่

Repository: https://github.com/BunnyBubui/thai-distributed-studio

GitHub Pages: https://bunnybubui.github.io/thai-distributed-studio/

เปิด **Settings → Pages → Build and deployment → GitHub Actions** ใน Repository เพื่อเผยแพร่จาก workflow `.github/workflows/deploy.yml`

แก้ไข `index.html`, `styles.css`, `src/typesetting.js` และ `src/app.js` แล้ว commit ไปที่ `main` เพื่อเผยแพร่เวอร์ชันใหม่

มี `Thai_Distributed_Studio_Standalone.html` สำหรับเปิดแบบไฟล์เดียว และ `legacy-v1.html` เป็นเวอร์ชันก่อนปรับดีไซน์
