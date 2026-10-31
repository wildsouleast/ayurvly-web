(function(){
"use strict";
var B=document.body,ROOT=B.getAttribute("data-root")||"",PAGE=B.getAttribute("data-page");
var PRODUCTS={"magnesium-glycinate": {"en": "Magnesium Glycinate", "hi": "मैग्नीशियम ग्लाइसिनेट", "price": 349, "img": "magnesium", "pack": "60 tablets"}, "ashwagandha-gummies": {"en": "Ashwagandha KSM-66 Gummies", "hi": "अश्वगंधा KSM-66 गमीज़", "price": 429, "img": "ashwagandha", "pack": "30 gummies"}};
function ls(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function ss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function hi(){return B.classList.contains("lang-hi")}
function L(en,h){return hi()?h:en}
function $(s,c){return (c||document).querySelector(s)}function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function rupee(n){return "₹"+Number(n).toLocaleString("en-IN")}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
// language
if(ls("ayv-lang","en")==="hi")B.classList.add("lang-hi");
document.documentElement.lang=hi()?"hi":"en";
$$(".lang").forEach(function(b){b.addEventListener("click",function(){B.classList.toggle("lang-hi");ss("ayv-lang",hi()?"hi":"en");document.documentElement.lang=hi()?"hi":"en";document.dispatchEvent(new Event("langchange"))})});
// toast
var tt;function toast(msg){var t=$(".toast");if(!t)return;var parts=String(msg).split("|");t.textContent=hi()&&parts[1]?parts[1]:parts[0];t.classList.add("show");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("show")},2600)}
$$("[data-toast]").forEach(function(el){el.addEventListener("click",function(e){e.preventDefault();toast(el.getAttribute("data-toast"))})});
// cart
function cart(){return ls("ayv-cart",{})}
function setCart(c){ss("ayv-cart",c);count()}
function count(){var c=cart(),n=0;for(var k in c)n+=c[k];$$(".cartcount").forEach(function(e){e.textContent=n})}
count();
$$("[data-qty]").forEach(function(q){var o=$("output",q);$("[data-dec]",q).addEventListener("click",function(){o.textContent=Math.max(1,(+o.textContent)-1);q.dispatchEvent(new Event("qtychange",{bubbles:true}))});$("[data-inc]",q).addEventListener("click",function(){o.textContent=Math.min(20,(+o.textContent)+1);q.dispatchEvent(new Event("qtychange",{bubbles:true}))})});
$$("[data-add]").forEach(function(b){b.addEventListener("click",function(){var id=b.getAttribute("data-add"),n=1;if(b.hasAttribute("data-withqty")){var o=$("[data-qty] output");if(o)n=+o.textContent}var c=cart();c[id]=Math.min(20,(c[id]||0)+n);setCart(c);toast("Added to cart ✓|कार्ट में डाला ✓")})});
function totals(c){var sub=0;for(var k in c)if(PRODUCTS[k])sub+=PRODUCTS[k].price*c[k];var del=sub>=499||sub===0?0:40;return{sub:sub,del:del,tot:sub+del}}
function totalsHtml(c){var t=totals(c);return '<div class="r"><span>'+L("Subtotal","सबटोटल")+'</span><span>'+rupee(t.sub)+'</span></div><div class="r"><span>'+L("Delivery","डिलीवरी")+'</span><span>'+(t.del?rupee(t.del):L("Free","मुफ़्त"))+'</span></div><div class="r t"><span>'+L("Total","कुल")+'</span><span>'+rupee(t.tot)+'</span></div>'}
function renderCart(){var c=cart(),list=$("#cartlist"),h="",keys=Object.keys(c).filter(function(k){return PRODUCTS[k]&&c[k]>0});
 if(!keys.length){list.innerHTML='<div class="empty"><p>'+L("Your cart is empty.","आपका कार्ट ख़ाली है।")+'</p><a class="btn" href="'+ROOT+'index.html#shop">'+L("Shop products","प्रोडक्ट देखें")+'</a></div>';$("#carttotals").style.display="none";$("#tocheckout").style.display="none";return}
 $("#carttotals").style.display="";$("#tocheckout").style.display="";
 keys.forEach(function(k){var p=PRODUCTS[k];h+='<div class="citem"><img src="'+ROOT+'assets/'+p.img+'.jpg" alt=""><div class="cname"><b>'+esc(L(p.en,p.hi))+'</b><small>'+rupee(p.price)+'</small><br><button class="rm" type="button" data-rm="'+k+'">'+L("Remove","हटाएँ")+'</button></div><div class="qty"><button type="button" data-cdec="'+k+'" aria-label="Decrease">−</button><output>'+c[k]+'</output><button type="button" data-cinc="'+k+'" aria-label="Increase">+</button></div></div>'});
 list.innerHTML=h;$("#carttotals").innerHTML=totalsHtml(c);
 $$("[data-cdec]",list).forEach(function(b){b.onclick=function(){var c=cart(),k=b.getAttribute("data-cdec");c[k]=Math.max(1,c[k]-1);setCart(c);renderCart()}});
 $$("[data-cinc]",list).forEach(function(b){b.onclick=function(){var c=cart(),k=b.getAttribute("data-cinc");c[k]=Math.min(20,c[k]+1);setCart(c);renderCart()}});
 $$("[data-rm]",list).forEach(function(b){b.onclick=function(){var c=cart();delete c[b.getAttribute("data-rm")];setCart(c);renderCart()}});}
if(PAGE==="cart"){renderCart();document.addEventListener("langchange",renderCart)}
if(PAGE==="checkout"){
 var c0=cart();if(!Object.keys(c0).length){c0={"magnesium-glycinate":1};setCart(c0)}
 var sumR=function(){var c=cart(),h="";for(var k in c)if(PRODUCTS[k])h+='<div class="r"><span>'+esc(L(PRODUCTS[k].en,PRODUCTS[k].hi))+' × '+c[k]+'</span><span>'+rupee(PRODUCTS[k].price*c[k])+'</span></div>';$("#cosummary").innerHTML=h+totalsHtml(c)};sumR();document.addEventListener("langchange",sumR);
 $("#coform").addEventListener("submit",function(e){e.preventDefault();var f=e.target,miss=["name","phone","addr","city","pin"].filter(function(n){return !f[n].value.trim()});
  if(miss.length){$("#coerr").textContent=L("Please fill all fields (any sample values are fine for the demo).","कृपया सभी जानकारी भरें (डेमो के लिए कोई भी सैंपल चलेगा)।");f[miss[0]].focus();return}
  var c=cart(),t=totals(c),id="AYV-"+(10400+Math.floor(Math.random()*500)),items=[];for(var k in c)if(PRODUCTS[k])items.push(PRODUCTS[k].en.replace(" KSM-66","")+" ×"+c[k]);
  var o={id:id,town:f.city.value.trim().slice(0,24),item:items.join(", "),pay:f.pay.value,amt:t.tot,mine:true,ts:Date.now(),c:c};var mine=ls("ayv-orders",[]);mine.unshift(o);ss("ayv-orders",mine.slice(0,10));ss("ayv-last",o);setCart({});location.href=ROOT+"order-placed/index.html"});}
if(PAGE==="done"){var o=ls("ayv-last",null),el=$("#ordinfo");var r=function(){el.innerHTML=o?L("Order","ऑर्डर")+" <b>"+esc(o.id)+"</b> · "+rupee(o.amt)+" · "+(o.pay==="COD"?L("Cash on delivery","कैश ऑन डिलीवरी"):"UPI"):""};r();document.addEventListener("langchange",r)}
// stores
if(PAGE==="stores"){var ro=function(){var tot=0,mar=0;$$(".roitem").forEach(function(i){var q=+$("output",i).textContent;tot+=q*(+i.getAttribute("data-mrp"));});mar=Math.round(tot*.25);$("#rosum").innerHTML=L("Order value (MRP): ","ऑर्डर वैल्यू (MRP): ")+rupee(tot)+" · "+L("your margin: ","आपका मार्जिन: ")+'<span style="color:#226b39">'+rupee(mar)+"</span>"};ro();document.addEventListener("qtychange",ro);document.addEventListener("langchange",ro);
 $("#storeform").addEventListener("submit",function(e){e.preventDefault();var f=e.target,miss=["store","owner","town","mob"].filter(function(n){return !f[n].value.trim()});if(miss.length){$("#storeerr").textContent=L("Please fill the required fields.","कृपया ज़रूरी जानकारी भरें।");return}
  f.innerHTML='<div class="info center"><div class="okcircle">✓</div><h2>'+L("Thank you!","धन्यवाद!")+'</h2><p>'+L("Request received (demo). In the real pilot our team would call to set up your shelf display and store QR. Nothing was sent.","अनुरोध मिला (डेमो)। असली पायलट में हमारी टीम कॉल करके शेल्फ़ डिस्प्ले और स्टोर QR सेट करेगी। कुछ भेजा नहीं गया।")+'</p></div>'})}
// sahayak
var QA=[
 {k:/neend|nind|sleep|नींद|soya|insomnia/i,q:["Can’t sleep well, what should I take?","नींद नहीं आती, क्या लूँ?"],
  a:["Many people choose <a href='"+ROOT+"product/magnesium-glycinate/index.html'>Magnesium Glycinate</a>. Magnesium supports relaxation and normal sleep.\n• How much and when: as directed on the label.\n• Also helps: fixed sleep time, less screen at night.\n• If sleep trouble lasts more than 2–3 weeks, see a doctor.",
     "कई लोग <a href='"+ROOT+"product/magnesium-glycinate/index.html'>मैग्नीशियम ग्लाइसिनेट</a> चुनते हैं। मैग्नीशियम आराम और सामान्य नींद में सहायक है।\n• कितना और कब: पैक के लेबल पर लिखे अनुसार।\n• साथ में: सोने का तय समय, रात में कम स्क्रीन।\n• अगर नींद की दिक्कत 2–3 हफ़्ते से ज़्यादा है, तो डॉक्टर से मिलें।"],safe:true},
 {k:/stress|tension|tanav|तनाव|exam|chinta|anxi/i,q:["Exam stress is too much — what helps?","एग्ज़ाम का तनाव बहुत है, क्या मदद करेगा?"],
  a:["<a href='"+ROOT+"product/ashwagandha-gummies/index.html'>Ashwagandha KSM-66 Gummies</a> — ashwagandha is traditionally used in Ayurveda to help the body adapt to stress and stay calm.\n• How much: as directed on the label.\n• If you have thyroid issues or take regular medicines, ask your doctor first.",
     "<a href='"+ROOT+"product/ashwagandha-gummies/index.html'>अश्वगंधा KSM-66 गमीज़</a> — आयुर्वेद में अश्वगंधा को तनाव में शरीर को संभलने और शांत रहने के लिए पारंपरिक रूप से इस्तेमाल किया जाता है।\n• कितना: लेबल के अनुसार।\n• थायरॉइड की दिक्कत हो या रोज़ कोई दवा लेते हों, तो पहले डॉक्टर से पूछें।"],safe:true},
 {k:/pregnan|garbh|गर्भ|feeding|stanpan|स्तनपान/i,q:["Can I take it during pregnancy?","क्या प्रेग्नेंसी में ले सकते हैं?"],
  a:["During pregnancy or breastfeeding, please don’t take any supplement without your doctor’s advice. Show the pack and its lab report to your doctor.",
     "गर्भावस्था या स्तनपान में डॉक्टर की सलाह के बिना कोई भी सप्लीमेंट न लें। पैक और उसकी लैब रिपोर्ट अपने डॉक्टर को दिखाएँ।"],safe:true},
 {k:/dawa|medicine|bp|sugar|thyroid|दवा|tablet chal/i,q:["I already take BP/sugar medicine","मेरी BP/शुगर की दवा चल रही है"],
  a:["If you take any regular medicine (BP, sugar, thyroid, etc.), check with your doctor or pharmacist before starting a supplement — some combinations need care. Tap “Talk to a pharmacist” below.",
     "अगर कोई दवा रोज़ चल रही है (BP, शुगर, थायरॉइड आदि), तो सप्लीमेंट शुरू करने से पहले डॉक्टर या फ़ार्मासिस्ट से पूछें — कुछ कॉम्बिनेशन में सावधानी चाहिए। नीचे “फ़ार्मासिस्ट से बात करें” दबाएँ।"],safe:true},
 {k:/bach|child|kid|बच्च|beta|beti/i,q:["Can children take it?","बच्चों को दे सकते हैं?"],
  a:["Ayurvly products are made for adults. For children, please ask a doctor first.","Ayurvly के प्रोडक्ट वयस्कों के लिए हैं। बच्चों के लिए पहले डॉक्टर से पूछें।"],safe:true},
 {k:/kitna|kitni|dose|how much|कितन|matra|मात्रा/i,q:["How many should I take?","कितनी गोली लूँ?"],
  a:["Always as directed on the pack label. Taking more does not give more benefit.","हमेशा पैक के लेबल के अनुसार। ज़्यादा लेने से फ़ायदा ज़्यादा नहीं होता।"],safe:true},
 {k:/lab|report|qr|asli|fake|nakli|रिपोर्ट|असली|नकली/i,q:["How do I know it’s genuine?","कैसे पता चले कि असली है?"],
  a:["Scan the QR on the back of the pack — it opens your exact batch’s lab report: strength, heavy metals and microbial tests. Try a sample: <a href='"+ROOT+"lab/AYV-MG-2611/index.html'>batch AYV-MG-2611</a>.",
     "पैक के पीछे QR स्कैन करें — आपके बैच की लैब रिपोर्ट खुलेगी: ताक़त, हेवी मेटल और बैक्टीरिया टेस्ट। सैंपल देखें: <a href='"+ROOT+"lab/AYV-MG-2611/index.html'>बैच AYV-MG-2611</a>।"]},
 {k:/price|daam|kimat|कीमत|दाम|rate/i,q:["What are the prices?","दाम क्या हैं?"],
  a:["Magnesium Glycinate (60 tablets): ₹349 intro (MRP ₹599).\nAshwagandha Gummies (30): ₹429 (MRP ₹599).\nHerbal teas and Shilajit: coming soon.","मैग्नीशियम ग्लाइसिनेट (60 टैबलेट): ₹349 लॉन्च दाम (MRP ₹599)।\nअश्वगंधा गमीज़ (30): ₹429 (MRP ₹599)।\nहर्बल चाय और शिलाजीत: जल्द आ रहे हैं।"]}
];
if(PAGE==="sahayak"){
 var chat=$("#chat"),chips=$("#chips");
 var SAFE=["It’s a supplement, not a medicine. Pregnant, on medication, or for children — consult a doctor.","ये दवा नहीं, सप्लीमेंट है। गर्भावस्था, कोई दवा चल रही हो या बच्चों के लिए — डॉक्टर से पूछें।"];
 function scroll(){chat.scrollTop=chat.scrollHeight}
 function bub(cls,html){var d=document.createElement("div");d.className="b "+cls;d.innerHTML=html;chat.appendChild(d);scroll();return d}
 function ans(item){var ty=document.createElement("div");ty.className="typing";ty.innerHTML="<i></i><i></i><i></i>";chat.appendChild(ty);scroll();
  setTimeout(function(){ty.remove();var h=L(item.a[0],item.a[1]);if(item.safe)h+='<span class="safe">⚠️ '+L(SAFE[0],SAFE[1])+'</span>';bub("a",h)},850)}
 function ask(text,item){bub("u",esc(text));if(!item){for(var i=0;i<QA.length;i++)if(QA[i].k.test(text)){item=QA[i];break}}
  ans(item||{a:["This demo answers a few common questions — try one of the buttons below, or talk to a pharmacist.","यह डेमो कुछ आम सवालों के जवाब देता है — नीचे के बटन आज़माएँ, या फ़ार्मासिस्ट से बात करें।"]})}
 function drawChips(){chips.innerHTML="";QA.forEach(function(it){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=L(it.q[0],it.q[1]);b.onclick=function(){ask(L(it.q[0],it.q[1]),it)};chips.appendChild(b)})}
 drawChips();document.addEventListener("langchange",drawChips);
 bub("a",L("Namaste! 🙏 I’m Ayurvly Sahayak. Ask me about sleep, stress, safety or lab reports — in Hindi or English.","नमस्ते! 🙏 मैं Ayurvly सहायक हूँ। नींद, तनाव, सुरक्षा या लैब रिपोर्ट के बारे में हिंदी या अंग्रेज़ी में पूछें।"));
 $("#chatform").addEventListener("submit",function(e){e.preventDefault();var v=$("#chatq").value.trim();if(!v)return;$("#chatq").value="";ask(v)});
 setTimeout(function(){if(chat.children.length<2)ask(L(QA[0].q[0],QA[0].q[1]),QA[0])},1400);
}
// admin
if(PAGE==="admin"){
 var STOCK=[{n:"Magnesium Glycinate",id:"magnesium-glycinate",q:420,max:500,price:349},{n:"Ashwagandha Gummies",id:"ashwagandha-gummies",q:186,max:300,price:429}];
 var TOWNS=["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Purnia","Ara","Begusarai","Hajipur","Siwan"];
 var orders=[],n=10421,stats={orders:0,rev:0,upi:0,cod:0};
 function mk(i){var s=STOCK[i%2===0?0:Math.random()<.55?0:1],q=1+(Math.random()<.25?1:0),pay=Math.random()<.6?"UPI":"COD";var amt=s.price*q+(s.price*q>=499?0:40);return{id:"AYV-"+(n++),town:TOWNS[Math.floor(Math.random()*TOWNS.length)],item:s.n+" ×"+q,pay:pay,amt:amt,s:s,q:q,st:["Packed","Shipped","Delivered","New"][Math.floor(Math.random()*4)]}}
 function apply(o){o.s.q=Math.max(0,o.s.q-o.q);stats.orders++;stats.rev+=o.amt;stats[o.pay==="UPI"?"upi":"cod"]++}
 for(var i=0;i<12;i++){var o=mk(i);apply(o);orders.push(o)}
 ls("ayv-orders",[]).forEach(function(m){orders.unshift({id:m.id,town:m.town||"—",item:m.item,pay:m.pay,amt:m.amt,mine:true,st:"New"});stats.orders++;stats.rev+=m.amt;stats[m.pay==="UPI"?"upi":"cod"]++;for(var k in (m.c||{}))STOCK.forEach(function(s){if(s.id===k)s.q=Math.max(0,s.q-m.c[k])})});
 function bump(id,v){var e=$(id);if(e.textContent!==v){e.textContent=v;e.classList.remove("bump");void e.offsetWidth;e.classList.add("bump")}}
 function kpis(){bump("#k-orders",String(stats.orders));bump("#k-rev",rupee(stats.rev));bump("#k-stock",String(STOCK[0].q+STOCK[1].q));$("#k-stores").textContent="6"}
 function stock(){$("#stock").innerHTML=STOCK.map(function(s){var p=Math.round(100*s.q/s.max),low=s.q<s.max*.35;return '<div class="srow"><div class="sl"><span>'+s.n+'</span><span><b>'+s.q+'</b> / '+s.max+(low?' <span class="lowtag">'+L("Low — reorder","कम — दोबारा मँगाएँ")+'</span>':'')+'</span></div><div class="bar"><i class="'+(low?"low":"")+'" style="width:'+p+'%"></i></div></div>'}).join("")}
 function row(o,isNew){return '<tr class="'+(isNew?"new":"")+'"><td><b>'+esc(o.id)+'</b><small>'+esc(o.town)+'</small></td><td>'+esc(o.item)+'</td><td><b>'+rupee(o.amt)+'</b><small>'+o.pay+'</small></td><td><span class="st'+(o.mine?" mine":"")+'">'+(o.mine?L("This phone","इस फ़ोन से"):L(o.st,{New:"नया",Packed:"पैक",Shipped:"भेजा",Delivered:"पहुँचा"}[o.st]))+'</span></td></tr>'}
 function table(newFirst){$("#orders").innerHTML=orders.slice(0,12).map(function(o,i){return row(o,newFirst&&i===0)}).join("")}
 var week=[18,24,21,30,27,35,0];
 function chart(){week[6]=stats.orders;var max=Math.max.apply(null,week)*1.15,W=360,Hh=170,bw=34,g=(W-20-bw*7)/6,days=hi()?["सो","मं","बु","गु","शु","श","आज"]:["Mon","Tue","Wed","Thu","Fri","Sat","Today"],s='<svg viewBox="0 0 '+W+' '+(Hh+30)+'" role="img" aria-label="Orders per day, demo data">';
  week.forEach(function(v,i){var h=Math.max(4,(v/max)*Hh),x=10+i*(bw+g),y=Hh-h;s+='<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+h+'" rx="6" fill="'+(i===6?"#b8924a":"#6f8a66")+'"/><text x="'+(x+bw/2)+'" y="'+(y-5)+'" font-size="11" text-anchor="middle" fill="#26301f">'+v+'</text><text x="'+(x+bw/2)+'" y="'+(Hh+18)+'" font-size="11" text-anchor="middle" fill="#5f6957">'+days[i]+'</text>'});$("#chart7").innerHTML=s+"</svg>"}
 function donut(){var t=stats.upi+stats.cod||1,a=stats.upi/t,R=60,C=2*Math.PI*R;$("#donut").innerHTML='<svg viewBox="0 0 200 200" role="img" aria-label="Payment split, demo data"><circle cx="100" cy="100" r="'+R+'" fill="none" stroke="#e3d6b6" stroke-width="28"/><circle cx="100" cy="100" r="'+R+'" fill="none" stroke="#6f8a66" stroke-width="28" stroke-dasharray="'+(C*a)+' '+C+'" transform="rotate(-90 100 100)"/><text x="100" y="97" text-anchor="middle" font-size="22" font-weight="700" fill="#26301f">'+Math.round(a*100)+'%</text><text x="100" y="117" text-anchor="middle" font-size="12" fill="#5f6957">UPI</text></svg><p class="center" style="margin:4px 0 0;font-size:.85rem"><span style="color:#6f8a66">●</span> UPI '+stats.upi+' &nbsp; <span style="color:#c9b27a">●</span> COD '+stats.cod+'</p>'}
 function all(nw){kpis();stock();table(nw);chart();donut()}
 all(false);document.addEventListener("langchange",function(){all(false)});
 setInterval(function(){if(STOCK[0].q+STOCK[1].q<=0)return;var o=mk(Math.floor(Math.random()*3));o.st="New";apply(o);orders.unshift(o);var s1=$("#scan1"),s2=$("#scan2");if(s1)s1.textContent=+s1.textContent+(Math.random()<.6?1:0);if(s2)s2.textContent=+s2.textContent+(Math.random()<.4?1:0);all(true)},4000);
}
})();