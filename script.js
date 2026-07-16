(() => {
  "use strict";

  const input = document.getElementById("customerSearch");
  const customerList = document.getElementById("customerList");
  const emptyMessage = document.getElementById("emptyMessage");
  const suggestionsBox = document.getElementById("searchSuggestions");

  if (!input || !Array.isArray(window.customers || (typeof customers !== "undefined" ? customers : null))) {
    return;
  }

  const customerData = window.customers || customers;
  let currentSuggestions = [];
  let activeSuggestionIndex = -1;

  function normalizeText(value = "") {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function escapeHtml(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function albumUrl(customerId) {
    return `album.html?id=${encodeURIComponent(customerId)}`;
  }

  function goToAlbum(customerId) {
    window.location.href = albumUrl(customerId);
  }

  function getSearchScore(customer, query) {
    const normalizedQuery = normalizeText(query);
    const id = normalizeText(customer.id);
    const name = normalizeText(customer.name);
    const songs = Array.isArray(customer.songs) ? customer.songs : [];
    const normalizedSongs = songs.map(song => normalizeText(song.title));

    if (!normalizedQuery) return null;

    if (id === normalizedQuery) return { score: 1000, type: "Mã khách", matchedSong: null };
    if (name === normalizedQuery) return { score: 950, type: "Khách hàng", matchedSong: null };

    const exactSongIndex = normalizedSongs.findIndex(title => title === normalizedQuery);
    if (exactSongIndex !== -1) {
      return { score: 900, type: "Bài hát", matchedSong: songs[exactSongIndex] };
    }

    if (id.startsWith(normalizedQuery)) return { score: 800, type: "Mã khách", matchedSong: null };
    if (name.startsWith(normalizedQuery)) return { score: 760, type: "Khách hàng", matchedSong: null };

    const songStartsIndex = normalizedSongs.findIndex(title => title.startsWith(normalizedQuery));
    if (songStartsIndex !== -1) {
      return { score: 720, type: "Bài hát", matchedSong: songs[songStartsIndex] };
    }

    if (id.includes(normalizedQuery)) return { score: 650, type: "Mã khách", matchedSong: null };
    if (name.includes(normalizedQuery)) return { score: 620, type: "Khách hàng", matchedSong: null };

    const songIncludesIndex = normalizedSongs.findIndex(title => title.includes(normalizedQuery));
    if (songIncludesIndex !== -1) {
      return { score: 580, type: "Bài hát", matchedSong: songs[songIncludesIndex] };
    }

    return null;
  }

  function findMatches(query) {
    return customerData
      .map(customer => {
        const match = getSearchScore(customer, query);
        return match ? { customer, ...match } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.customer.name.localeCompare(b.customer.name, "vi"));
  }

  function renderSuggestions(matches) {
    currentSuggestions = matches.slice(0, 6);
    activeSuggestionIndex = -1;

    if (!currentSuggestions.length) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.add("hidden");
      input.setAttribute("aria-expanded", "false");
      return;
    }

    suggestionsBox.innerHTML = currentSuggestions.map((item, index) => {
      const songTitle = item.matchedSong ? item.matchedSong.title : "";
      const title = songTitle || item.customer.name;
      const subtitle = songTitle
        ? `${item.customer.name} · Mã: ${item.customer.id}`
        : `Mã khách: ${item.customer.id}`;

      return `
        <button class="search-suggestion" type="button" role="option" data-index="${index}">
          <span class="suggestion-main">
            <span class="suggestion-title">${escapeHtml(title)}</span>
            <span class="suggestion-subtitle">${escapeHtml(subtitle)}</span>
          </span>
          <span class="suggestion-type">${escapeHtml(item.type)}</span>
        </button>
      `;
    }).join("");

    suggestionsBox.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
  }

  function renderCustomerCards(matches) {
    if (!customerList) return;

    customerList.innerHTML = matches.slice(0, 9).map(item => {
      const customer = item.customer;
      const songs = Array.isArray(customer.songs) ? customer.songs : [];
      const matchedTitle = item.matchedSong ? item.matchedSong.title : "";

      return `
        <article class="customer-card customer-card-clickable" data-customer-id="${escapeHtml(customer.id)}" tabindex="0" role="link">
          <div class="customer-code">MÃ KHÁCH: ${escapeHtml(customer.id.toUpperCase())}</div>
          ${matchedTitle ? `
            <div class="matched-songs">
              <span class="matched-label">Bài hát phù hợp</span>
              <h3 class="matched-song-title">${escapeHtml(matchedTitle)}</h3>
            </div>
          ` : ""}
          <h3 class="customer-name">${escapeHtml(customer.name)}</h3>
          <p class="customer-song-total">${songs.length} bài hát trong album</p>
          <div class="customer-card-footer">
            <span class="customer-open-text">MỞ ALBUM</span>
            <span class="customer-card-arrow">›</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function updateSearch() {
    const query = input.value.trim();

    if (!query) {
      renderSuggestions([]);
      if (customerList) customerList.innerHTML = "";
      if (emptyMessage) emptyMessage.classList.add("hidden");
      return;
    }

    const matches = findMatches(query);
    renderSuggestions(matches);
    renderCustomerCards(matches);

    if (emptyMessage) {
      emptyMessage.classList.toggle("hidden", matches.length > 0);
    }
  }

  function setActiveSuggestion(index) {
    const buttons = suggestionsBox.querySelectorAll(".search-suggestion");
    buttons.forEach(button => button.classList.remove("is-active"));

    if (!buttons.length) {
      activeSuggestionIndex = -1;
      return;
    }

    activeSuggestionIndex = (index + buttons.length) % buttons.length;
    buttons[activeSuggestionIndex].classList.add("is-active");
    buttons[activeSuggestionIndex].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", updateSearch);

  input.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" && currentSuggestions.length) {
      event.preventDefault();
      setActiveSuggestion(activeSuggestionIndex + 1);
      return;
    }

    if (event.key === "ArrowUp" && currentSuggestions.length) {
      event.preventDefault();
      setActiveSuggestion(activeSuggestionIndex - 1);
      return;
    }

    if (event.key === "Escape") {
      renderSuggestions([]);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      const matches = findMatches(query);
      if (!matches.length) {
        renderSuggestions([]);
        if (customerList) customerList.innerHTML = "";
        if (emptyMessage) emptyMessage.classList.remove("hidden");
        return;
      }

      const selected = activeSuggestionIndex >= 0
        ? currentSuggestions[activeSuggestionIndex]
        : matches[0];

      goToAlbum(selected.customer.id);
    }
  });

  suggestionsBox.addEventListener("click", event => {
    const button = event.target.closest(".search-suggestion");
    if (!button) return;

    const index = Number(button.dataset.index);
    const selected = currentSuggestions[index];
    if (selected) goToAlbum(selected.customer.id);
  });

  if (customerList) {
    customerList.addEventListener("click", event => {
      const card = event.target.closest(".customer-card-clickable");
      if (card) goToAlbum(card.dataset.customerId);
    });

    customerList.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".customer-card-clickable");
      if (!card) return;
      event.preventDefault();
      goToAlbum(card.dataset.customerId);
    });
  }

  document.addEventListener("click", event => {
    if (!event.target.closest(".search-area")) {
      suggestionsBox.classList.add("hidden");
      input.setAttribute("aria-expanded", "false");
    }
  });
})();
