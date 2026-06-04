function generateRandomProperties() {

const properties = [];

for(let i = 1; i <= 10; i++) {

const score = Math.floor(Math.random() * 41) + 60;

let status = "🟡 Prüfen";
let color = "yellow";

if(score >= 80){
status = "🟢 Interessant";
color = "green";
}

if(score < 60){
status = "🔴 Eher nicht";
color = "red";
}

properties.push({
title: `Objekt ${i}`,
price: Math.floor(Math.random() * 100000) + 100000,
area: Math.floor(Math.random() * 50) + 40,
year: Math.floor(Math.random() * 30) + 1990,
score: score,
status: status,
color: color
});

}

properties.sort((a,b)=>b.score-a.score);

return properties;
}

function searchProperties(){

const results = document.getElementById("results");

const properties = generateRandomProperties();

let html = "<h2>Gefundene Immobilien</h2>";

properties.forEach((p,index)=>{

html += `
<div class="result ${p.color}">
<h3>🏆 Platz ${index+1}</h3>

<h3>${p.title}</h3>

<p><strong>${p.score}/100 Punkte</strong> ${p.status}</p>

<p>Preis: ${p.price.toLocaleString()} €</p>

<p>Wohnfläche: ${p.area} m²</p>

<p>Baujahr: ${p.year}</p>

</div>
`;

});

results.innerHTML = html;

}
