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

  const images = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
  ];

  for (let i = 1; i <= 10; i++) {
    const score = Math.floor(Math.random() * 41) + 60;

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
      image: images[Math.floor(Math.random() * images.length)],
      price: Math.floor(Math.random() * 100000) + 100000,
      area: Math.floor(Math.random() * 50) + 40,
      year: Math.floor(Math.random() * 30) + 1990,
      score: score,
      status: status,
      color: color,
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

  let html = "<h2>Gefundene Immobilien</h2>";

  properties.forEach((property, index) => {
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

        <p><strong>Preis:</strong> ${property.price.toLocaleString()} €</p>
        <p><strong>Wohnfläche:</strong> ${property.area} m²</p>
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
