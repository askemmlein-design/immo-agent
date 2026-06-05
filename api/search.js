export default function handler(req, res) {

  const maxPrice = Number(req.query.maxPrice || 999999999);

  const data = [

    {

      id: "api-1",

      title: "Testwohnung München",

      location: "München",

      rooms: 1,

      area: 32,

      price: 199000,

      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",

      link: "https://www.immobilienscout24.de",

      seller: "API-Test Anbieter",

      phone: "siehe Exposé",

      email: "siehe Exposé"

    },

    {

      id: "api-2",

      title: "Testwohnung München-Giesing",

      location: "München-Giesing",

      rooms: 1,

      area: 28,

      price: 175000,

      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",

      link: "https://www.immobilienscout24.de",

      seller: "API-Test Anbieter",

      phone: "siehe Exposé",

      email: "siehe Exposé"

    },

    {

      id: "api-3",

      title: "Testwohnung München-Sendling",

      location: "München-Sendling",

      rooms: 1,

      area: 24,

      price: 145000,

      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",

      link: "https://www.immobilienscout24.de",

      seller: "API-Test Anbieter",

      phone: "siehe Exposé",

      email: "siehe Exposé"

    }

  ];

  const filtered = data.filter(item => item.price <= maxPrice);

  res.status(200).json(filtered);

}
