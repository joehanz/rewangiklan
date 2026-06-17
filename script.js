/* =====================================
   API
===================================== */

const API_URL =
"https://script.google.com/macros/s/AKfycbxNGhXnknPcj-9sAPNVlI8qip35R-ftTbbVCgV5g6LUdSwruMqcPHl_ug69J9AGhv3x/exec";

/* =====================================
   ELEMENTS
===================================== */

const listIklan =
document.getElementById("listIklan");

const loadingBox =
document.getElementById("loadingBox");

const searchInput =
document.getElementById("searchInput");

const kategoriFilter =
document.getElementById("kategoriFilter");

const pagination =
document.getElementById("pagination");

const suggestionBox =
document.getElementById("suggestionBox");

const menuBtn =
document.getElementById("menuBtn");

const mobileMenu =
document.getElementById("mobileMenu");

/* =====================================
   GLOBAL
===================================== */

let semuaIklan = [];

let hasilFilter = [];

let halamanAktif = 1;

const iklanPerHalaman = 26;

/* =====================================
   BURGER MENU
===================================== */

if(menuBtn){

menuBtn.addEventListener(
"click",
()=>{

menuBtn.classList.toggle(
"active"
);

mobileMenu.classList.toggle(
"active"
);

const span =
menuBtn.querySelectorAll(
"span"
);

if(
menuBtn.classList.contains(
"active"
)
){

span[0].style.transform =
"rotate(45deg) translate(6px,6px)";

span[1].style.opacity =
"0";

span[2].style.transform =
"rotate(-45deg) translate(5px,-5px)";

}else{

span[0].style.transform =
"";

span[1].style.opacity =
"1";

span[2].style.transform =
"";

}

}
);

}

/* =====================================
   FORMAT WA
===================================== */

function formatWA(wa){

wa = String(
wa || ""
);

wa =
wa.replace(
/\D/g,
''
);

if(
wa.startsWith("0")
){

wa =
"62" +
wa.substring(1);

}

return wa;

}

/* =====================================
   FORMAT HARGA
===================================== */

function formatHarga(harga){

return Number(
harga || 0
).toLocaleString(
"id-ID"
);

}

/* =====================================
   TIME AGO
===================================== */

function timeAgo(dateString){

const now = new Date();
const date = new Date(dateString);

const diff =
Math.floor(
(now - date) / 1000
);

if(diff < 60){
return `${diff} detik lalu`;
}

if(diff < 3600){
return `${Math.floor(diff/60)} menit lalu`;
}

if(diff < 86400){
return `${Math.floor(diff/3600)} jam lalu`;
}

if(diff < 2592000){
return `${Math.floor(diff/86400)} hari lalu`;
}

if(diff < 31536000){
return `${Math.floor(diff/2592000)} bulan lalu`;
}

return `${Math.floor(diff/31536000)} tahun lalu`;

}

/* =====================================
   LOAD DATA
===================================== */

async function loadIklan(){

try{

const response =
await fetch(
API_URL
);

const data =
await response.json();

semuaIklan =
data.reverse();

hasilFilter =
[...semuaIklan];

if(loadingBox){

loadingBox.style.display =
"none";

}

renderHalaman(
halamanAktif
);

}catch(error){

console.error(
error
);

if(loadingBox){

loadingBox.innerHTML =
"Gagal memuat data.";

}

}

}

/* =====================================
   RENDER HALAMAN
===================================== */

function renderHalaman(page){

halamanAktif = page;

const start =
(page - 1) *
iklanPerHalaman;

const end =
start +
iklanPerHalaman;

const data =
hasilFilter.slice(
start,
end
);

renderCards(data);

renderPagination();

}

/* =====================================
   RENDER CARDS
===================================== */

function renderCards(data){

listIklan.innerHTML = "";

if(data.length === 0){

listIklan.innerHTML =

`
<div class="empty-box">

Tidak ada iklan ditemukan.

</div>
`;

return;

}

data.forEach(item=>{

const wa =
formatWA(
item.wa
);

const harga =
formatHarga(
item.harga
);

const waktu =
timeAgo(
item.tanggal
);

const kategori =
(item.kategori || "Umum")
.toUpperCase();

listIklan.innerHTML +=

`
<div class="card">

<div class="card-badge">
${kategori}
</div>

<h3>
${item.judul || "-"}
</h3>

<div class="card-price">
Rp ${harga}
</div>

<div class="card-user">
👤 ${item.nama || "Anonim"}
</div>

<div class="card-time">
🕒 ${waktu}
</div>

<div class="card-divider"></div>

<div class="card-desc">
${item.deskripsi || "-"}
</div>

<a
class="card-btn"
href="https://wa.me/${wa}"
target="_blank">

Chat WhatsApp

</a>

</div>
`;

});

}

/* =====================================
   PAGINATION
===================================== */

function renderPagination(){

pagination.innerHTML = "";

const totalHalaman =
Math.ceil(
hasilFilter.length /
iklanPerHalaman
);

if(totalHalaman <= 1){
return;
}

/* tombol prev */

const prev =
document.createElement(
"button"
);

prev.innerHTML = "&lt;";

prev.disabled =
halamanAktif === 1;

prev.onclick = ()=>{

if(
halamanAktif > 1
){

renderHalaman(
halamanAktif - 1
);

window.scrollTo({
top:0,
behavior:"smooth"
});

}

};

pagination.appendChild(
prev
);

/* nomor halaman */

for(
let i = 1;
i <= totalHalaman;
i++
){

const btn =
document.createElement(
"button"
);

btn.textContent = i;

if(
i === halamanAktif
){

btn.classList.add(
"active"
);

}

btn.onclick = ()=>{

renderHalaman(i);

window.scrollTo({
top:0,
behavior:"smooth"
});

};

pagination.appendChild(
btn
);

}

/* tombol next */

const next =
document.createElement(
"button"
);

next.innerHTML = "&gt;";

next.disabled =
halamanAktif ===
totalHalaman;

next.onclick = ()=>{

if(
halamanAktif <
totalHalaman
){

renderHalaman(
halamanAktif + 1
);

window.scrollTo({
top:0,
behavior:"smooth"
});

}

};

pagination.appendChild(
next
);

}

/* =====================================
   FILTER DATA
===================================== */

function filterData(){

const keyword =
(searchInput?.value || "")
.toLowerCase()
.trim();

const kategori =
(kategoriFilter?.value || "")
.toLowerCase()
.trim();

hasilFilter =
semuaIklan.filter(item=>{

const judul =
(item.judul || "")
.toLowerCase();

const deskripsi =
(item.deskripsi || "")
.toLowerCase();

const nama =
(item.nama || "")
.toLowerCase();

const kategoriItem =
(item.kategori || "")
.toLowerCase();

const cocokKeyword =

judul.includes(keyword)
||
deskripsi.includes(keyword)
||
nama.includes(keyword)
||
kategoriItem.includes(keyword);

const cocokKategori =

kategori === ""
||
kategoriItem === kategori;

return (
cocokKeyword &&
cocokKategori
);

});

halamanAktif = 1;

renderHalaman(
halamanAktif
);

}

/* =====================================
   SEARCH EVENT
===================================== */

if(searchInput){

searchInput.addEventListener(
"input",
()=>{

filterData();

buatSuggestion();

}
);

}

/* =====================================
   CATEGORY EVENT
===================================== */

if(kategoriFilter){

kategoriFilter.addEventListener(
"change",
()=>{

filterData();

}
);

}

/* =====================================
   DATA SUGGESTION
===================================== */

const daftarSuggestion = [

"properti",
"tanah",
"rumah",
"ruko",
"kontrakan",
"kos",

"mobil",
"motor",
"sparepart",

"hp",
"laptop",
"komputer",
"tv",

"fashion",

"makanan",
"minuman",
"catering",

"ayam",
"bebek",
"telur",

"jasa",
"arsitek",
"kontraktor",
"desain",
"servis",

"lowongan",

"elektronik",

"lainnya"

];

/* =====================================
   AUTOCOMPLETE
===================================== */

function buatSuggestion(){

if(!suggestionBox){
return;
}

const keyword =
(searchInput.value || "")
.toLowerCase()
.trim();

if(keyword.length < 1){

suggestionBox.style.display =
"none";

suggestionBox.innerHTML = "";

return;

}

const hasil =
daftarSuggestion.filter(
item =>
item.includes(keyword)
);

if(hasil.length === 0){

suggestionBox.style.display =
"none";

suggestionBox.innerHTML = "";

return;

}

suggestionBox.innerHTML = "";

hasil.forEach(item=>{

const div =
document.createElement(
"div"
);

div.className =
"suggestion-item";

div.textContent =
item;

div.onclick = ()=>{

searchInput.value =
item;

suggestionBox.style.display =
"none";

filterData();

};

suggestionBox.appendChild(
div
);

});

suggestionBox.style.display =
"block";

}

/* =====================================
   CLOSE SUGGESTION
===================================== */

document.addEventListener(
"click",
(e)=>{

if(
!e.target.closest(
".search-wrap"
)
){

if(suggestionBox){

suggestionBox.style.display =
"none";

}

}

}
);

/* =====================================
   MOBILE MENU CLOSE
===================================== */

document.querySelectorAll(
"#mobileMenu a"
).forEach(link=>{

link.addEventListener(
"click",
()=>{

mobileMenu?.classList.remove(
"active"
);

menuBtn?.classList.remove(
"active"
);

const span =
menuBtn?.querySelectorAll(
"span"
);

if(span){

span[0].style.transform =
"";

span[1].style.opacity =
"1";

span[2].style.transform =
"";

}

}
);

});

/* =====================================
   AUTO REFRESH
===================================== */

setInterval(()=>{

loadIklan();

},300000);

/*
300000 ms
=
5 menit
*/

/* =====================================
   START APP
===================================== */

loadIklan();
