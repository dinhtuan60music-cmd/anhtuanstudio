const customerList = document.getElementById("customerList");
const customerSearch = document.getElementById("customerSearch");
const emptyMessage = document.getElementById("emptyMessage");

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openCustomer(customerId) {
  window.location.href =
    `customer.html?id=${encodeURIComponent(customerId)}`;
}

function renderCustomers(keyword = "") {
  const searchText = normalizeText(keyword.trim());

  customerList.innerHTML = "";

  if (!searchText) {
    emptyMessage.classList.add("hidden");
    return;
  }

  const filteredCustomers = customers.filter((customer) => {
    const songs = Array.isArray(customer.songs)
      ? customer.songs
      : [];

    const songTitles = songs
      .map((song) => song.title)
      .join(" ");

    const fullText = normalizeText(
      `${customer.id} ${customer.name} ${songTitles}`
    );

    return fullText.includes(searchText);
  });

  filteredCustomers.forEach((customer) => {
    const songs = Array.isArray(customer.songs)
      ? customer.songs
      : [];

    const matchedSongs = songs.filter((song) =>
      normalizeText(song.title).includes(searchText)
    );

    const matchedSongHtml =
      matchedSongs.length > 0
        ? `
          <div class="matched-songs">
            <span class="matched-label">Bài hát tìm thấy</span>

            ${matchedSongs
              .map(
                (song) => `
                  <h3 class="matched-song-title">
                    🎵 ${escapeHtml(song.title)}
                  </h3>
                `
              )
              .join("")}
          </div>
        `
        : "";

    const card = document.createElement("article");
    card.className = "customer-card customer-card-clickable";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute(
      "aria-label",
      `Mở trang nhận file của ${customer.name}`
    );

    card.innerHTML = `
      ${matchedSongHtml}

      <div class="customer-code">
        Mã tra cứu: ${escapeHtml(customer.id)}
      </div>

      <h3 class="customer-name">
        ${escapeHtml(customer.name)}
      </h3>

      <p class="customer-song-total">
        🎵 ${songs.length} bài hát
      </p>

      <div class="customer-card-footer">
        <span class="customer-open-text">
          NHẬN FILE
        </span>

        <span class="customer-card-arrow" aria-hidden="true">
          →
        </span>
      </div>
    `;

    card.addEventListener("click", function () {
      openCustomer(customer.id);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCustomer(customer.id);
      }
    });

    customerList.appendChild(card);
  });

  emptyMessage.classList.toggle(
    "hidden",
    filteredCustomers.length > 0
  );
}

customerSearch.addEventListener("input", function () {
  renderCustomers(this.value);
});

renderCustomers();
