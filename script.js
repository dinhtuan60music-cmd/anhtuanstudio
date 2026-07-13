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
  const normalizedKeyword = normalizeText(keyword.trim());

  const filteredCustomers = customers.filter((customer) => {
    const songTitles = customer.songs
      .map((song) => song.title)
      .join(" ");

    const searchableText = normalizeText(
      `${customer.id} ${customer.name} ${customer.note} ${songTitles}`
    );

    return searchableText.includes(normalizedKeyword);
  });

  customerList.innerHTML = "";

  filteredCustomers.forEach((customer) => {
    const card = document.createElement("article");
    card.className = "customer-card";

    card.innerHTML = `
      <div class="customer-code">${customer.id}</div>

      <h3>${customer.name}</h3>

      <p>🎵 ${customer.songs.length} bài hát</p>

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
