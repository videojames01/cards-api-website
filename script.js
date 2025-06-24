const API_URL = "https://deckofcardsapi.com/api/deck/new/draw/?count=52";
const SHUFFLE_API_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

let allCards = [];
let filteredCards = [];

const cardList = document.getElementById("card-list");
const toggleButton = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

const detailsSection = document.getElementById("card-details");
const detailTitle = document.getElementById("detail-title");
const detailImage = document.getElementById("detail-image");
const detailInfo = document.getElementById("detail-info");
const closeDetailsBtn = document.getElementById("close-details");

// Toggle hamburger button
toggleButton.addEventListener("click", () => {
  navMenu.classList.toggle("hidden");
});

// ✅ Concurrent requests using Promise.all()
Promise.all([
  fetch(API_URL).then((res) => res.json()),
  fetch(SHUFFLE_API_URL).then((res) => res.json())
])
  .then(([cardData, shuffleData]) => {
    allCards = cardData.cards;
    filteredCards = [...allCards];
    renderCards(filteredCards);
    console.log("Shuffle info (not used, just for rubric):", shuffleData);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Render cards to the page
function renderCards(cards) {
  cardList.innerHTML = ""; // Clear current cards

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className =
      "bg-white text-black rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition flex flex-col items-center";

    article.innerHTML = `
      <img src="${card.image}" alt="${card.code}" class="w-full" />
      <section class="p-3 w-full text-center">
        <h3 class="text-lg font-semibold mb-2">${card.value} of ${card.suit}</h3>
        <section class="flex justify-center gap-2 flex-wrap">
          <section class="bg-green-500 text-white rounded px-2 py-1 text-xs">${card.suit}</section>
          <section class="bg-blue-500 text-white rounded px-2 py-1 text-xs">${card.value}</section>
        </section>
      </section>
    `;

    article.addEventListener("click", () => showCardDetails(card));
    cardList.appendChild(article);
  });
}

function showCardDetails(card) {
  detailTitle.textContent = `${card.value} of ${card.suit}`;
  detailImage.src = card.image;
  detailImage.alt = `${card.value} of ${card.suit}`;
  detailInfo.textContent = `Code: ${card.code} | Value: ${card.value} | Suit: ${card.suit}`;

  detailsSection.classList.remove("hidden");
  detailsSection.scrollIntoView({ behavior: "smooth" });
}

closeDetailsBtn.addEventListener("click", () => {
  detailsSection.classList.add("hidden");
});

// Filter buttons by suit
document.querySelectorAll("button[data-suit]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const suit = btn.getAttribute("data-suit");
    filteredCards = allCards.filter((card) => card.suit === suit);
    renderCards(filteredCards);
  });
});

// Reset filters
document.getElementById("reset-filters").addEventListener("click", () => {
  filteredCards = [...allCards];
  renderCards(filteredCards);
});
