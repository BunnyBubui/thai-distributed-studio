import fs from 'node:fs';
import path from 'node:path';
const cwd=process.cwd();let html=fs.readFileSync(path.join(cwd,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+fs.readFileSync(path.join(cwd,'styles.css'),'utf8')+'</style>');
let scripts='';
for(const src of ['src/typesetting.js','src/app.js']){
 html=html.replace('<script defer src="'+src+'"></script>','');
 scripts+='\n<script>'+fs.readFileSync(path.join(cwd,src),'utf8')+'</script>';
}
html=html.replace('</body>',scripts+'\n</body>');
html=html.replace('href="assets/favicon.svg"','href="data:image/svg+xml,'+encodeURIComponent(fs.readFileSync(path.join(cwd,'assets/favicon.svg'),'utf8'))+'"');
html=html.replace(/\s*<meta property="og:image"[^>]*>/,'');
fs.writeFileSync(path.join(cwd,'Thai_Distributed_Studio_Standalone.html'),html);
console.log('Standalone HTML generated');
