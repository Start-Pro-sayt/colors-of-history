// app.js - основная логика интерактивности

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;

  if (currentPage.includes("index.html") || currentPage.endsWith("/")) {
    initStylesGallery();
  } else if (currentPage.includes("artists.html")) {
    initArtistsPage();
  } else if (currentPage.includes("masterpieces.html")) {
    initMasterpiecesPage();
  }
});

// === ГЛАВНАЯ СТРАНИЦА: СТИЛИ И ГА­ЛЕ­РЕ­Я ===
function initStylesGallery() {
  const grid = document.getElementById("stylesGrid");
  const modal = document.getElementById("galleryModal");
  const galleryContainer = document.getElementById("galleryContainer");
  const closeBtn = modal.querySelector(".lightbox-close");

  //填充стили
  styles.forEach(style => {
    const card = document.createElement("div");
    card.className = "card card-clickable reveal";
    card.innerHTML = `
      <div class="card-label">${style.era}</div>
      <h3 class="card-title">${style.name}</h3>
      <p class="card-text">${style.description}</p>
      <div class="card-line"></div>
      <div style="font-size: 0.8rem; color: var(--muted); margin-top: 0.7rem;">
        ${style.paintings.length} картин
      </div>
    `;

    card.addEventListener("click", () => {
      showGallery(style);
    });

    grid.appendChild(card);
  });

  function showGallery(style) {
    let html = `
      <div style="width: 100%;">
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text);">${style.name}</h2>
        <p style="font-size: 0.85rem; color: var(--muted); margin-bottom: 1.2rem;">${style.era}</p>
        <div class="gallery-grid">
    `;

    style.paintings.forEach(painting => {
      html += `
        <div class="gallery-item" style="cursor: pointer;" data-img="${painting.image}">
          <div class="gallery-thumb" style="background-image: url('${painting.image}');"></div>
          <div class="gallery-overlay"></div>
          <div class="gallery-content">
            <div class="gallery-title">${painting.title}</div>
            <div class="gallery-artist">${painting.artist}</div>
            <div class="gallery-meta">${painting.year}</div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    galleryContainer.innerHTML = html;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Клик по картинам в галерее
    galleryContainer.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        const img = item.dataset.img;
        const painting = style.paintings.find(p => p.image === img);
        showPaintingDetail(painting);
      });
    });
  }

  function showPaintingDetail(painting) {
    let html = `
      <div style="width: 100%; text-align: center;">
        <img src="${painting.image}" alt="${painting.title}" style="max-width: 100%; max-height: 60vh; border-radius: 0.8rem; margin-bottom: 1rem;" />
        <h2 style="font-size: 1.2rem; margin-bottom: 0.25rem;">${painting.title}</h2>
        <p style="font-size: 0.9rem; color: var(--accent-soft);">${painting.artist}</p>
        <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.75rem;">${painting.year}</p>
        <p style="font-size: 0.9rem; color: #e8e8e8; text-align: left; max-height: 200px; overflow-y: auto;">
          ${painting.description}
        </p>
      </div>
    `;
    galleryContainer.innerHTML = html;
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
}

// === СТРАНИЦА ХУДОЖНИКОВ ===
function initArtistsPage() {
  const container = document.getElementById("artistsContainer");
  const modal = document.getElementById("artistModal");
  const detail = document.getElementById("artistDetail");
  const closeBtn = modal.querySelector(".lightbox-close");

  // Группировка по стилям
  const styleMap = {};
  styles.forEach(style => {
    styleMap[style.id] = style.name;
  });

  const artistsByStyle = {};
  artists.forEach(artist => {
    if (!artistsByStyle[artist.style]) {
      artistsByStyle[artist.style] = [];
    }
    artistsByStyle[artist.style].push(artist);
  });

  // Рендер секций
  Object.keys(artistsByStyle).forEach(styleId => {
    const styleName = styleMap[styleId];
    const sectionArtists = artistsByStyle[styleId];

    const section = document.createElement("section");
    section.innerHTML = `
      <header class="section-header reveal">
        <h2 class="section-title">${styleName}</h2>
      </header>
      <div class="grid grid-3"></div>
    `;

    const grid = section.querySelector(".grid");
    sectionArtists.forEach(artist => {
      const card = document.createElement("div");
      card.className = "card card-clickable artist-card reveal";
      card.innerHTML = `
        <img src="${artist.photo}" alt="${artist.name}" class="artist-photo" loading="lazy" />
        <div class="card-label">${artist.birth}-${artist.death}</div>
        <h3 class="card-title">${artist.name}</h3>
        <p class="card-meta">${artist.birthPlace}</p>
        <p class="card-text">${artist.shortBio}</p>
      `;

      card.addEventListener("click", () => showArtistDetail(artist));
      grid.appendChild(card);
    });

    container.appendChild(section);
  });

  function showArtistDetail(artist) {
    let html = `
      <div style="background: radial-gradient(circle at top left, #34395d 0, #101325 50%, #05060c 100%); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(255,239,210,0.16);">
        <div style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem;">
          <div>
            <img src="${artist.photo}" alt="${artist.name}" style="width: 100%; border-radius: 0.8rem; margin-bottom: 1rem;" />
            <p style="font-size: 0.8rem; color: var(--muted);">
              <strong>${artist.birth}-${artist.death}</strong><br>
              ${artist.birthPlace}
            </p>
          </div>
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${artist.name}</h2>
            <p style="color: var(--accent-soft); margin-bottom: 1rem;">${artist.shortBio}</p>
            <p style="font-size: 0.9rem; color: #e8e8e8; line-height: 1.6; margin-bottom: 1.5rem;">
              ${artist.fullBio}
            </p>
          </div>
        </div>

        ${artist.paintings ? `
          <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
            <h3 style="font-size: 1.1rem; margin-bottom: 1rem;">Основные работы</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
              ${artist.paintings.map(painting => `
                <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.8rem; border: 1px solid rgba(255,255,255,0.05);">
                  <img src="${painting.image}" alt="${painting.title}" style="width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 0.6rem; margin-bottom: 0.75rem;" />
                  <p style="font-size: 0.85rem; color: var(--accent-soft);">${painting.period}</p>
                  <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${painting.title}</h4>
                  <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.5rem;">${painting.year}</p>
                  <p style="font-size: 0.85rem; color: #d8d8d8;">${painting.description}</p>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;

    detail.innerHTML = html;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
}

// === СТРАНИЦА ШЕДЕВРОВ ===
function initMasterpiecesPage() {
  const container = document.getElementById("masterpieces");
  const modal = document.getElementById("masterpieceLightbox");
  const closeBtn = modal.querySelector(".lightbox-close");
  const img = document.getElementById("masterpieceImage");
  const title = document.getElementById("masterpieceTitle");
  const artist = document.getElementById("masterpieceArtist");
  const meta = document.getElementById("masterpiece Meta");
  const museum = document.getElementById("masterpieceMuseum");
  const story = document.getElementById("masterpieceStory");

  masterpieces.forEach(painting => {
    const card = document.createElement("div");
    card.className = "card card-clickable reveal";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div style="aspect-ratio: 4/3; border-radius: 0.6rem; overflow: hidden; margin-bottom: 0.75rem; background-image: linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${painting.image}'); background-size: cover; background-position: center;"></div>
      <h3 class="card-title">${painting.title}</h3>
      <p class="card-meta">${painting.artist} · ${painting.year}</p>
      <p class="card-text">${painting.museum}</p>
    `;

    card.addEventListener("click", () => showMasterpieceDetail(painting));
    container.appendChild(card);
  });

  function showMasterpieceDetail(painting) {
    img.src = painting.image;
    img.alt = painting.title;
    title.textContent = painting.title;
    artist.textContent = painting.artist;
    meta.textContent = `${painting.year} · ${painting.size}`;
    museum.textContent = `📍 ${painting.museum}`;
    story.innerHTML = `
      <strong>История:</strong><br>
      ${painting.story}<br><br>
      <strong>Техника:</strong><br>
      ${painting.technique}
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
}
