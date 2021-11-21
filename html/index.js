const fetch = require('node-fetch');
const express = require('express');
const app = express();

const Units = require('./units');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function capitalize(str) {
    return str.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase()); // "EL SALVADOR" -> "El Salvador"
}

function getUnitSymbol(label) {
    return label.match(/\((.+)\)/)[1];
}

function convertValueToText(value) {
    const RoundFactor = Math.trunc(value) == 0 ? 1e12 : 1e4;

    return Math.round(value * RoundFactor) / RoundFactor;
}

function convertValue(type, srcValueAsText, fromUnit, toUnit) {
    function getUnitFactor(index) {
        return Object.values(Units[type].data[index])[0];
    }

    const srcUnit = getUnitFactor(fromUnit);
    const tgtUnit = getUnitFactor(toUnit);

    const srcValue = parseFloat(srcValueAsText);
    const srcAdjustedValue = srcUnit.to ? srcUnit.to(srcValue) : srcValue * srcUnit;
    const tgtValue = tgtUnit.from ? tgtUnit.from(srcAdjustedValue) : srcAdjustedValue / tgtUnit;

    const tgtValueAsText = convertValueToText(tgtValue);

    const inputNotValid = isNaN(tgtValueAsText);

    return {
        error: inputNotValid ? "Il valore inserito non è valido." : "",
        value: tgtValueAsText
    }
}

function renderConvertPage(req, res) {
    const type = req.body.type;
    const unit = Units[type];
    const options = unit.data.map(item => Object.keys(item)[0]);

    const data = { options, type, unit, from: 0, to: 1 };

    // Se è stato specificato un valore da convertire bisogna aggiungere il risultato ai dati
    const value = req.body.value;
    const from = parseInt(req.body.from, 10);
    const to = parseInt(req.body.to, 10);

    if (value != null && !isNaN(from) && !isNaN(to) && from < options.length && to < options.length) {
        const result = {};
        const converted = convertValue(type, value, from, to);

        result.from = {
            value,
            index: from,
            unit: getUnitSymbol(options[from])
        }

        result.to = {
            value: converted.value,
            index: to,
            unit: getUnitSymbol(options[to])
        }

        result.error = converted.error;

        data.from = from;
        data.to = to;
        data.value = value;
        data.result = result;
    }
    else if(options.length == 1) {
        data.to = 0;
        data.result = { error: "Il servizio per i tassi di cambio non è al momento disponibile." };
    }

    res.render('convert', data);
}

app.get('/', function (req, res) {
    res.render('index', {});
});

app.post('/convert', async function (req, res) {
    // I dati relativi ai tassi di cambio vengono caricati solo se necessario
    if (Units[req.body.type].data == null) {
        try {

            const response = await fetch(
                "https://tassidicambio.bancaditalia.it/terzevalute-wf-web/rest/v1.0/latestRates?lang=it",
                {
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const data = await response.json();

            Units.currency.data = data.latestRates
                .map((rate) => ({
                    euro: rate.isoCode === "EUR",
                    name: `${rate.currency} / ${capitalize(rate.country)}`,
                    rate: 1 / parseFloat(rate.eurRate)
                }))
                .sort((a, b) => (a.euro ? -1 : b.euro ? +1 : a.name.localeCompare(b.name))) // Euro sempre in prima posizione
                .map((row) => ({
                    [row.name]: row.rate
                }));
        } catch (error) {
            console.log(error);

            Units.currency.data = [{ "Euro (€)": 1 }];
        }
    }

    renderConvertPage(req, res);
});

app.listen(3000, () => console.log('Server in ascolto sulla porta 3000'));
