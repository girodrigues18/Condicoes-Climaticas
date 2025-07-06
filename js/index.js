const form = document.querySelector("#search-form > form");
const input = document.querySelector("#input-localizacao");
const sectionTempoInfo = document.querySelector("#tempo-info");
const buttonGeo = document.querySelector("#button-geolocalizacao");

const API_KEY = "41c6c66204a9168e81c7c5e9dd051e83"; 

async function buscarTempo(localizacao) {
    if (!sectionTempoInfo) return;

    try {
        const resposta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${localizacao}&appid=${API_KEY}&lang=pt_br&units=metric`
        );

        if (!resposta.ok) {
            throw new Error("Local não encontrado. Tente novamente!");
        }

        const dados = await resposta.json();

        const infos = {
            temperatura: Math.round(dados.main.temp),
            local: dados.name,
            icone: `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`,
            descricao: dados.weather[0].description,
            umidade: dados.main.humidity,
            vento: dados.wind.speed,
            sensacao: Math.round(dados.main.feels_like),
        };

        sectionTempoInfo.innerHTML = `
            <div class="tempo-dados">
                <h2>${infos.local}</h2>
                <span>${infos.temperatura}°C</span>
                
                <p>${infos.descricao.charAt(0).toUpperCase() + infos.descricao.slice(1)}</p>

                <p>🌡️ Sensação térmica: ${infos.sensacao}°C</p>

                <p>💧 Umidade: ${infos.umidade}%</p>
                
                <p>💨 Vento: ${infos.vento} km/h</p>
            </div>
            <img src="${infos.icone}" alt="Ícone do clima"/>
        `;
    } catch (err) {
        sectionTempoInfo.innerHTML = `<p style="color: red;">Erro: ${err.message}</p>`;
    }
}

// Pesquisa por nome da cidade
form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const localizacao = input.value.trim();
    if (localizacao.length < 3) {
        alert("O local precisa ter pelo menos três letras");
        return;
    }
    buscarTempo(localizacao);
});

// Buscar localização do usuário
buttonGeo?.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocalização não é suportada pelo seu navegador.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const resposta = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&lang=pt_br&units=metric`
            );

            if (!resposta.ok) {
                throw new Error("Não foi possível obter a localização.");
            }

            const dados = await resposta.json();
            buscarTempo(dados.name);
        } catch (err) {
            sectionTempoInfo.innerHTML = `<p style="color: red;">Erro: ${err.message}</p>`;
        }
    }, () => {
        alert("Não foi possível obter sua localização. Ative o GPS e tente novamente.");
    });
});