export default function handler(req, res) {

  const data = [

    {

      id: 1,

      title: "Testwohnung München",

      price: 199000,

      area: 32,

      location: "München"

    },

    {

      id: 2,

      title: "Testwohnung Giesing",

      price: 175000,

      area: 28,

      location: "München-Giesing"

    }

  ];

  res.status(200).json(data);

}
