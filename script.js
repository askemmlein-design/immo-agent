const realProperties = [
  {
    id: "163844521",
    title: "Hobbyraum mit Wohnqualität",
    location: "80807 München-Milbertshofen",
    rooms: 1,
    area: 27.3,
    price: 199000,
    image: "https://pictures.immobilienscout24.de/listings/c6518e58-3aff-4966-856a-2782ab03c2e4-1963769375.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/163844521",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "165388352",
    title: "1-Zimmer-Apartment in Milbertshofen",
    location: "80807 München-Milbertshofen",
    rooms: 1,
    area: 17.85,
    price: 195000,
    image: "https://pictures.immobilienscout24.de/listings/61275c96-9b5b-491c-84d6-9f52cc8a1935-1994510424.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/165388352",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "166052791",
    title: "STUDIO M - Vermietetes Studentenapartment",
    location: "80687 München-Laim",
    rooms: 1,
    area: 21.44,
    price: 200000,
    image: "https://pictures.immobilienscout24.de/listings/fb03f650-5cf2-4914-9f10-1e3b89796f6e-2013847313.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/166052791",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "164751970",
    title: "Hotelapartment als Investment",
    location: "81379 München-Obersendling",
    rooms: 1,
    area: 23.06,
    price: 102000,
    image: "https://pictures.immobilienscout24.de/listings/0e9cad96-c55b-4d0f-8700-2d4999af463c-1977763494.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/164751970",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "167214786",
    title: "4,1% Rendite: Investment im Perlachstift",
    location: "81737 München-Perlach",
    rooms: 1,
    area: 24.77,
    price: 159000,
    image: "https://pictures.immobilienscout24.de/listings/9676b930-f61e-48bc-ab66-353bc2fbdcf9-2018520519.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/167214786",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "165591937",
    title: "Vollausgebauter Speicher / Hobbyraum",
    location: "81543 München-Untergiesing",
    rooms: 1,
    area: 25,
    price: 120000,
    image: "https://pictures.immobilienscout24.de/listings/85a85b2d-8648-4958-afa4-d0a6ad74642e-2036849506.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/165591937",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  },
  {
    id: "166102272",
    title: "Modernes Studentenapartment",
    location: "81241 München-Pasing",
    rooms: 1,
    area: 16.64,
    price: 189900,
    image: "https://pictures.immobilienscout24.de/listings/55f53dbb-2afc-4d9a-b9d9-3f61cf0bd0ce-2030652103.jpg/ORIG/legacy_thumbnail/800x600/format/jpg",
    link: "https://www.immobilienscout24.de/expose/166102272",
    seller: "ImmoScout24",
    phone: "siehe Exposé",
    email: "siehe Exposé"
  }
];

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites(favorites);
  searchProperties();
}

function calculateScore(property) {
  const pricePerSqm = Math.round(property.price / property.area);
  let score = 50;

  if (pricePerSqm < 5000) score += 30;
  else if (pricePerSqm < 7500) score += 20;
  else if (pricePerSqm < 10000) score += 10;
  else score += 3;

  if (property.price <= 150000) score += 15;
  else if (property.price <= 200000) score += 10;

  if (property.area >= 25) score += 10;
  else score += 3;

  return Math.min(score, 100);
}

async function searchProperties() {
  const results = document.getElementById("results");
  const favorites = getFavorites();

  const interest1 = Number(document.getElementById("interest1").value) / 100;
  const repayment1 = Number(document.getElementById("repayment1").value) / 100;
  const interest2 = Number(document.getElementById("interest2").value) / 100;
  const repayment2 = Number(document.getElementById("repayment2").value) / 100;
  const equity = Number(document.getElementById("equity").value || 0);

  const response = await fetch("/api/search");

const apiProperties = await response.json();

const properties = apiProperties.map(property => {
    const score = calculateScore(property);
    const pricePerSqm = Math.round(property.price / property.area);
    const marketPricePerSqm = 9000;
    const marketDiff = Math.round(((pricePerSqm - marketPricePerSqm) / marketPricePerSqm) * 100);

    let color = "yellow";
    let status = "🟡 Prüfen";
    let dealScore = "🟡 Marktgerecht";
    let purchaseSignal = "🟡 Prüfen";
    let recommendation = "Interessant, aber Unterlagen, Nutzung und Zustand genauer prüfen.";

    if (score >= 90) {
      color = "green";
      status = "⭐ Sofort ansehen";
      dealScore = "🟢 Sehr attraktiv";
      purchaseSignal = "⭐ Sofort ansehen";
      recommendation = "Sehr interessanter Treffer. Exposé öffnen und Unterlagen prüfen.";
    } else if (score >= 80) {
      color = "green";
      status = "🟢 Interessant";
      dealScore = "🟢 Attraktiv";
      purchaseSignal = "🟢 Besichtigung empfohlen";
      recommendation = "Objekt wirkt interessant. Exposé und Nutzung genau prüfen.";
    } else if (score < 60) {
      color = "red";
      status = "🔴 Eher nicht";
      dealScore = "🔴 Kritisch";
      purchaseSignal = "🔴 Eher nicht";
      recommendation = "Nur bei besonderem Interesse weiter prüfen.";
    }

    let marketText = "kein Vorteil erkennbar";
    if (marketDiff < 0) marketText = `🟢 ${Math.abs(marketDiff)}% unter Marktpreis`;
    if (marketDiff > 0) marketText = `🔴 ${marketDiff}% über Marktpreis`;

    const tax = Math.round(property.price * 0.035);
    const notary = Math.round(property.price * 0.02);
    const landRegister = Math.round(property.price * 0.005);
    const broker = Math.round(property.price * 0.0357);
    const totalCosts = property.price + tax + notary + landRegister + broker;
    const loanAmount = Math.max(totalCosts - equity, 0);

    const monthlyRate1 = Math.round((loanAmount * (interest1 + repayment1)) / 12);
    const monthlyRate2 = Math.round((loanAmount * (interest2 + repayment2)) / 12);

    return {
      ...property,
      score,
      color,
      status,
      dealScore,
      purchaseSignal,
      recommendation,
      pricePerSqm,
      marketText,
      tax,
      notary,
      landRegister,
      broker,
      totalCosts,
      loanAmount,
      equity,
      monthlyRate1,
      monthlyRate2,
      monthlyDifference: monthlyRate2 - monthlyRate1
    };
  });

  properties.sort((a, b) => b.score - a.score);

  const starCount = properties.filter(p => p.score >= 90).length;
  const greenCount = properties.filter(p => p.score >= 80 && p.score < 90).length;
  const yellowCount = properties.filter(p => p.score >= 60 && p.score < 80).length;
  const redCount = properties.filter(p => p.score < 60).length;
  const now = new Date().toLocaleString("de-DE");

  let html = `
    <h2>Gefundene Immobilien</h2>

    <details open>
      <summary>Suchstatistik</summary>
      <br>
      <strong>Suchlauf:</strong> ${now}<br><br>
      <strong>${properties.length} echte Treffer</strong><br><br>
      ⭐ ${starCount} | 🟢 ${greenCount} | 🟡 ${yellowCount} | 🔴 ${redCount}<br><br>
      <strong>Gespeicherte Favoriten:</strong> ${favorites.length}
    </details>
  `;

  properties.forEach((property, index) => {
    const isFavorite = favorites.includes(property.id);
    const topDeal = property.score >= 95
      ? "<span style='color:#16a34a;font-weight:bold'>🟢 TOP DEAL</span>"
      : "";

    html += `
      <div class="result ${property.color}">
        <img src="${property.image}" alt="${property.title}" style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:15px;">

        <h3>🏆 Platz ${index + 1}</h3>
        <h3>${property.title}</h3>

        <p><strong>📍 Standort:</strong> ${property.location}</p>
        <p><strong>${property.score}/100 Punkte</strong> ${property.status}</p>
        <p>${topDeal}</p>

        <button class="favorite-btn" onclick="toggleFavorite('${property.id}')">
          ${isFavorite ? "⭐ Favorit gespeichert" : "☆ Zu Favoriten hinzufügen"}
        </button>

        <hr>

        <p><strong>Preis:</strong> ${property.price.toLocaleString()} €</p>
        <p><strong>Wohnfläche:</strong> ${property.area} m²</p>
        <p><strong>Zimmer:</strong> ${property.rooms}</p>
        <p><strong>Preis/m²:</strong> ${property.pricePerSqm.toLocaleString()} €/m²</p>
        <p><strong>Marktvergleich:</strong> ${property.marketText}</p>

        <hr>

        <p><strong>Deal-Score:</strong> ${property.dealScore}</p>
        <p><strong>Kaufsignal:</strong> ${property.purchaseSignal}</p>
        <p><strong>Kaufempfehlung:</strong> ${property.recommendation}</p>

        <details>
          <summary>Kaufnebenkosten</summary>
          <br>
          Kaufpreis: ${property.price.toLocaleString()} €<br>
          Grunderwerbsteuer: ${property.tax.toLocaleString()} €<br>
          Notar: ${property.notary.toLocaleString()} €<br>
          Grundbuch: ${property.landRegister.toLocaleString()} €<br>
          Makler geschätzt: ${property.broker.toLocaleString()} €<br><br>
          Gesamtkosten: <strong>${property.totalCosts.toLocaleString()} €</strong><br>
          Eigenkapital: ${property.equity.toLocaleString()} €<br>
          Finanzierungsbetrag: <strong>${property.loanAmount.toLocaleString()} €</strong>
        </details>

        <details>
          <summary>Finanzierung</summary>
          <br>
          Beispiel 1: ${document.getElementById("interest1").value}% Zins + ${document.getElementById("repayment1").value}% Tilgung<br>
          Monatsrate: ca. <strong>${property.monthlyRate1.toLocaleString()} €</strong><br><br>
          Beispiel 2: ${document.getElementById("interest2").value}% Zins + ${document.getElementById("repayment2").value}% Tilgung<br>
          Monatsrate: ca. <strong>${property.monthlyRate2.toLocaleString()} €</strong><br><br>
          Differenz: <strong>+${property.monthlyDifference.toLocaleString()} € / Monat</strong>
        </details>

        <details>
          <summary>Anbieter & Kontakt</summary>
          <br>
          Anbieter: ${property.seller}<br>
          Telefon: ${property.phone}<br>
          E-Mail: ${property.email}<br>
          <a href="${property.link}" target="_blank">🔗 Exposé öffnen</a>
        </details>

        <details>
          <summary>Rechtlicher Hinweis</summary>
          <br>
          ⚠️ Automatisierte Orientierungshilfe. Keine Finanzierungsberatung, Rechtsberatung,
          technische Prüfung oder professionelle Wertermittlung. Alle Angaben ohne Gewähr.
        </details>
      </div>
    `;
  });

  results.innerHTML = html;
}
