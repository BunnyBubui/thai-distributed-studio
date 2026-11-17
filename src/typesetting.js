/* Thai text layout utilities. No network requests and no dependencies. */
(function (root) {
'use strict';
const wordSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th', {granularity:'word'}) : null;
const charSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('th', {granularity:'grapheme'}) : null;
const graphemes = str => charSegmenter ? Array.from(charSegmenter.segment(str), s=>s.segment) : Array.from(str);
const tokens = str => wordSegmenter ? Array.from(wordSegmenter.segment(str), s=>s.segment) : (str.match(/\s+|[^\s]+/gu)||[]);
const esc = s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const font = cfg => `${cfg.weight} ${cfg.size}px "${cfg.family}", Tahoma, sans-serif`;
function layout(cfg, context) {
  context.font=font(cfg); context.textBaseline='alphabetic';
  const measure=t=>context.measureText(t).width;
  const lines=[];
  const paras=String(cfg.content).replace(/\r\n?/g,'\n').split('\n');
  const pad=Math.max(2,cfg.size*.14);
  const width=cfg.width-2*pad;
  for (const para of paras) {
    const indentMatch=para.match(/^[\t ]*/u);
    const indentRaw=indentMatch?indentMatch[0]:'';
    const indentText=indentRaw.replace(/\t/g, '\u00a0'.repeat(cfg.tabSize)).replace(/ /g, '\u00a0');
    const indent=Math.min(width*0.85,measure(indentText));
    const words=tokens(para.slice(indentRaw.length));
    let current='';let first=true;
    const avail=()=>width-(first?indent:0);
    function put(last){lines.push({text:current.replace(/[ ]+$/gu,''),indent:first?indent:0,last:!!last}); current='';first=false;}
    for (let chunk of words) {
      if (!current)chunk=chunk.replace(/^[ ]+/u,'');
      if(!chunk)continue;
      if(measure(current+chunk)<=avail()+.05){current+=chunk;continue;}
      if(current){put(false);chunk=chunk.replace(/^[ ]+/u,'');if(!chunk)continue;}
      if(measure(chunk)<=avail()+.05){current=chunk;continue;}
      // If even a single segmented word overflows, break only on grapheme boundaries.
      for(const g of graphemes(chunk)){
        if(current && measure(current+g)>avail()+.05) put(false);
        current+=g;
      }
    }
    put(true);
  }
  const baseline=cfg.size*1.35;
  const step=cfg.size*cfg.leading;
  const height=Math.max(Math.ceil(cfg.size*1.85),Math.ceil(baseline+(lines.length-1)*step+cfg.size*.60));
  return {lines,measure,graphemes,width,height,baseline,step};
}
function visualLine(cfg,lo,line){
 const letters=graphemes(line.text);const raw=lo.measure(line.text);
 const pad=Math.max(2,cfg.size*.14);
 const available=Math.max(0,cfg.width-line.indent-2*pad);
 const fill=cfg.mode==='distributed'&&(!line.last||cfg.lastLine)&&letters.length>1&&raw<available;
 if(fill){
   // Space each Thai grapheme cluster; dependent vowel/mark clusters remain unbroken.
   const sizes=letters.map(lo.measure);
   const extra=Math.max(0,available-sizes.reduce((a,b)=>a+b,0));
   const gap=extra/(letters.length-1);
   let x=line.indent+pad;
   return letters.map((g,i)=>{let old=x; x+=sizes[i]+(i===letters.length-1?0:gap); return {text:g,x:old};});
 }
 let x=line.indent+pad;
 if(cfg.mode==='center') x=Math.max(pad,(cfg.width-raw)/2);
 if(cfg.mode==='right') x=Math.max(pad,cfg.width-pad-raw);
 return [{text:line.text,x}];
}
function buildSvg(cfg,lo){
 const txt=lo.lines.map((line,i)=>visualLine(cfg,lo,line).map(part=>`<text x="${part.x.toFixed(3)}" y="${(lo.baseline+lo.step*i).toFixed(3)}" xml:space="preserve">${esc(part.text)}</text>`).join('')).join('\n');
 const bg=cfg.background==='transparent'?'':`<rect width="100%" height="100%" fill="${esc(cfg.background==='custom'?cfg.bgColor:'#ffffff')}"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.width}" height="${lo.height}" viewBox="0 0 ${cfg.width} ${lo.height}" role="img" aria-label="ข้อความภาษาไทยที่จัดบรรทัดแล้ว">${bg}<g font-family="${esc(cfg.family)}, Tahoma, sans-serif" font-size="${cfg.size}" font-weight="${cfg.weight}" fill="${esc(cfg.color)}">${txt}</g></svg>`;
}
function drawCanvas(cfg,lo,scale){
 const canvas=document.createElement('canvas');canvas.width=Math.round(cfg.width*scale);canvas.height=Math.round(lo.height*scale);
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('ไม่สามารถสร้าง Canvas ได้');
 ctx.scale(scale,scale);
 if(cfg.background!=='transparent'){ctx.fillStyle=cfg.background==='custom'?cfg.bgColor:'#ffffff';ctx.fillRect(0,0,cfg.width,lo.height);}
 ctx.font=font(cfg);ctx.textBaseline='alphabetic';ctx.fillStyle=cfg.color;
 lo.lines.forEach((line,i)=>{const y=lo.baseline+lo.step*i;visualLine(cfg,lo,line).forEach(part=>ctx.fillText(part.text,part.x,y));});
 return canvas;
}
root.ThaiLayout={layout,buildSvg,drawCanvas,graphemes};
})(window);
