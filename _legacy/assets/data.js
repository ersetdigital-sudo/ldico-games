function go2(u){const a=document.createElement('a');a.href=u;a.style.display='none';document.body.appendChild(a);a.click();}

const SS={get(k){try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const enc=o=>encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(o))))),dec=s=>{try{return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(e){return null}};
const rp=n=>'Rp'+Math.round(n).toLocaleString('id-ID');
const Q=new URLSearchParams(location.search);
const imgOf=k=>{const e=document.querySelector(`#imgs img[data-k="${k}"]`);return e?e.src:''};
const mk=(u,list)=>list.map(([q,p])=>[q+' '+u,p]);
const GAME_HOW=['Masukkan data akun game kamu','Pilih nominal yang diinginkan','Pilih metode pembayaran','Selesaikan pembayaran, item masuk otomatis'];
const PPOB_HOW=['Masukkan nomor tujuan / ID pelanggan','Pilih nominal atau cek tagihan','Pilih metode pembayaran','Bayar, transaksi diproses instan'];
const S={
ml:{n:'Mobile Legends',pub:'Moonton',t:'game',g:'#3b82f6,#8B5CF6',f:['User ID','Zone ID'],no:[...mk('Diamond',[[86,22500],[172,44900],[257,66800],[344,89000],[429,110500],[514,132000],[706,178000],[1050,265000]]),['Weekly Pass',27500],['Twilight Pass',145000]],d:'Top up diamond MLBB resmi, masuk dalam hitungan detik.'},
ff:{n:'Free Fire',pub:'Garena',t:'game',g:'#f97316,#ef4444',f:['Player ID'],no:[...mk('Diamond',[[70,9500],[140,19000],[355,47500],[720,95000],[1450,190000],[2180,285000]]),['Member Mingguan',29000],['Member Bulanan',89000]],d:'Diamond Free Fire murah untuk bundle dan elite pass.'},
pubg:{n:'PUBG Mobile',pub:'Tencent',t:'game',g:'#eab308,#a16207',f:['Player ID'],no:mk('UC',[[60,15000],[325,75000],[660,150000],[1800,375000],[3850,750000],[8100,1500000]]),d:'UC PUBG Mobile untuk Royale Pass dan skin.'},
gi:{n:'Genshin Impact',pub:'HoYoverse',t:'game',g:'#22d3ee,#6366f1',f:['UID','Server'],no:[...mk('Genesis Crystal',[[60,16000],[330,79000],[1090,249000],[2240,479000],[3880,799000],[8080,1599000]]),['Welkin Moon',79000]],d:'Genesis Crystal dan Welkin Moon via UID.'},
val:{n:'Valorant',pub:'Riot Games',t:'game',g:'#ef4444,#be123c',f:['Riot ID'],no:mk('VP',[[125,15000],[420,50000],[700,80000],[1375,150000],[2400,250000],[4000,400000]]),d:'Valorant Points untuk skin dan battle pass.'},
hok:{n:'Honor of Kings',pub:'Level Infinite',t:'game',g:'#f59e0b,#b45309',f:['Player ID'],no:mk('Token',[[80,15000],[240,45000],[400,75000],[800,150000],[1200,225000],[2400,450000]]),d:'Token HOK resmi dan instan.'},
hsr:{n:'Honkai Star Rail',pub:'HoYoverse',t:'game',g:'#a78bfa,#1e1b4b',f:['UID','Server'],no:[...mk('Oneiric Shard',[[60,16000],[330,79000],[1090,249000],[2240,479000]]),['Express Pass',79000]],d:'Oneiric Shard dan Express Supply Pass.'},
cod:{n:'Call of Duty Mobile',pub:'Activision',t:'game',g:'#64748b,#0f172a',f:['Player UID'],no:mk('CP',[[63,10000],[321,50000],[645,100000],[1373,200000],[3564,500000]]),d:'COD Points untuk battle pass dan crate.'},
aov:{n:'Arena of Valor',pub:'Garena',t:'game',g:'#06b6d4,#1e3a8a',f:['Player ID'],no:mk('Voucher',[[40,10000],[90,20000],[230,50000],[470,100000],[950,200000]]),d:'Voucher AOV untuk hero dan skin.'},
steam:{n:'Steam Wallet',pub:'Valve',t:'game',g:'#1e293b,#0ea5e9',f:['Email penerima'],no:[['IDR 45.000',48000],['IDR 90.000',95000],['IDR 250.000',262000],['IDR 400.000',418000],['IDR 600.000',625000]],d:'Kode voucher Steam dikirim ke email.'},
gplay:{n:'Google Play',pub:'Google',t:'game',g:'#22c55e,#0ea5e9',f:['Email penerima'],no:[['Rp20.000',21500],['Rp50.000',52500],['Rp100.000',104000],['Rp150.000',155000],['Rp300.000',308000]],d:'Gift card Google Play untuk semua game Android.'},
roblox:{n:'Roblox',pub:'Roblox Corp.',t:'game',g:'#e11d48,#111827',f:['Username Roblox'],no:mk('Robux',[[80,15000],[400,72000],[800,140000],[1700,285000],[4500,720000]]),d:'Robux resmi via gift card.'},
pulsa:{n:'Pulsa',pub:'Semua operator',t:'ppob',g:'#C6FF00,#22D3EE',f:['Nomor HP'],no:[[5e3,5600],[1e4,10700],[2e4,20900],[25e3,26000],[5e4,51500],[1e5,102500]].map(([a,b])=>['Pulsa '+a/1e3+'rb',b]),d:'Isi pulsa Telkomsel, Indosat, XL, Axis, Tri, Smartfren, by.U.'},
data:{n:'Paket Data',pub:'Semua operator',t:'ppob',g:'#22D3EE,#3b82f6',f:['Nomor HP'],no:[['Harian 2GB',8000],['Mingguan 7GB',25000],['Bulanan 15GB',55000],['Bulanan 30GB',85000],['Bulanan 50GB',120000],['Unlimited 30hr',150000]],d:'Paket internet semua operator, aktif instan.'},
pln:{n:'Token PLN',pub:'PLN',t:'ppob',g:'#facc15,#f97316',f:['Nomor Meter / ID Pelanggan'],no:[2e4,5e4,1e5,2e5,5e5,1e6].map(v=>['Token '+rp(v),v+2500]),d:'Token listrik prabayar, kode muncul < 5 detik.'},
ewallet:{n:'E-Wallet',pub:'DANA · OVO · GoPay · ShopeePay',t:'ppob',g:'#8B5CF6,#22D3EE',f:['Nomor akun e-wallet'],no:[2e4,5e4,1e5,2e5,3e5,5e5].map(v=>['Saldo '+rp(v),v+1500]),d:'Top up saldo e-wallet favorit kamu.'},
bpjs:{n:'BPJS Kesehatan',pub:'BPJS',t:'ppob',g:'#22c55e,#15803d',f:['Nomor VA Keluarga'],no:[['1 bulan (3 jiwa)',105000],['2 bulan (3 jiwa)',210000],['3 bulan (3 jiwa)',315000]],d:'Bayar iuran BPJS Kesehatan tanpa antre.'},
pdam:{n:'PDAM',pub:'Seluruh Indonesia',t:'ppob',g:'#0ea5e9,#1e3a8a',f:['ID Pelanggan PDAM'],no:[['Tagihan Okt 2026',87500]],d:'Tagihan air PDAM, cek & bayar langsung.'},
internet:{n:'Internet & TV',pub:'IndiHome · Biznet · MyRepublic',t:'ppob',g:'#ef4444,#8B5CF6',f:['ID Pelanggan'],no:[['Tagihan Okt 2026',345000]],d:'Bayar tagihan internet rumah bulanan.'},
tv:{n:'TV & Streaming',pub:'Vidio · Netflix · K-Vision',t:'ppob',g:'#f43f5e,#111827',f:['ID Pelanggan / Email'],no:[['Paket 1 bulan',50000],['Paket 3 bulan',140000],['Paket 6 bulan',270000]],d:'Voucher TV kabel dan streaming.'}
};
const PAY={'QRIS':[0,'E-Wallet & Bank'],'DANA':[0.015,'E-Wallet'],'OVO':[0.015,'E-Wallet'],'GoPay':[0.02,'E-Wallet'],'ShopeePay':[0.015,'E-Wallet'],'BCA VA':[4000,'Virtual Account'],'BRI VA':[4000,'Virtual Account'],'Mandiri VA':[4000,'Virtual Account'],'Alfamart':[2500,'Gerai Retail'],'Indomaret':[2500,'Gerai Retail']};
const feeOf=(m,sub)=>{const f=PAY[m][0];return f<1?Math.round(sub*f):f};
const PROMO={LDICOPLN:{k:'pln',p:.1,max:1e4},LDICO10:{p:.1,max:15000}};

const HIST={all(){try{return JSON.parse(localStorage.getItem('ldico_hist')||'[]')}catch(e){return []}},save(o){const a=this.all().filter(x=>x.inv!=o.inv);a.unshift(o);try{localStorage.setItem('ldico_hist',JSON.stringify(a.slice(0,30)))}catch(e){}},get(n){n=n.trim().toUpperCase();return this.all().find(x=>x.inv==n)||DEMO.find(x=>x.inv==n)}};
const DEMO=[{inv:'LDC-28819',k:'ml',i:1,f:[['User ID','12345678'],['Zone ID','1234']],m:'QRIS',fee:0,disc:0,total:44900,wa:'0812xxxx',ts:Date.now()-36e5,st:3},
{inv:'LDC-28818',k:'pln',i:1,f:[['Nomor Meter / ID Pelanggan','5300xxxxxx']],m:'DANA',fee:788,disc:5250,total:48038,wa:'0857xxxx',ts:Date.now()-72e5,st:3,token:'4821 0093 1177 5520 3361'},
{inv:'LDC-28817',k:'pubg',i:1,f:[['Player ID','51xxxxxx']],m:'BCA VA',fee:4000,disc:0,total:79000,wa:'0813xxxx',ts:Date.now()-6e5,st:2},
{inv:'LDC-28816',k:'ff',i:2,f:[['Player ID','98xxxxxx']],m:'Alfamart',fee:2500,disc:0,total:50000,wa:'0821xxxx',ts:Date.now()-3e5,st:0}];
const STEPS=['Pesanan dibuat','Pembayaran diterima','Pesanan diproses','Selesai, item terkirim'];
const NAV=`<nav class="flex gap-5 text-sm text-[var(--mut)]"><a href="/#games" class="hover:text-white">Games</a><a href="/lacak" class="hover:text-white">Lacak</a><a href="/pembayaran" class="hover:text-white">Pembayaran</a></nav>`;
