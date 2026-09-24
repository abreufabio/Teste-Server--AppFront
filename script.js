const servidores = [
  { nome: "srv-368-1", ip: "10.0.0.1", cpu: 35, online: true },
  { nome: "srv-368-2", ip: "10.0.0.2", cpu: 62, online: true },
  { nome: "srv-368-3", ip: "10.0.0.3", cpu: 80, online: true },
  { nome: "srv-368-4", ip: "10.0.0.4", cpu: 48, online: false }
  
];

console.table(servidores);
console.log(servidores[0].nome);
console.log(servidores[0]["cpu"]);

const LIMITE_ALERTA = 55;
const LIMITE_CRITICO = 75;

function classificar(cpu) {

    if (cpu < 0 || cpu > 100) {
        return "invalido";
    }

    if (cpu >= LIMITE_CRITICO) {
        return "critico";
    } 
    else if (cpu >= LIMITE_ALERTA) {
        return "alerta";
    } 
    else {
        return "ok";
    }
}

console.log(classificar(54));
console.log(classificar(55));
console.log(classificar(75));
console.log(classificar(101));

const painel = document.getElementById("painel");
const log = document.getElementById("log");

function renderizar() {
    painel.innerHTML = "";
    let criticos = 0;
    for (let i = 0; i < servidores.length; i++) {
        const s = servidores[i];
        const card = document.createElement("div");
        card.classList.add("card");
        const classificacao = classificar(s.cpu);
        card.classList.add(classificacao);
        if (s.online === false) {
            card.classList.add("offline");
        }
        if (classificacao === "critico") {
            criticos++;
        }
        card.innerHTML =
            "<strong>" + s.nome + "</strong><br>" +
            s.ip + "<br>" +
            "CPU: " + s.cpu + "%";
        painel.appendChild(card);
    }
    log.textContent = "Servidores críticos: " + criticos;
}
renderizar();

const btnAtualizar = document.getElementById("btn-atualizar");
const btnManutencao = document.getElementById("btn-manutencao");

btnAtualizar.addEventListener("click", function () {
    for (let i = 0; i < servidores.length; i++) {
        servidores[i].cpu = Math.floor(Math.random() * 101);
    }
    renderizar();
});
btnManutencao.addEventListener("click", function () {
    document.body.classList.toggle("manutencao");
    if (document.body.classList.contains("manutencao")) {

        btnManutencao.textContent = "Desativar manutenção";

    } else {

        btnManutencao.textContent = "Ativar manutenção";
    }
});

const REDUCAO = 15;
const MAX_TENTATIVAS = 5;

const btnReiniciar = document.getElementById("btn-reiniciar");
function reiniciarCriticos() {
    const mensagens = [];
    for (let i = 0; i < servidores.length; i++) {
        const s = servidores[i];
        if (!s.online) continue;
        let tentativas = 0;
        while (s.cpu >= LIMITE_CRITICO && tentativas < MAX_TENTATIVAS) {

            s.cpu = s.cpu - REDUCAO;
            tentativas++;
        }
        if (tentativas > 0) {
            mensagens.push(
                s.nome + ": estabilizado após " +
                tentativas + " tentativa(s), cpu " +
                s.cpu + "%"
            );
        }
    }
    renderizar();
    log.textContent = mensagens.length > 0
        ? mensagens.join("\n")
        : "Nenhum servidor crítico.";
}
btnReiniciar.addEventListener("click", reiniciarCriticos);
