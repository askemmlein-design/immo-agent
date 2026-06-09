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

  const propertyType = (

    property.type ||

    property.title ||

    ""

  ).toLowerCase();

  if (

    propertyType.includes("garage") ||

    propertyType.includes("stellplatz") ||

    propertyType.includes("tiefgarage")

  ) {

    score = 60;

    if (property.price <= 30000) score += 20;

    else if (property.price <= 50000) score += 10;

    if (property.coldRent >= 80) score += 10;

    if (property.coldRent >= 120) score += 10;

    return Math.min(score, 100);

  }

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

function getYield(property) {
  if (!property.coldRent || property.coldRent <= 0 || !property.price) return 0;
  return (property.coldRent * 12 / property.price) * 100;
}

function getRiskSignal(property) {
  const title = property.title.toLowerCase();

  if (title.includes("hobbyraum")) return "🔴";
  if (title.includes("hotel")) return "🔴";
  if (title.includes("student")) return "🟡";

  return "🟢";
}

function getLocationSignal(property) {
  const location = property.location.toLowerCase();

  if (
    location.includes("schwabing") ||
    location.includes("maxvorstadt") ||
    location.includes("haidhausen")
  ) {
    return "🟢";
  }

  if (
    location.includes("giesing") ||
    location.includes("perlach")
  ) {
    return "🟡";
  }

  return "⚪";
}
function getPositiveReasons(property) {

  const reasons = [];

  if (property.pricePerSqm < 7000) reasons.push("✅ Preis pro m² wirkt attraktiv.");

  if (property.price <= 200000) reasons.push("✅ Kaufpreis liegt im gewünschten Rahmen.");

  if (property.area >= 25) reasons.push("✅ Wohnfläche ist brauchbar.");

  if (property.location.toLowerCase().includes("münchen")) reasons.push("✅ Lage grundsätzlich gut vermietbar.");

  if (property.score >= 80) reasons.push("✅ Gesamtbewertung ist positiv.");

  if (reasons.length === 0) {

    reasons.push("ℹ️ Keine klaren Vorteile automatisch erkannt.");

  }

  return reasons;

}

function getRiskReasons(property) {

  const risks = [];

  if (property.pricePerSqm > 9000) risks.push("⚠️ Preis pro m² ist hoch.");

  if (!property.houseFee || property.houseFee === 0) risks.push("⚠️ Hausgeld fehlt oder ist unbekannt.");

  if (!property.coldRent || property.coldRent === 0) risks.push("⚠️ Kaltmiete fehlt oder ist unbekannt.");

  if (property.title.toLowerCase().includes("hobbyraum")) risks.push("⚠️ Hobbyraum: Wohnnutzung unbedingt prüfen.");

  if (property.title.toLowerCase().includes("hotel")) risks.push("⚠️ Hotel-/Sondernutzung genau prüfen.");

  if (property.monthlyRate1 > 1200) risks.push("⚠️ Finanzierungsrate wirkt hoch.");

  if (risks.length === 0) {

    risks.push("✅ Keine besonderen Risiken automatisch erkannt. Unterlagen trotzdem prüfen.");

  }

  return risks;

}

function getDealBadge(property) {

  const propertyType = (property.type || "").toLowerCase();

  if (propertyType.includes("miete")) {

    return "";

  }

  const yieldValue = getYield(property);

  const riskSignal = getRiskSignal(property);

  if (

    property.score >= 95 &&

    property.pricePerSqm < 7000 &&

    yieldValue >= 5 &&

    riskSignal !== "🔴"

  ) {

    return "⭐⭐⭐ SCHNÄPPCHEN";

  }

  if (

    property.score >= 90 &&

    property.pricePerSqm < 8000 &&

    yieldValue >= 4 &&

    riskSignal !== "🔴"

  ) {

    return "⭐⭐ PREMIUM DEAL";

  }

  if (

    property.score >= 85 &&

    riskSignal !== "🔴"

  ) {

    return "⭐ TOP DEAL";

  }

  return "";

}
async function searchProperties() {
  const results = document.getElementById("results");
  const favorites = getFavorites();

  const interest1 = Number(document.getElementById("interest1").value) / 100;
  const repayment1 = Number(document.getElementById("repayment1").value) / 100;
  const interest2 = Number(document.getElementById("interest2").value) / 100;
  const repayment2 = Number(document.getElementById("repayment2").value) / 100;
  const equity = Number(document.getElementById("equity").value || 0);
const usage = document.getElementById("usage").value;

const rentPerSqm = Number(document.getElementById("rentPerSqm").value || 0);

const maxPrice = document.getElementById("maxPrice").value || 999999999;

const selectedType = document.getElementById("type").value;

const type = encodeURIComponent(selectedType);

const radius = document.getElementById("radius").value || 999;

const minArea = Number(document.getElementById("minArea").value || 0);

const maxArea = Number(document.getElementById("maxArea").value || 999999);

const minRooms = Number(document.getElementById("minRooms").value || 0);

results.innerHTML = "<p>Suche läuft...</p>";

  const response = await fetch(`/api/search?maxPrice=${maxPrice}&type=${type}&radius=${radius}`);
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
      <strong>${properties.length} Treffer</strong><br><br>
      ⭐ ${starCount} | 🟢 ${greenCount} | 🟡 ${yellowCount} | 🔴 ${redCount}<br><br>
      <strong>Gespeicherte Favoriten:</strong> ${favorites.length}
    </details>
  `;

  properties.forEach((property, index) => {
    const isFavorite = favorites.includes(property.id);
    const yieldValue = getYield(property);
    const dealBadge = getDealBadge(property);

const topDeal = dealBadge

  ? `<span style="color:#16a34a;font-weight:bold">${dealBadge}</span>`

  : "";

    html += `
      <div class="result ${property.color}">
        <img src="${property.image}" alt="${property.title}" style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:15px;">

        <h3>🏆 Platz ${index + 1}</h3>
        <h3>${property.title}</h3>

        <p><strong>📍 Standort:</strong> ${property.location}</p>
        <p><strong>${property.score}/100 Punkte</strong> ${property.status}</p>
        <p>${topDeal}</p>

        <p>
          <strong>🏆 Gesamturteil:</strong>
          ${
            property.score >= 90
              ? "🟢 KAUFEMPFEHLUNG"
              : property.score >= 80
              ? "🟢 INTERESSANT"
              : property.score >= 60
              ? "🟡 GENAU PRÜFEN"
              : "🔴 EHER NICHT"
          }
        </p>

        <p>
          📍 Lage: ${getLocationSignal(property)}
          &nbsp;&nbsp;
          💰 Rendite: ${

  property.type && property.type.toLowerCase().includes("miete")

    ? "➖"

    : yieldValue >= 5

    ? "🟢"

    : yieldValue >= 3

    ? "🟡"

    : "🔴"

}
          &nbsp;&nbsp;
          ⚠️ Risiko: ${getRiskSignal(property)}
        </p>

        <p>
          📈 Marktchance:
          ${
            property.pricePerSqm < 7000
              ? "🟢 Stark unter Markt"
              : property.pricePerSqm < 9000
              ? "🟡 Marktgerecht"
              : "🔴 Über Markt"
          }
        </p>

        <p>
          🏦 Finanzierungsrisiko:
          ${
            property.monthlyRate1 <= 800
              ? "🟢 Gut tragbar"
              : property.monthlyRate1 <= 1200
              ? "🟡 Prüfen"
              : "🔴 Hohe Belastung"
          }
        </p>

        <p>
          ${
            property.score >= 90
              ? "✓ Sehr gutes Preis-Leistungs-Verhältnis"
              : property.score >= 80
              ? "✓ Objekt wirkt attraktiv"
              : property.score >= 60
              ? "✓ Weitere Prüfung notwendig"
              : "✗ Aktuell kein Favorit"
          }
        </p>

        <button class="favorite-btn" onclick="toggleFavorite('${property.id}')">
          ${isFavorite ? "⭐ Favorit gespeichert" : "☆ Zu Favoriten hinzufügen"}
        </button>

        <hr>

        <p><strong>Preis:</strong> ${property.price.toLocaleString()} €</p>
        <p><strong>Wohnfläche:</strong> ${property.area} m²</p>
        <p><strong>Zimmer:</strong> ${property.rooms}</p>
        <p><strong>Preis/m²:</strong> ${property.pricePerSqm.toLocaleString()} €/m²</p>
        <p><strong>Marktvergleich:</strong> ${property.marketText}</p>

        <p><strong>Vermietung:</strong> ${
          property.rentalStatus === "vermietet" ? "🟢 Vermietet" : "🏠 Frei"
        }</p>

        <p><strong>Kaltmiete:</strong> ${(property.coldRent || 0).toLocaleString()} €</p>
        <p><strong>Nebenkosten:</strong> ${(property.additionalCosts || 0).toLocaleString()} €</p>
        <p><strong>Hausgeld:</strong> ${(property.houseFee || 0).toLocaleString()} €</p>
        ${

  property.type && property.type.toLowerCase().includes("miete")

    ? ""

    : `<p><strong>Bruttorendite:</strong> ${yieldValue.toFixed(2)} %</p>`

}

        <hr>

        <p><strong>Deal-Score:</strong> ${property.dealScore}</p>
        <p><strong>Kaufsignal:</strong> ${property.purchaseSignal}</p>
        <p><strong>Kaufempfehlung:</strong> ${property.recommendation}</p>

        <details open>

  <summary>Warum diese Bewertung?</summary>

  <br>

  <strong>Warum positiv?</strong><br>

  ${getPositiveReasons(property).join("<br>")}

  <br><br>

  <strong>Risiken / prüfen:</strong><br>

  ${getRiskReasons(property).join("<br>")}

  <br><br>

  <strong>Klare Empfehlung:</strong><br>

  ${

    property.score >= 90

      ? "🟢 Sehr interessant – sofort Exposé öffnen und Unterlagen prüfen."

      : property.score >= 80

      ? "🟢 Interessant – Besichtigung oder nähere Prüfung sinnvoll."

      : property.score >= 60

      ? "🟡 Genau prüfen – Datenlage und Risiken beachten."

      : "🔴 Eher nicht – nur bei besonderem Grund weiterverfolgen."

  }

  <br><br>

  <strong>Analyse vom:</strong> ${now}

</details>

        <details>
          <summary>Investment-Check</summary>
          <br>
          ${

  property.type && property.type.toLowerCase().includes("miete")

    ? "Bruttorendite: nicht relevant bei Mietobjekt<br>"

    : `Bruttorendite: ${

        yieldValue >= 4

          ? "🟢 attraktiv"

          : yieldValue >= 3

          ? "🟡 okay"

          : yieldValue > 0

          ? "🔴 niedrig"

          : "nicht berechenbar"

      }<br>`

}
          Vermietungsstatus: ${
            property.rentalStatus === "vermietet"
              ? "🟢 bereits vermietet"
              : "🟡 frei / neu vermietbar"
          }<br>
          Hausgeld: ${
            property.houseFee > 0
              ? property.houseFee <= 180
                ? "🟢 niedrig"
                : property.houseFee <= 300
                ? "🟡 normal"
                : "🔴 hoch"
              : "nicht angegeben"
          }<br><br>
          Investor-Kaufsignal: ${
            yieldValue >= 4
              ? "🟢 Für Kapitalanlage interessant"
              : property.rentalStatus === "frei"
              ? "🟡 Eher Eigennutzung / Neuvermietung prüfen"
              : "🟡 Genau prüfen"
          }<br><br>
          Exposé-Checkliste:<br>
          ☐ Energieausweis prüfen<br>
          ☐ Hausgeldabrechnung prüfen<br>
          ☐ Rücklagen / WEG-Protokolle prüfen<br>
          ☐ Mietvertrag prüfen<br>
          ☐ Sondernutzung oder Hobbyraum prüfen
        </details>
        <details>

          <summary>💰 Cashflow Analyse</summary>

          <br>

          Mieteinnahmen kalt: ${(property.coldRent || 0).toLocaleString()} €<br>

          Hausgeld: ${(property.houseFee || 0).toLocaleString()} €<br>

          Finanzierungsrate Beispiel 1: ${property.monthlyRate1.toLocaleString()} €<br><br>

          Monatlicher Cashflow: <strong>${

            ((property.coldRent || 0) - (property.houseFee || 0) - property.monthlyRate1).toLocaleString()

          } €</strong><br><br>

          Bewertung: ${

            ((property.coldRent || 0) - (property.houseFee || 0) - property.monthlyRate1) > 100

              ? "🟢 Positiver Cashflow"

              : ((property.coldRent || 0) - (property.houseFee || 0) - property.monthlyRate1) >= 0

              ? "🟡 Neutral / knapp positiv"

              : "🔴 Negativer Cashflow"

          }<br><br>

          Hinweis: Diese Berechnung ist vereinfacht. Nicht berücksichtigt sind Instandhaltung,

          Leerstand, Steuer, nicht umlagefähige Kosten und Sonderumlagen.

        </details>        
                <details>
          <summary>📍 Lagebewertung</summary>
          <br>
          Lage-Score: ${
            property.location.toLowerCase().includes("schwabing")
              ? "🟢 Top-Lage"
              : property.location.toLowerCase().includes("maxvorstadt")
              ? "🟢 Top-Lage"
              : property.location.toLowerCase().includes("haidhausen")
              ? "🟢 Top-Lage"
              : property.location.toLowerCase().includes("bogenhausen")
              ? "🟢 Sehr gute Lage"
              : property.location.toLowerCase().includes("giesing")
              ? "🟡 Gute Lage"
              : property.location.toLowerCase().includes("perlach")
              ? "🟡 Solide Lage"
              : "⚪ Lage manuell prüfen"
          }<br><br>
          Vermietbarkeit: ${
            property.location.toLowerCase().includes("münchen")
              ? "🟢 Grundsätzlich sehr gut"
              : "🟡 Prüfen"
          }<br><br>
          Entfernung: ${property.distance ? property.distance + " km" : "nicht angegeben"}
        </details>

        <details>
          <summary>Risikoanalyse</summary>
          <br>
          ${
            property.title.toLowerCase().includes("hobbyraum")
              ? "⚠️ Hobbyraum: Wohnnutzung und Teilungserklärung unbedingt prüfen.<br>"
              : ""
          }
          ${
            property.title.toLowerCase().includes("student")
              ? "⚠️ Studentenapartment: Vermietungsbindung, Betreibervertrag und Zielgruppe prüfen.<br>"
              : ""
          }
          ${
            property.title.toLowerCase().includes("hotel")
              ? "⚠️ Hotelapartment: Betreiberkonzept, Auslastung und Vertragslaufzeit prüfen.<br>"
              : ""
          }
          ${
            property.type && property.type.toLowerCase().includes("garage")
              ? "⚠️ Garage/Stellplatz: Hausgeld, Sonderumlagen, Zufahrt und Vermietbarkeit prüfen.<br>"
              : ""
          }
          ${
            property.type && property.type.toLowerCase().includes("haus")
              ? "⚠️ Haus: Dach, Heizung, Fenster, Feuchtigkeit und Sanierungsstand prüfen.<br>"
              : ""
          }
          ${
            !property.title.toLowerCase().includes("hobbyraum") &&
            !property.title.toLowerCase().includes("student") &&
            !property.title.toLowerCase().includes("hotel") &&
            !(property.type && property.type.toLowerCase().includes("garage")) &&
            !(property.type && property.type.toLowerCase().includes("haus"))
              ? "Keine besonderen Risiken aus Titel oder Objektart erkannt. Unterlagen trotzdem prüfen."
              : ""
          }
        </details>

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
html += `

  <br>

  <button onclick="window.print()" class="secondary-button">

    📄 Analyse drucken / als PDF speichern

  </button>

`;  results.innerHTML = html;
}
