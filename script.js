function generateRandomProperties() {
  const locations = [
    "München-Schwabing",
    "München-Giesing",
    "München-Ost",
    "München-Pasing",
    "Haar bei München",
    "Unterhaching",
    "München-Sendling",
    "München-Ramersdorf"
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

  const properties = [];

  for (let i = 1; i <= 10; i++) {
    const price = Math.floor(Math.random() * 140000) + 120000;
    const area = Math.floor(Math.random() * 55) + 35;
    const year = Math.floor(Math.random() * 45) + 1978;
    const pricePerSqm = Math.round(price / area);
    const score = Math.floor(Math.random() * 51) + 50;

    let status = "🟡 Prüfen";
    let color = "yellow";
    let recommendation = "Interessant, aber Unterlagen und Zustand genauer prüfen.";
    let dealScore = "🟡 Marktüblich";

    if (score >= 80) {
      status = "🟢 Interessant";
      color = "green";
      recommendation = "Besichtigung empfohlen. Objekt wirkt auf Basis der Angaben interessant.";
      dealScore = "🟢 Sehr attraktiv";
    }

    if (score < 60) {
      status = "🔴 Eher nicht";
      color = "red";
      recommendation = "Eher nicht priorisieren. Nur bei besonderem Interesse weiter prüfen.";
      dealScore = "🔴 Zu teuer oder kritisch";
    }

    const loanAmount = price;
    const interestRate = 0.035;
    const repaymentRate = 0.01;
    const monthlyRate = Math.round((loanAmount * (interestRate + repaymentRate)) / 12);

    properties.push({
      title: `Objekt ${i}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      seller: sellers[Math.floor(Math.random() * sellers.length)],
      image: images[Math.floor(Math.random() * images.length)],
      price,
      area,
      year,
      pricePerSqm,
      score,
      status,
      color,
      phone: "089 / 123456",
      email: "kontakt@muster-immo.de",
      website: "https://www.immobilienscout24.de",
      link: "https://www.immobilienscout24.de",
      recommendation,
      dealScore,
      monthlyRate
    });
  }

  properties.sort((a, b) => b.score - a.score);
  return properties;
}

function searchProperties() {
  const results = document.getElementById("results");
  const properties = generateRandomProperties();

  const greenCount = properties.filter(p => p.score >= 80).length;
  const yellowCount = properties.filter(p => p.score >= 60 && p.score < 80).length;
  const redCount = properties.filter(p => p.score < 60).length;
  const bestScore = properties[0].score;
  const now = new Date().toLocaleString("de-DE");

  let html = `
    <h2>Gefundene Immobilien</h2>

    <div class="box">
      <strong>Suchlauf:</strong> ${now}<br><br>
      <strong>Gesamt:</strong> ${properties.length} Immobilien<br>
      🟢 Interessant: ${greenCount}<br>
      🟡 Prüfen: ${yellowCount}<br>
      🔴 Eher nicht: ${redCount}<br><br>
      <strong>Bester Treffer:</strong> ${bestScore}/100 Punkte
    </div>
  `;

  properties.forEach((property, index) => {
    const topDeal = property.score >= 95 ? "🏆 Top Deal" : "";
    const favorite = property.score >= 85 ? "⭐ Favorit" : "";

    html += `
      <div class="result ${property.color}">
        <img 
          src="${property.image}" 
          alt="${property.title}" 
          style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:15px;"
        >

        <h3>🏆 Platz ${index + 1}</h3>
        <h3>${property.title}</h3>

        <p><strong>📍 Standort:</strong> ${property.location}</p>
        <p><strong>${property.score}/100 Punkte</strong> ${property.status}</p>

        <p><strong>${topDeal}</strong> ${favorite}</p>

        <p><strong>Preis:</strong> ${property.price.toLocaleString()} €</p>
        <p><strong>Wohnfläche:</strong> ${property.area} m²</p>
        <p><strong>Preis/m²:</strong> ${property.pricePerSqm.toLocaleString()} €/m²</p>
        <p><strong>Baujahr:</strong> ${property.year}</p>

        <hr>

        <p><strong>Deal-Score:</strong> ${property.dealScore}</p>
        <p><strong>Empfehlung:</strong> ${property.recommendation}</p>

        <div class="box">
          <strong>Finanzierungsbeispiel</strong><br><br>
          Kaufpreis: ${property.price.toLocaleString()} €<br>
          Eigenkapital: 0 €<br>
          Zins: 3,5 %<br>
          Tilgung: 1,0 %<br>
          Geschätzte Monatsrate: ca. ${property.monthlyRate.toLocaleString()} €
        </div>

        <div class="box">
          ⚠️ <strong>Hinweis ohne Gewähr:</strong><br>
          Diese Bewertung und das Finanzierungsbeispiel sind automatisierte Orientierungshilfen.
          Sie ersetzen keine Besichtigung, keine technische Prüfung, keine Finanzierungsberatung,
          keine Rechtsberatung und keine professionelle Wertermittlung. Alle Angaben ohne Gewähr.
        </div>

        <hr>

        <p><strong>Anbieter:</strong> ${property.seller}</p>
        <p><strong>Telefon:</strong> ${property.phone}</p>
        <p><strong>E-Mail:</strong> ${property.email}</p>
        <p><strong>Website:</strong> <a href="${property.website}" target="_blank">Anbieter öffnen</a></p>

        <p>
          <a href="${property.link}" target="_blank">
            🔗 Exposé öffnen
          </a>
        </p>
      </div>
    `;
  });

  results.innerHTML = html;
}
