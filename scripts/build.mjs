import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','styles.css','robots.txt'])fs.copyFileSync(path.join(root,name),path.join(out,name));
for(const dir of ['src','assets'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
await import('./prepare-seo.mjs');
console.log('Built dist/');
