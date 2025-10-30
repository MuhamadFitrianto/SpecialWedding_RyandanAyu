const cover = document.querySelector(".section-cover");
const music = document.getElementById('backgroundMusic');
const icon = document.getElementById('musicIcon');
let playing = true;

function openInvitation(){
  const start = document.querySelector(".section-content");
  const end = document.querySelector(".rsvp");

  // Unmute musik & play
  music.muted = false;
  music.play();

  // Lock cover
  cover.style.opacity = "0";
  cover.style.pointerEvents = "none";
  setTimeout(() => (cover.style.display = "none"), 800);
  // Aktifkan scroll Y
  document.body.style.overflowY = "auto";

  // Scroll ke awal section-content dulu
  setTimeout(() => {
    start.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);

  // Auto scroll perlahan menuju RSVP
  setTimeout(() => {
    autoScrollToRSVP(end);
  }, 1500); // delay biar halus masuk dulu section-content
}

// Smooth auto scroll function
function autoScrollToRSVP(targetSection){
  const speed = 0.5; // semakin besar semakin cepat

  const scrollInterval = setInterval(() => {
    window.scrollBy(0, speed);

    // stop ketika sudah mencapai section RSVP
    const targetTop = targetSection.getBoundingClientRect().top;
    if (targetTop <= 10) clearInterval(scrollInterval);
  }, 10);
}



function toggleMusic(){
  if(playing){
    music.pause();
    icon.className = "fas fa-volume-up";
  } else {
    music.muted = false;
    music.play();
    icon.className = "fas fa-volume-mute";
  }
  playing = !playing;
}

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const attendance = document.getElementById('attendance').value;
  
  let message = attendance === 'hadir'
    ? `Terima kasih, ${name}! Kami tunggu kehadiranmu 🤲`
    : `Terima kasih, ${name}. Semoga Allah limpahkan keberkahan untukmu juga 🤲`;

  document.getElementById('rsvpMessage').innerText = message;
  this.reset();
});

const backgrounds = document.querySelectorAll('.bg');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const totalHeight = document.body.scrollHeight - windowHeight;

  const progress = scrollY / totalHeight;

  // Tentukan background aktif berdasarkan posisi scroll
  if (progress < 0.33) {
    setActiveBg(0);
  } else if (progress < 0.66) {
    setActiveBg(1);
  } else {
    setActiveBg(2);
  }
});

function setActiveBg(index) {
  backgrounds.forEach((bg, i) => {
    bg.classList.toggle('active', i === index);
  });
}
function scrollToContent() {
      document.getElementById("content").scrollIntoView({ behavior: "smooth" });
    }

    const eventDate = new Date("Dec 6, 2025 00:00:00").getTime();
const countdown = setInterval(() => {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = `
    <div><span>${days}</span><small>Hari</small></div>
    <div><span>${hours}</span><small>Jam</small></div>
    <div><span>${minutes}</span><small>Menit</small></div>
    <div><span>${seconds}</span><small>Detik</small></div>
  `;

  if (distance < 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "<p>Acara telah dimulai!</p>";
  }
}, 1000);

function copyRekening() {
  const rekening = document.getElementById("rekening").textContent;
  navigator.clipboard.writeText(rekening).then(() => {
    const msg = document.getElementById("copyMessage");
    msg.textContent = "✅ Nomor rekening berhasil disalin!";
    setTimeout(() => (msg.textContent = ""), 3000);
  });
}

const form = document.getElementById("rsvpForm");
const list = document.getElementById("rsvpList");
const message = document.getElementById("rsvpMessage");
const scriptURL = "https://script.google.com/macros/s/AKfycbyd0dc3YRYOLANxDNavcpb8ZeXkK7GjH27Zqv0lmeOUdVLQZ5mt2BSyOOnRhOsumDgBNA/exec";

// === [1] Tambahan untuk load data ===
async function loadRSVP() {
  try {
    const res = await fetch(scriptURL);
    const data = await res.json();
    renderRSVP(data);
    localStorage.setItem("rsvpData", JSON.stringify(data));
  } catch (err) {
    const cached = JSON.parse(localStorage.getItem("rsvpData") || "[]");
    renderRSVP(cached);
  }
}

function renderRSVP(data) {
  list.innerHTML = "";
  data.reverse().forEach(({ name, pesan, attendance }) => {
    const item = document.createElement("div");
    item.classList.add("rsvp-item");
    const icon = attendance === "hadir" ? "💚" : "🤍";
    item.innerHTML = `
      <p><strong>${icon} ${name}</strong></p>
      <p>"${pesan}"</p>
      <p class="status">${attendance === "hadir" ? "Akan Hadir" : "Tidak Dapat Hadir"}</p>
    `;
    list.appendChild(item);
  });
}
window.addEventListener("DOMContentLoaded", loadRSVP);

// === [2] Script asli kirim form ===
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const pesan = document.getElementById("pesan").value.trim();
  const attendance = document.getElementById("attendance").value;

  if (!name || !pesan || !attendance) return;

  try {
    await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ name, pesan, attendance }),
      headers: { "Content-Type": "application/json" },
    });

    const item = document.createElement("div");
    item.classList.add("rsvp-item");
    const icon = attendance === "hadir" ? "💚" : "🤍";
    item.innerHTML = `
      <p><strong>${icon} ${name}</strong></p>
      <p>"${pesan}"</p>
      <p class="status">${attendance === "hadir" ? "Akan Hadir" : "Tidak Dapat Hadir"}</p>
    `;
    list.prepend(item);

    // Simpan juga di localStorage agar muncul offline
    const saved = JSON.parse(localStorage.getItem("rsvpData") || "[]");
    saved.unshift({ name, pesan, attendance });
    localStorage.setItem("rsvpData", JSON.stringify(saved));

    message.textContent = "✅ Terima kasih! Data Anda telah dikirim.";
    form.reset();
    setTimeout(() => (message.textContent = ""), 4000);
  } catch (err) {
    message.textContent = "❌ Gagal mengirim data. Coba lagi.";
  }
});
