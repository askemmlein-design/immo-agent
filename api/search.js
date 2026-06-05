export default function handler(req, res) {
  const maxPrice = Number(req.query.maxPrice || 999999999);
  const type = String(req.query.type || "").toLowerCase();
  const radius = Number(req.query.radius || 999);

  const data = [
    {
      id: "api-1",
      title: "Testwohnung München",
      type: "Wohnung Kauf",
      location: "München",
      distance: 8,
      rooms: 1,
      area: 32,
      price: 199000,
      rentalStatus: "vermietet",
      coldRent: 780,
      additionalCosts: 220,
      houseFee: 180,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-2",
      title: "Testwohnung München-Giesing",
      type: "Wohnung Kauf",
      location: "München-Giesing",
      distance: 18,
      rooms: 1,
      area: 28,
      price: 175000,
      rentalStatus: "frei",
      coldRent: 0,
      additionalCosts: 0,
      houseFee: 210,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-3",
      title: "Testwohnung München-Sendling",
      type: "Wohnung Kauf",
      location: "München-Sendling",
      distance: 24,
      rooms: 1,
      area: 24,
      price: 145000,
      rentalStatus: "vermietet",
      coldRent: 620,
      additionalCosts: 180,
      houseFee: 160,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-4",
      title: "Testhaus München-Ost",
      type: "Haus Kauf",
      location: "München-Ost",
      distance: 12,
      rooms: 4,
      area: 110,
      price: 590000,
      rentalStatus: "frei",
      coldRent: 0,
      additionalCosts: 0,
      houseFee: 0,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-5",
      title: "Mietwohnung München-Pasing",
      type: "Wohnung Miete",
      location: "München-Pasing",
      distance: 20,
      rooms: 2,
      area: 54,
      price: 1250,
      rentalStatus: "frei",
      coldRent: 1250,
      additionalCosts: 250,
      houseFee: 0,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-6",
      title: "Reihenhaus zur Miete München-Ost",
      type: "Haus Miete",
      location: "München-Ost",
      distance: 16,
      rooms: 4,
      area: 120,
      price: 2600,
      rentalStatus: "frei",
      coldRent: 2600,
      additionalCosts: 400,
      houseFee: 0,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-7",
      title: "Einzelgarage München-Schwabing",
      type: "Garage Kauf",
      location: "München-Schwabing",
      distance: 9,
      rooms: 0,
      area: 14,
      price: 28000,
      rentalStatus: "vermietet",
      coldRent: 120,
      additionalCosts: 20,
      houseFee: 15,
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    },
    {
      id: "api-8",
      title: "Tiefgaragenstellplatz München-Giesing",
      type: "Garage Miete",
      location: "München-Giesing",
      distance: 18,
      rooms: 0,
      area: 12,
      price: 95,
      rentalStatus: "frei",
      coldRent: 95,
      additionalCosts: 10,
      houseFee: 0,
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80",
      link: "https://www.immobilienscout24.de",
      seller: "API-Test Anbieter",
      phone: "siehe Exposé",
      email: "siehe Exposé"
    }
  ];

  const filtered = data.filter(item => {
    const priceOk = item.price <= maxPrice;
    const typeOk = !type || item.type.toLowerCase() === type;
    const radiusOk = item.distance <= radius;

    return priceOk && typeOk && radiusOk;
  });

  res.status(200).json(filtered);
}