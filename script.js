function generateRandomProperties() {
  const properties = [];

  const locations = [
    "München-Schwabing",
    "München-Giesing",
    "München-Ost",
    "München-Pasing",
    "Haar bei München",
    "Unterhaching",
    "München-Ramersdorf",
    "München-Sendling"
  ];

  for (let i = 1; i <= 10; i++) {
    const score = Math.floor(Math.random() * 41) + 60;
    const price = Math.floor(Math.random() * 150000) + 120000;
    const area = Math.floor(Math.random() * 55) + 35;
    const pricePerSqm = Math.round(price / area);

    let status = "🟡 Prüfen";
    let color = "yellow";

    if (score >= 80) {
      status = "🟢 Interessant";
      color = "green";
    }

    if (score < 60) {
      status = "🔴 Eher nicht";
      color = "red";
    }

    properties.push({
      title: `Objekt ${i}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      price,
      area,
      pricePerSqm,
      year: Math.floor(Math.random() * 35) + 1990,
      score,
      status,
      color,
      seller: "Muster Immobilien GmbH",
      phone: "089 / 123456",
      email: "kontakt@muster-immo.de",
      link: "https://www.immobilienscout24.de"
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

  const now = new Date();
  const searchDate = now.toLocaleString("de-DE");

  let html = `
    <h2>Gefundene Immobilien</h2>

    <div class="box">
      <strong>Suchlauf:</strong> ${searchDate}<br><br>
      <strong>Gesamt:</strong> ${properties.length} Immobilien<br>
      🟢 Interessant: ${greenCount}<br>
      🟡 Prüfen: ${yellowCount}<br>
      🔴 Eher nicht: ${redCount}<br><br>
      <strong>Bester Treffer:</strong> ${properties[0].score}/100 Punkte
    </div>
  `;

  properties.forEach((property, index) => {
    const topDeal = property.score >= 90 ? "🏆 Top Deal" : "";
    const favorite = property.score >= 85 ? "⭐ Favorit" : "";

    html += `
      <div class="result ${property.color}">
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

        <p><strong>Anbieter:</strong> ${property.seller}</p>
        <p><strong>Telefon:</strong> ${property.phone}</p>
        <p><strong>E-Mail:</strong> ${property.email}</p>

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
