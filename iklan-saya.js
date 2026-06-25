const API_URL =
"https://script.google.com/macros/s/AKfycbzwXBjQbOoHjb5btAFrja7llCgXT1KahBrI2-OyrfERGYy2XXkeXJxNNhdKyupqI6TK7w/exec";

const btn =
document.getElementById(
"checkBtn"
);

const resultBox =
document.getElementById(
"resultBox"
);

btn.addEventListener(
"click",
async ()=>{

const adId =
document
.getElementById(
"adId"
)
.value
.trim();

const secretCode =
document
.getElementById(
"secretCode"
)
.value
.trim();

if(
!adId ||
!secretCode
){

resultBox.innerHTML =

`
<div style="
padding:15px;
background:#fff3cd;
border:1px solid #ffc107;
">
Masukkan ID Iklan dan Kode Kelola.
</div>
`;

return;

}

resultBox.innerHTML =
"Memeriksa...";

try{

const res =
await fetch(

API_URL +
"?action=getAd" +
"&id=" +
encodeURIComponent(adId) +
"&secret_code=" +
encodeURIComponent(secretCode)

);

const data =
await res.json();

if(!data.success){

resultBox.innerHTML =

`
<div style="
padding:15px;
background:#f8d7da;
border:1px solid #dc3545;
">
${data.error}
</div>
`;

return;

}

const ad =
data.ad;

resultBox.innerHTML =

`
<div style="
padding:20px;
border:1px solid #ddd;
border-radius:8px;
">

<img
src="${ad.image}"
style="
width:100%;
max-width:300px;
display:block;
margin-bottom:15px;
border-radius:8px;
">

<h3>
${ad.title}
</h3>

<p>
${ad.description}
</p>

<p>
<b>Kategori:</b>
${ad.category}
</p>

<p>
<b>Lokasi:</b>
${ad.location}
</p>

<button
id="editBtn"
class="submit-btn"
>
EDIT IKLAN
</button>

<button
id="deleteBtn"
class="submit-btn"
style="
margin-top:10px;
background:#dc3545;
"
>
HAPUS IKLAN
</button>

</div>
`;

const deleteBtn =
document.getElementById(
"deleteBtn"
);

deleteBtn.addEventListener(
"click",
async ()=>{

const ok =
confirm(
"Yakin ingin menghapus iklan ini?"
);

if(!ok)
return;

try{

const res =
await fetch(

API_URL +
"?action=deleteAd" +
"&id=" +
encodeURIComponent(ad.id) +
"&secret_code=" +
encodeURIComponent(secretCode)

);

const data =
await res.json();

if(!data.success){

alert(
data.error ||
"Gagal menghapus iklan"
);

return;

}

resultBox.innerHTML =

`
<div style="
padding:20px;
background:#d4edda;
border:1px solid #28a745;
border-radius:8px;
">

✅ Iklan berhasil dihapus

</div>
`;

}
catch(err){

alert(
"Gagal terhubung ke server"
);

}

}
);
