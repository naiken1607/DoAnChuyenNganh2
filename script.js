document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     1. CARD TILT
  ====================== */

  const card = document.querySelector(".card");

  if (card) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const dx = x - centerX;
      const dy = y - centerY;

      const rotateX = (dy / centerY) * 8;
      const rotateY = (-dx / centerX) * 8;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  }

  /* =====================
     2. CURSOR TRAIL
  ====================== */

  const TRAIL_COUNT = 30;
  const trails = [];

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let lastX = mouseX;
  let lastY = mouseY;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.className = "cursor";
    document.body.appendChild(dot);

    trails.push({ el: dot, x: mouseX, y: mouseY });
  }

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const speed = Math.sqrt(dx * dx + dy * dy);

    lastX = mouseX;
    lastY = mouseY;

    let x = mouseX;
    let y = mouseY;

    trails.forEach((trail, index) => {
      trail.x += (x - trail.x) * 0.32;
      trail.y += (y - trail.y) * 0.32;

      trail.el.style.opacity = Math.max(0.15, 1 - index / TRAIL_COUNT);

      const blur = speed > 0.5 ? speed * 0.04 + index * 0.12 : 0;
      trail.el.style.filter = `blur(${blur}px)`;

      trail.el.style.transform =
        `translate(${trail.x - 7}px, ${trail.y - 7}px)`;

      x = trail.x;
      y = trail.y;
    });

    requestAnimationFrame(animate);
  }

  animate();

  /* =====================
     3. PROFILE + SOCIALS + BACK
  ====================== */

  const avatar = document.querySelector(".avatar");
  const name = document.querySelector(".info h1");
  const quote = document.querySelector(".quote");
  const badges = document.querySelector(".badges");
  const location = document.querySelector(".location");
  const backBtn = document.querySelector(".back-btn");

  const socials = {
    roblox: document.querySelector(".roblox"),
    facebook: document.querySelector(".facebook"),
    discord: document.querySelector(".discord"),
    youtube: document.querySelector(".youtube")
  };

  /* ===== HÀM SET LINK (DISABLE NẾU THIẾU) ===== */
  function setSocial(anchor, url) {
    if (url && url.trim() !== "") {
      anchor.href = url;
      anchor.style.pointerEvents = "auto";
      anchor.style.opacity = "1";
      anchor.target = "_blank";
    } else {
      anchor.href = "javascript:void(0)";
      anchor.style.pointerEvents = "none";
      anchor.style.opacity = "0.35";
      anchor.removeAttribute("target");
    }
  }

  /* ===== LƯU PROFILE GỐC ===== */
  const defaultProfile = {
    avatar: avatar.src,
    name: name.textContent,
    quote: quote.textContent,
    badges: badges.innerHTML,
    location: location.textContent,
    socials: {
      roblox: socials.roblox.href,
      facebook: socials.facebook.href,
      discord: socials.discord.href,
      youtube: socials.youtube.href
    }
  };

  backBtn.style.display = "none";

  /* ===== CLICK MINI CARD ===== */
  document.querySelectorAll(".mini-card").forEach(mini => {
    mini.addEventListener("click", () => {

      // hiệu ứng lún
      card.style.transform = "scale(0.97)";
      setTimeout(() => card.style.transform = "scale(1)", 120);

      avatar.src = mini.dataset.avatar;
      name.textContent = mini.dataset.name;
      quote.textContent = mini.dataset.quote;

      badges.innerHTML = `
        <span>${mini.dataset.role}</span>
        <span>${mini.dataset.birthday}</span>
        <span>${mini.dataset.pronoun}</span>
      `;

      location.textContent = "📍 " + mini.dataset.location;

      // ⭐ DISABLE / ENABLE LINK
      setSocial(socials.roblox, mini.dataset.roblox);
      setSocial(socials.facebook, mini.dataset.facebook);
      setSocial(socials.discord, mini.dataset.discord);
      setSocial(socials.youtube, mini.dataset.youtube);

      backBtn.style.display = "inline-block";
    });
  });

  /* ===== CLICK BACK ===== */
  backBtn.addEventListener("click", () => {
    avatar.src = defaultProfile.avatar;
    name.textContent = defaultProfile.name;
    quote.textContent = defaultProfile.quote;
    badges.innerHTML = defaultProfile.badges;
    location.textContent = defaultProfile.location;

    setSocial(socials.roblox, defaultProfile.socials.roblox);
    setSocial(socials.facebook, defaultProfile.socials.facebook);
    setSocial(socials.discord, defaultProfile.socials.discord);
    setSocial(socials.youtube, defaultProfile.socials.youtube);

    backBtn.style.display = "none";
  });

});
