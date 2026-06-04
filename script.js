function generateRandomProperties() {
  const locations = [
    "81739 München-Ramersdorf",
    "81539 München-Giesing",
    "80804 München-Schwabing",
    "85540 Haar bei München",
    "81373 München-Sendling",
    "81241 München-Pasing"
  ];

  const sellers = [
    "Muster Immobilien GmbH",
    "Alpha Real Estate",
    "München Wohnen Makler",
    "Privatverkäufer",
    "ImmoPlus Bayern"
  ];

  const images = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
  ];

  const interest1 = Number(document.getElementById("interest1").value) / 100;
  const repayment1 = Number(document.getElementById("repayment1").value) / 100;
  const interest2 = Number(document.getElementById("interest2").value) / 100;
  const repayment2 = Number(document.getElementById("repayment2").value) / 100;
  const equity = Number(document.getElementById("equity").value || 0);

  const properties = [];

  for (let i = 1; i <= 10; i++) {
    const price = Math.floor(Math.random() * 180000) + 120000;
    const area = Math.floor(Math.random() * 60) + 35;
    const year = Math.floor(Math.random() * 45) + 1978;
    const houseMoney = Math.floor(Math.random() * 300) + 120;
    const reserves = Math.floor(Math.random() * 90000) + 20000;
    const distance = (Math.random() * 25 + 1).toFixed(1);

    const pricePerSqm = Math.round(price / area);
    const marketPricePerSqm = 4500;
    const marketDiff = Math.round(((pricePerSqm - marketPricePerSqm) / marketPricePerSqm) * 100);
    const marketAdvantage = marketDiff < 0 ? Math.abs(marketDiff) : 0;

    const notary = Math.round(price * 0.02);
    const tax = Math.round(price * 0.035);
    const landRegister = Math.round(price * 0.005);
    const broker = Math.round(price * 0.0357);
    const totalCosts = price + notary + tax + landRegister + broker;
    const loanAmount = Math.max(totalCosts - equity, 0);

    const monthlyRate1 = Math.round((loanAmount * (interest1 + repayment1)) / 12);
    const monthlyRate2 = Math.round((loanAmount * (interest2 + repayment2)) / 12);
    const monthlyDifference = monthlyRate2 - monthlyRate1;

    let score = 50;

    if (pricePerSqm < 3800) score += 25;
    else if (pricePerSqm < 4500) score += 18;
    else if (pricePerSqm < 5200) score += 10;
    else score += 3;

    if (houseMoney < 220) score += 15;
    else if (houseMoney < 330) score += 8;
    else score += 2;

    if (year > 2000) score += 10;
    else if (year > 1990) score += 6;
    else score += 3;

    if (reserves > 70000) score += 10;
    else if (reserves > 40000) score += 6;
    else score += 2;

    score = Math.min(score, 100);

    let status = "🟡 Prüfen";
    let color = "yellow";
    let recommendation = "Interessant, aber Unterlagen und Zustand genauer prüfen.";
    let dealScore = "🟡 Marktgerecht";
    let purchaseSignal = "🟡 Prüfen";

    if (score >= 90) {
      status = "⭐ Sofort ansehen";
      color = "green";
      recommendation = "Sehr starkes Objekt. Zeitnah ansehen und Unterlagen anfordern.";
      dealScore = "🟢 Sehr attraktiv";
      purchaseSignal = "⭐ Sofort ansehen";
    } else if (score >= 80) {
      status = "🟢 Interessant";
      color = "green";
      recommendation = "Besichtigung empfohlen. Objekt wirkt auf Basis der Angaben interessant.";
      dealScore = "🟢 Attraktiv";
      purchaseSignal = "🟢 Besichtigung empfohlen";
    } else if (score < 60) {
      status = "🔴 Eher nicht";
      color = "red";
      recommendation = "Eher nicht priorisieren. Nur bei besonderem Interesse weiter prüfen.";
      dealScore = "🔴 Zu teuer oder kritisch";
      purchaseSignal = "🔴 Eher nicht";
    }

    let houseMoneyStatus = "🟡 Mittel";
    if (houseMoney < 220) houseMoneyStatus = "🟢 Niedrig";
    if (houseMoney > 330) houseMoneyStatus = "🔴 Hoch";

    let distanceStatus = "🟡 Akzeptabel";
    if (distance < 10) distanceStatus = "🟢 Sehr gut";
    if (distance > 25) distanceStatus = "🔴 Weit entfernt";

    let marketText = "kein Vorteil erkennbar";
    if (marketDiff < 0) marketText = `🟢 ${marketAdvantage}% unter Marktpreis`;
    if (marketDiff > 0) marketText = `🔴 ${marketDiff}% über Marktpreis`;

    properties.push({
      id: i,
      title: `Objekt ${i}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      distance,
      distanceStatus,
      seller: sellers[Math.floor(Math.random() * sellers.length)],
      image: images[Math.floor(Math.random() * images.length)],
      price,
      area,
      year,
      houseMoney,
      houseMoneyStatus,
      reserves,
      pricePerSqm,
      marketPricePerSqm,
      marketDiff,
      marketAdvantage,
      marketText,
      score,
      status,
      color,
      notary,
      tax,
      landRegister,
      broker,
      totalCosts,
      equity,
      loanAmount,
      phone: "089 / 123456",
      email: "kontakt@muster-immo.de",
      website: "https://www.immobilienscout24.de",
      link: "https://www.immobilienscout24.de",
      recommendation,
      dealScore,
      purchaseSignal,
      monthlyRate1,
      monthlyRate2,
      monthlyDifference
    });
  }

  properties.sort((a, b) => b.score - a.score);
  return properties;
}

function toggleFavorite(button) {
  if (button.innerText.includes("gespeichert")) {
    button.innerText = "⭐ Zu Favoriten hinzufügen";
  } else {
    button.innerText = "⭐ Favorit gespeichert";
  }
}

function searchProperties() {
  const results = document.getElementById("results");
  const properties = generateRandomProperties();

  const starCount = properties.filter(p => p.score >= 90).length;
  const greenCount = properties.filter(p => p.score >= 80 && p.score < 90).length;
  const yellowCount = properties.filter(p => p.score >= 60 && p.score < 80).length;
  const redCount = properties.filter(p => p.score < 60).length;
  const bestScore = properties[0].score;
  const now = new Date().toLocaleString("de-DE");

  const interest1Value = document.getElementById("interest1").value;
  const repayment1Value = document.getElementById("repayment1").value;
  const interest2Value = document.getElementById("interest2").value;
  const repayment2Value = document.getElementById("repayment2").value;

  let html = `
    <h2>Gefundene Immobilien</h2>

    <details>
      <summary>Suchstatistik</summary>
      <br>
      <strong>Suchlauf:</strong> ${now}<br><br>
      <strong>${properties.length} Treffer</strong><br><br>
      ⭐ ${starCount} | 🟢 ${greenCount} | 🟡 ${yellowCount} | 🔴 ${redCount}<br><br>
      <strong>Bester Treffer:</strong> ${bestScore}/100 Punkte
    </details>
  `;

  properties.forEach((property, index) => {
    const topDeal = property.score >= 95 ? "🏆 TOP DEAL" : "";
    const favorite = property.score >= 85 ? "⭐ Favorit" : "";

    html += `
      <div class="result ${property.color}">
        <img src="${property.image}" alt="${property.title}" style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:15px;">

        <h3>🏆 Platz ${index + 1}</h3>
        <h3>${property.title}</h3>

        <p><strong>📍 Standort:</strong> ${property.location}</p>
        <p><strong>${property.score}/100 Punkte</strong> ${property.status}</p>
        <p><strong>${topDeal}</strong> ${favorite}</p>

        <button class="favorite-btn" onclick="toggleFavorite(this)">⭐ Zu Favoriten hinzufügen</button>

        <hr>

        <p><strong>Preis:</strong> ${property.price.toLocaleString()} €</p>
        <p><strong>Wohnfläche:</strong> ${property.area} m²</p>
        <p><strong>Preis/m²:</strong> ${property.pricePerSqm.toLocaleString()} €/m²</p>
        <p><strong>Marktvergleich:</strong> ${property.marketText}</p>

        <p><strong>Entfernung:</strong> ca. ${property.distance} km ${property.distanceStatus}</p>
        <p><strong>Baujahr:</strong> ${property.year}</p>
        <p><strong>Hausgeld:</strong> ${property.houseMoney} € / Monat ${property.houseMoneyStatus}</p>
        <p><strong>Rücklagen WEG:</strong> ${property.reserves.toLocaleString()} €</p>

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
          Beispiel 1: ${interest1Value}% Zins + ${repayment1Value}% Tilgung<br>
          Monatsrate: ca. <strong>${property.monthlyRate1.toLocaleString()} €</strong><br><br>
          Beispiel 2: ${interest2Value}% Zins + ${repayment2Value}% Tilgung<br>
          Monatsrate: ca. <strong>${property.monthlyRate2.toLocaleString()} €</strong><br><br>
          Differenz: <strong>+${property.monthlyDifference.toLocaleString()} € / Monat</strong>
        </details>

        <details>
          <summary>Anbieter & Kontakt</summary>
          <br>
          Anbieter: ${property.seller}<br>
          Telefon: ${property.phone}<br>
          E-Mail: ${property.email}<br>
          Website: <a href="${property.website}" target="_blank">Anbieter öffnen</a><br>
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