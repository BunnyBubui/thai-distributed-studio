(function(){
'use strict';
const $=id=>document.getElementById(id);
const inputIds=['content','width','size','leading','family','weight','color','background','bgColor','mode','lastLine','tabSize'];
const ctx=document.createElement('canvas').getContext('2d');
const sample=$('content').value;
const examples={
  research:sample,
  note:'ประกาศแจ้งการเปิดรับสมัครเข้าร่วมกิจกรรมประจำปี ผู้สนใจสามารถลงทะเบียนได้ตั้งแต่วันนี้เป็นต้นไป โดยกรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่งแบบฟอร์ม หากมีข้อสงสัยสามารถติดต่อผู้ประสานงานในวันและเวลาทำการ',
  caption:'ภาพแสดงการทำงานของระบบตรวจวัดการเคลื่อนไหวผ่านเซนเซอร์แบบสวมใส่ ซึ่งส่งข้อมูลไปประมวลผลและแสดงผลบนเว็บแอปพลิเคชัน ผู้ดูแลสามารถติดตามข้อมูลและรับการแจ้งเตือนเมื่อระบบตรวจพบความเสี่ยง'
};
let timer,guide=true,zoom=null,last={},inProgress=false;
function effectiveZoom(cfg){const zone=$('previewZone');return zoom===null?Math.min(1,Math.max(.20,(zone.clientWidth-56)/cfg.width)):zoom;}
function config(){return {content:$('content').value,width:Number($('width').value),size:Number($('size').value),leading:Number($('leading').value),family:$('family').value,weight:$('weight').value,color:$('color').value,background:$('background').value,bgColor:$('bgColor').value,mode:$('mode').value,lastLine:$('lastLine').checked,tabSize:Number($('tabSize').value)};}
function render(){
 const c=config();const lo=ThaiLayout.layout(c,ctx);const svg=ThaiLayout.buildSvg(c,lo);last={c,lo,svg};
 $('preview').innerHTML=svg;
 const z=effectiveZoom(c);
 // Scale the SVG visually while sizing the wrapper to its visible dimensions.
 // Avoids clipped content on narrow mobile viewports.
 $('preview').style.width=`${c.width*z}px`;
 $('preview').style.height=`${lo.height*z}px`;
 $('preview').style.margin='0';
 $('preview').firstElementChild.style.transform=`scale(${z})`;
 $('preview').classList.toggle('guides',guide);
 $('widthVal').textContent=c.width+' px';$('sizeVal').textContent=c.size+' px';$('leadingVal').textContent=c.leading.toFixed(2)+'×';
 $('colorText').textContent=c.color.toUpperCase();$('bgColorText').textContent=c.bgColor.toUpperCase();
 $('charCount').textContent=Array.from(c.content).length+' ตัวอักษร';$('dimensions').textContent=`${c.width} × ${lo.height} px`;
 $('zoomText').textContent=Math.round(z*100)+'%';$('customBgWrap').hidden=c.background!=='custom';
}
function update(){clearTimeout(timer);timer=setTimeout(render,25)}
function filename(ext){return `thai-distributed-${new Date().toISOString().slice(0,10)}.${ext}`;}
function saveBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function status(message,error=false){$('status').textContent=message;$('status').style.color=error?'#b24a38':'#2c8669';}
async function exportFile(format){
 if(inProgress)return;
 inProgress=true;status('กำลังสร้างไฟล์…');
 try{
   await document.fonts.ready;
   // Measurements must be computed only after fonts are loaded.
   const c=config();const lo=ThaiLayout.layout(c,ctx);
   if(format==='svg'){
     saveBlob(new Blob([ThaiLayout.buildSvg(c,lo)],{type:'image/svg+xml;charset=utf-8'}),filename('svg'));
   }else{
     const factor=Number($('scale').value);const original=c.background;
     // JPEG cannot store transparency, so it always gets an opaque white canvas.
     if(format==='jpeg'&&c.background==='transparent')c.background='white';
     const canvas=ThaiLayout.drawCanvas(c,lo,factor);
     const mime={png:'image/png',webp:'image/webp',jpeg:'image/jpeg'}[format];
     if(!mime)throw new Error('ไม่รู้จักประเภทไฟล์');
     const blob=await new Promise(resolve=>canvas.toBlob(resolve,mime,.94));
     if(!blob)throw new Error('เบราว์เซอร์ไม่รองรับการสร้างไฟล์นี้');
     if(blob.type!==mime)throw new Error('เบราว์เซอร์ไม่รองรับ '+format.toUpperCase());
     saveBlob(blob,filename(format==='jpeg'?'jpg':format));
     c.background=original;
   }
   status(`ดาวน์โหลด ${format.toUpperCase()} เรียบร้อย`);
 }catch(e){status('ดาวน์โหลดไม่สำเร็จ: '+e.message,true);}finally{inProgress=false;}
}
function changeZoom(n){zoom=Math.max(.20,Math.min(1.8,Math.round(n*100)/100));render();}
// Keyboard indentation: Tab inserts a real tab; Shift+Tab removes one indent level.
// Selected multi-line blocks are changed together, without losing the selection.
$('content').addEventListener('keydown',e=>{
 if(e.key!=='Tab'||e.ctrlKey||e.metaKey||e.altKey)return;
 e.preventDefault();const area=e.currentTarget,text=area.value,start=area.selectionStart,end=area.selectionEnd;
 const firstStart=text.lastIndexOf('\n',Math.max(0,start-1))+1;
 const multi=end>start&&text.slice(start,end).includes('\n');
 const tabSize=Number($('tabSize').value);
 if(multi){const includedEnd=text[end-1]==='\n'?end-1:end;
 const changed=text.slice(firstStart,includedEnd).split('\n').map(line=>e.shiftKey?line.replace(new RegExp('^(?:\\t| {1,'+tabSize+'})'),''):'\t'+line).join('\n');
 area.setRangeText(changed,firstStart,includedEnd,'select');area.setSelectionRange(firstStart,firstStart+changed.length);
 }else if(e.shiftKey){const from=text.slice(firstStart);const match=from.match(new RegExp('^(?:\\t| {1,'+tabSize+'})'));if(match){const removed=match[0].length;area.setRangeText('',firstStart,firstStart+removed,'preserve');area.setSelectionRange(Math.max(firstStart,start-removed),Math.max(firstStart,end-removed));}}
 else area.setRangeText('\t',start,end,'end');
 area.dispatchEvent(new Event('input',{bubbles:true}));
});
inputIds.forEach(id=>{const el=$(id);el.addEventListener('input',update);el.addEventListener('change',update);});
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('content').value=examples[b.dataset.example];update();}));
document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>exportFile(b.dataset.format)));
$('guideBtn').addEventListener('click',()=>{guide=!guide;$('guideBtn').classList.toggle('active',guide);$('guideBtn').setAttribute('aria-pressed',String(guide));render();});
$('zoomOut').addEventListener('click',()=>changeZoom(effectiveZoom(config())-.15));$('zoomIn').addEventListener('click',()=>changeZoom(effectiveZoom(config())+.15));
$('resetBtn').addEventListener('click',()=>{ $('content').value=sample;for(const [id,value] of Object.entries({width:650,size:26,leading:1.65,family:'Noto Sans Thai',weight:400,color:'#173e62',background:'transparent',bgColor:'#ffffff',mode:'distributed',tabSize:4}))$(id).value=value;$('lastLine').checked=false;zoom=null;render();status('เริ่มใหม่แล้ว');});
render();window.addEventListener('resize',()=>{if(zoom===null)render();});document.fonts.ready.then(render).catch(()=>{});
})();
