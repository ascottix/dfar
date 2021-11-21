const Units = {
  area: {
    icon: "crop_din",
    data: [
      { "Metro quadro (m²)": 1 },
      { "Chilometro quadrato (km²)": 1e6 },
      { "Ettaro (ha)": 1e4 },
      { "Ara (a)": 1e2 },
      { "Miglio quadrato (mi²)": 2.59e6 },
      { "Pollice quadrato (in²)": 1 / 1550 }
    ]
  },
  currency: {
    icon: "euro_symbol",
    data: null, // I dati vengono caricati solo se necessario, usando una REST API esterna
    info: "<strong>Attenzione</strong>: i tassi di cambio vengono aggiornati solo saltuariamente, non è possibile quindi garantirne l'accuratezza."
  },
  length: {
    icon: "format_align_left",
    data: [
      { "Metro (m)": 1 },
      { "Centimetro (cm)": 1e-2 },
      { "Millimetro (mm)": 1e-3 },
      { "Chilometro (km)": 1e3 },
      { "Miglio (mi)": 1609.34 },
      { "Piede (ft)": 0.3048 },
      { "Pollice (in)": 0.0254 }
    ]
  },
  mass: {
    icon: "panorama_vertical_select",
    data: [
      { "Grammo (g)": 1 },
      { "Chilogrammo (kg)": 1e3 },
      { "Milligrammo (mg)": 1e-3 },
      { "Quintale (q)": 1e5 },
      { "Tonnellata (t)": 1e6 },
      { "Libbra (lb)": 453.59 },
      { "Oncia (oz)": 28.35 }
    ]
  },
  speed: {
    icon: "speed",
    data: [
      { "Chilometri all'ora (km/h)": 1 },
      { "Metri al secondo (m/s)": 3.6 },
      { "Miglia all'ora (mi/h)": 1.60934 },
      { Nodi: 1.852 },
      { "Piedi al secondo (ft/s)": 1.09728 }
    ]
  },
  temperature: {
    icon: "thermostat",
    data: [
      { "Celsius (°C)": 1 },
      {
        "Fahrenheit (°F)": {
          from: (x) => (9 * x) / 5 + 32,
          to: (x) => (5 * (x - 32)) / 9
        }
      },
      {
        "Kelvin (K)": {
          from: (x) => x + 273.15,
          to: (x) => x - 273.15
        }
      }
    ]
  },
  volume: {
    icon: "local_drink",
    data: [{ "Litro (l)": 1 }, { "Millilitro (ml)": 1e-3 }, { "Metro cubo (m³)": 1 }]
  }
};
