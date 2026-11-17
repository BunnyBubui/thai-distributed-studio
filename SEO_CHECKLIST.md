เว็บไซต์เป้าหมาย: https://bunnybubui.github.io/thai-distributed-studio/

# SEO & Google Search Console Checklist

## 1. ทำให้เว็บไซต์ออนไลน์ก่อน

- สร้าง Repository สาธารณะสำหรับเว็บไซต์โดยเฉพาะ เช่น `thai-distributed-studio`
- เปิด GitHub Pages โดยเลือก **GitHub Actions** และให้ workflow `.github/workflows/deploy.yml` ทำงาน
- อย่าระบุ URL เว็บไซต์เป็น URL จริงก่อนตรวจสอบว่าเปิดได้ (HTTP 200)
- ใช้ชื่อโดเมนของตัวเองได้ โดยตั้ง Custom domain และแก้ `SITE_URL` ใน workflow ให้ตรงกับโดเมนใหม่

## 2. ตรวจสอบ Technical SEO

- [ ] หน้าเว็บหลัก HTTP 200 ไม่ถูกล็อกอิน และไม่เป็น `noindex`
- [ ] `<title>` และ `<meta name="description">` บรรยายฟังก์ชันอย่างตรงไปตรงมา
- [ ] มี `<h1>` เพียงหนึ่งจุด, เนื้อหาคำอธิบายและ FAQ เป็นข้อความ HTML อ่านได้
- [ ] `<link rel="canonical">` ระบุ URL ที่เผยแพร่จริง
- [ ] `<meta property="og:url">` และ `og:image` เป็น absolute URL
- [ ] `sitemap.xml` มี URL ที่เปิดได้จริง (ไม่ใช่ example.com)
- [ ] ทดสอบ Responsive/mobile และความเร็ว/ความชัดเจนของตัวอักษร
- [ ] ตรวจด้วย Rich Results Test / Google Search Console โดยไม่คาดหวัง rich snippet ทุกประเภท

## 3. ขอให้ Google รู้จักเว็บไซต์

1. เปิด https://search.google.com/search-console/
2. Add property โดยใช้ URL-prefix หรือ Domain property พร้อมยืนยันความเป็นเจ้าของ
3. เปิดเมนู **Sitemaps** ส่ง `https://your-real-site/sitemap.xml`
4. ใช้ **URL Inspection** กับหน้าแรก และเลือก **Request indexing**
5. ติดตามรายงาน Pages/Performance หลังจาก Google เข้าเก็บข้อมูล

Google ไม่รับประกันว่าจะ index หรือจัดอันดับหน้าเว็บแม้ทำ SEO ถูกต้อง การรอผลอาจใช้เวลาหลายวันถึงหลายสัปดาห์หรือมากกว่า และขึ้นกับคุณภาพเนื้อหาและการค้นหาของผู้ใช้

## 4. คีย์เวิร์ดที่สัมพันธ์กับผู้ใช้จริง

- จัดข้อความภาษาไทยชิดสองขอบ
- Thai Distributed ออนไลน์
- จัดข้อความ Canva ภาษาไทย
- PNG ตัวอักษรโปร่งใส
- ส่งออกข้อความ SVG

ไม่ควรยัดคีย์เวิร์ดซ้ำโดยไม่จำเป็น ให้รักษาคำอธิบายและตัวอย่างที่ผู้ใช้เข้าใจได้จริง

**หมายเหตุ GitHub Pages แบบ project site:** `robots.txt` ที่ path `/repo/robots.txt` จะไม่ทำหน้าที่เป็น root-level robots.txt ของโดเมน หากต้องการควบคุม crawler ต้องใช้ root-level robots ของ host; การส่ง sitemap ผ่าน Search Console ยังทำได้ตามปกติ