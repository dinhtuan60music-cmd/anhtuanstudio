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
    const songTitles = Array.isArray(customer.songs)
      ? customer.songs.map((song) => song.title).join(" ")
      : "";

    const fullText = normalizeText(
      `${customer.id} ${customer.name} ${songTitles}`
    );

    return fullText.includes(searchText);
  });

  filteredCustomers.forEach((customer) => {
    const card = document.createElement("article");
    card.className = "customer-card";

    card.innerHTML = `
      <div class="customer-code">
        Mã tra cứu: ${customer.id}
      </div>

      <h3>${customer.name}</h3>

      <p>🎵 ${customer.songs.length} bài hát</p>

      <a href="customer.html?id=${encodeURIComponent(customer.id)}">
        📂 NHẬN FILE →
      </a>
    `;

    customerList.appendChild(card);
  });

  if (filteredCustomers.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }
}

customerSearch.addEventListener("input", function () {
  renderCustomers(this.value);
});

renderCustomers();
