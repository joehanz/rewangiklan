const API_URL =
"https://script.google.com/macros/s/AKfycbxNGhXnknPcj-9sAPNVlI8qip35R-ftTbbVCgV5g6LUdSwruMqcPHl_ug69J9AGhv3x/exec";

const menuBtn =
document.getElementById("menuBtn");

const mobileMenu =
document.getElementById("mobileMenu");

const searchInput =
document.getElementById("searchInput");

const kategoriFilter =
document.getElementById("kategoriFilter");

const listIklan =
document.getElementById("listIklan");

const loadingBox =
document.getElementById("loadingBox");

let semuaIklan = [];

/* ==========================
   BURGER MENU
========================== */

menuBtn.addEventListener("click",()=>{

menuBtn.classList.toggle("active");

mobileMenu.classList.toggle("active");

});

/* ==========================
   BURGER TO X
========================== */

menuBtn.addEventListener("click",()=>{

const span =
menuBtn.querySelectorAll("span");

if(menuBtn.classList.contains("active")){

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

});

/* ==========================
   LOAD DATA
========================== */

async function loadIklan(){

try{

const res =
await fetch(API_URL);

const data =
await res.json();

semuaIklan =
data.reverse();

renderIklan(
semuaIklan
);

if(loadingBox){

loadingBox.style.display =
"none";

}

}catch(err){

console.error(err);

if(loadingBox){

loadingBox.innerHTML =
"Gagal memuat data.";

}

}

}

/* ==========================
   RENDER
========================== */

function renderIklan(data){

listIklan.innerHTML = "";

if(data.length===0){

listIklan.innerHTML =

`
<div class="card">

<h3>
Belum Ada Iklan
</h3>

<p>
Tidak ditemukan data.
</p>

</div>
`;

return;

}

data.forEach(item=>{

let wa =
String(item.wa || "");

wa =
wa.replace(/\D/g,'');

if(
wa.startsWith("0")
){

wa =
"62" +
wa.substring(1);

}

const harga =
Number(item.harga || 0)
.toLocaleString("id-ID");

const kategori =
(item.kategori || "")
.toLowerCase();

listIklan.innerHTML +=

`
<div class="card">

<div class="card-badge">

${kategori || "umum"}

</div>

<h3>

${item.judul || "-"}

</h3>

<div class="card-user">

👤 ${item.nama || "Anonim"}

</div>

<p>

${item.deskripsi || "-"}

</p>

<div class="card-price">

Rp ${harga}

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

/* ==========================
   FILTER
========================== */

function filterIklan(){

const keyword =
searchInput.value
.toLowerCase();

const kategori =
kategoriFilter.value
.toLowerCase();

const hasil =

semuaIklan.filter(item=>{

const cocokKeyword =

(item.judul || "")
.toLowerCase()
.includes(keyword)

||

(item.deskripsi || "")
.toLowerCase()
.includes(keyword)

||

(item.nama || "")
.toLowerCase()
.includes(keyword)

||

(item.kategori || "")
.toLowerCase()
.includes(keyword);

const cocokKategori =

kategori === ""

||

(item.kategori || "")
.toLowerCase()
=== kategori;

return (
cocokKeyword &&
cocokKategori
);

});

renderIklan(hasil);

}

/* ==========================
   EVENT
========================== */

searchInput.addEventListener(
"input",
filterIklan
);

kategoriFilter.addEventListener(
"change",
filterIklan
);

/* ==========================
   START
========================== */

loadIklan();
