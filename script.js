const customerList = document.getElementById("customerList");
const customerSearch = document.getElementById("customerSearch");
const emptyMessage = document.getElementById("emptyMessage");

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderCustomers(keyword = "") {
  const searchText = normalizeText(keyword.trim());

  customerList.innerHTML = "";

  if (!searchText) {
    emptyMessage.classList.add("hidden");
    return;
  }

  const filteredCustomers = customers.filter((customer) => {
    const songTitles = customer.songs
      .map((song) => song.title)
      .join(" ");

    const fullText = normalizeText(
      `${customer.id} ${customer.name} ${songTitles}`
    );

    return fullText.includes(searchText);
  });

  filteredCustomers.forEach((customer) => {
    const matchedSongs = customer.songs.filter((song) =>
      normalizeText(song.title).includes(searchText)
    );

    const matchedSongHtml =
      matchedSongs.length > 0
        ? `
          <div class="matched-songs">
            <strong>Bài hát tìm thấy:</strong>
            ${matchedSongs
              .map((song) => `<p>🎵 ${song.title}</p>`)
              .join("")}
          </div>
        `
        : "";

    const card = document.createElement("article");
    card.className = "customer-card";

    card.innerHTML = `
      <div class="customer-code">
        Mã tra cứu: ${customer.id}
      </div>

      <h3>${customer.name}</h3>

      <p>🎵 ${customer.songs.length} bài hát</p>

      ${matchedSongHtml}

      <a href="customer.html?id=${encodeURIComponent(customer.id)}">
        📂 NHẬN FILE →
      </a>
    `;

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
