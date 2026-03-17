/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const protectedPages = [
  "index.html",
  "chamados.html",
  "ativos.html",
  "usuarios.html",
  "relatorios.html"
];

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("loginForm");

/* =========================================================
   LOGIN E PROTEÇÃO
========================================================= */
function isLoggedIn() {
  return localStorage.getItem("infra_logged") === "true";
}

function protectPage() {
  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = "login.html";
  }
}

function setupLogin() {
  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = document.getElementById("loginUser");
    const password = document.getElementById("loginPassword");

    if (!user || !password) return;

    if (user.value === "admin" && password.value === "1234") {
      localStorage.setItem("infra_logged", "true");
      window.location.href = "index.html";
    } else {
      alert("Usuário ou senha inválidos.");
    }
  });
}

function setupLogout() {
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const confirmar = confirm("Deseja realmente sair do sistema?");
    if (!confirmar) return;

    localStorage.removeItem("infra_logged");
    window.location.href = "login.html";
  });
}

/* =========================================================
   TEMA
========================================================= */
function applySavedTheme() {
  const theme = localStorage.getItem("infra_theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function setupThemeToggle() {
  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("infra_theme", isDark ? "dark" : "light");
  });
}

/* =========================================================
   SIDEBAR
========================================================= */
function setupSidebarToggle() {
  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

/* =========================================================
   DADOS INICIAIS
========================================================= */
let chamados = JSON.parse(localStorage.getItem("chamados")) || [
  {
    id: "#1051",
    usuario: "Camila",
    problema: "Falha no Wi-Fi",
    prioridade: "Alta",
    status: "Aberto"
  },
  {
    id: "#1052",
    usuario: "Renato",
    problema: "Erro de login",
    prioridade: "Média",
    status: "Em andamento"
  },
  {
    id: "#1053",
    usuario: "Paula",
    problema: "Monitor sem vídeo",
    prioridade: "Alta",
    status: "Resolvido"
  }
];

let ativos = JSON.parse(localStorage.getItem("ativos")) || [
  {
    id: "#A101",
    nome: "Notebook Lenovo ThinkPad",
    categoria: "Notebook",
    status: "Em uso",
    local: "Escritório"
  },
  {
    id: "#A102",
    nome: "Scanner Zebra DS2208",
    categoria: "Scanner",
    status: "Operacional",
    local: "Expedição"
  },
  {
    id: "#A103",
    nome: "Desktop Dell OptiPlex",
    categoria: "Desktop",
    status: "Manutenção",
    local: "Recebimento"
  },
  {
    id: "#A104",
    nome: "Impressora HP LaserJet",
    categoria: "Impressora",
    status: "Disponível",
    local: "Administrativo"
  }
];

/* =========================================================
   PERSISTÊNCIA
========================================================= */
function saveChamados() {
  localStorage.setItem("chamados", JSON.stringify(chamados));
}

function saveAtivos() {
  localStorage.setItem("ativos", JSON.stringify(ativos));
}

/* =========================================================
   HELPERS
========================================================= */
function getPriorityClass(prioridade) {
  if (prioridade === "Alta") return "alta";
  if (prioridade === "Média") return "media";
  return "baixa";
}

function getStatusClass(status) {
  if (status === "Aberto") return "aberto";
  if (status === "Em andamento") return "andamento";
  if (status === "Resolvido") return "resolvido";
  if (status === "Operacional") return "operacional";
  if (status === "Em uso") return "em-uso";
  if (status === "Manutenção") return "manutencao";
  return "disponivel";
}

function getTicketFilterStatus(status) {
  if (status === "Aberto") return "aberto";
  if (status === "Em andamento") return "andamento";
  return "resolvido";
}

function getAssetFilterStatus(status) {
  return status.toLowerCase();
}

/* =========================================================
   ELEMENTOS - CHAMADOS
========================================================= */
const ticketForm = document.getElementById("ticketForm");
const usuarioInput = document.getElementById("usuario");
const problemaInput = document.getElementById("problema");
const prioridadeInput = document.getElementById("prioridade");
const statusInput = document.getElementById("status");
const chamadosTable = document.getElementById("chamadosTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const editIndexInput = document.getElementById("editIndex");
const submitButton = document.getElementById("submitButton");
const formPanel = document.querySelector(".form-panel");

const sideFilaAtiva = document.getElementById("sideFilaAtiva");
const sideCriticos = document.getElementById("sideCriticos");
const sideResolvidosHoje = document.getElementById("sideResolvidosHoje");

function resetTicketForm() {
  if (ticketForm) ticketForm.reset();
  if (editIndexInput) editIndexInput.value = "";
  if (submitButton) submitButton.textContent = "Cadastrar Chamado";
  if (formPanel) formPanel.classList.remove("editing");
}

function preencherFormularioEdicao(index) {
  const chamado = chamados[index];
  if (!chamado) return;

  if (usuarioInput) usuarioInput.value = chamado.usuario;
  if (problemaInput) problemaInput.value = chamado.problema;
  if (prioridadeInput) prioridadeInput.value = chamado.prioridade;
  if (statusInput) statusInput.value = chamado.status;
  if (editIndexInput) editIndexInput.value = index;
  if (submitButton) submitButton.textContent = "Salvar Alterações";
  if (formPanel) formPanel.classList.add("editing");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirChamado(id) {
  const confirmar = confirm("Deseja realmente excluir este chamado?");
  if (!confirmar) return;

  chamados = chamados.filter((item) => item.id !== id);
  saveChamados();
  refreshAllViews();
}

function renderChamados() {
  if (!chamadosTable) return;

  chamadosTable.innerHTML = "";

  const termoBusca = searchInput ? searchInput.value.toLowerCase() : "";
  const filtroSelecionado = statusFilter ? statusFilter.value : "todos";

  chamados.forEach((chamado, index) => {
    const textoLinha = `
      ${chamado.id}
      ${chamado.usuario}
      ${chamado.problema}
      ${chamado.prioridade}
      ${chamado.status}
    `.toLowerCase();

    const atendeBusca = textoLinha.includes(termoBusca);
    const atendeStatus =
      filtroSelecionado === "todos" ||
      getTicketFilterStatus(chamado.status) === filtroSelecionado;

    if (!atendeBusca || !atendeStatus) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${chamado.id}</td>
      <td>${chamado.usuario}</td>
      <td>${chamado.problema}</td>
      <td><span class="priority ${getPriorityClass(chamado.prioridade)}">${chamado.prioridade}</span></td>
      <td><span class="status ${getStatusClass(chamado.status)}">${chamado.status}</span></td>
      <td class="actions-cell">
        <button class="edit-btn" onclick="preencherFormularioEdicao(${index})">Editar</button>
        <button class="delete-btn" onclick="excluirChamado('${chamado.id}')">Excluir</button>
      </td>
    `;
    chamadosTable.appendChild(tr);
  });
}

function setupTicketForm() {
  if (!ticketForm) return;

  ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const indiceEdicao = editIndexInput ? editIndexInput.value : "";

    const novoChamado = {
      id:
        indiceEdicao !== ""
          ? chamados[indiceEdicao].id
          : `#${new Date().getTime().toString().slice(-5)}`,
      usuario: usuarioInput.value,
      problema: problemaInput.value,
      prioridade: prioridadeInput.value,
      status: statusInput.value
    };

    if (indiceEdicao !== "") {
      chamados[indiceEdicao] = novoChamado;
    } else {
      chamados.push(novoChamado);
    }

    saveChamados();
    resetTicketForm();
    refreshAllViews();
  });
}

function setupTicketFilters() {
  if (searchInput) searchInput.addEventListener("keyup", renderChamados);
  if (statusFilter) statusFilter.addEventListener("change", renderChamados);
}

function updateTicketCards() {
  const abertos = chamados.filter((item) => item.status === "Aberto").length;
  const andamento = chamados.filter((item) => item.status === "Em andamento").length;
  const resolvidos = chamados.filter((item) => item.status === "Resolvido").length;
  const total = chamados.length;

  const cardAbertos = document.getElementById("cardAbertos");
  const cardAndamento = document.getElementById("cardAndamento");
  const cardResolvidos = document.getElementById("cardResolvidos");
  const cardTotal = document.getElementById("cardTotal");

  if (cardAbertos) cardAbertos.textContent = abertos;
  if (cardAndamento) cardAndamento.textContent = andamento;
  if (cardResolvidos) cardResolvidos.textContent = resolvidos;
  if (cardTotal) cardTotal.textContent = total;
}

function updateTicketSideKpis() {
  const filaAtiva = chamados.filter(
    (item) => item.status === "Aberto" || item.status === "Em andamento"
  ).length;

  const criticos = chamados.filter(
    (item) => item.prioridade === "Alta"
  ).length;

  const resolvidos = chamados.filter(
    (item) => item.status === "Resolvido"
  ).length;

  if (sideFilaAtiva) sideFilaAtiva.textContent = filaAtiva;
  if (sideCriticos) sideCriticos.textContent = criticos;
  if (sideResolvidosHoje) sideResolvidosHoje.textContent = resolvidos;
}

/* =========================================================
   ELEMENTOS - ATIVOS
========================================================= */
const assetForm = document.getElementById("assetForm");
const assetNome = document.getElementById("assetNome");
const assetLocal = document.getElementById("assetLocal");
const assetStatus = document.getElementById("assetStatus");
const assetCategoria = document.getElementById("assetCategoria");
const ativosTable = document.getElementById("ativosTable");
const assetSearchInput = document.getElementById("assetSearchInput");
const assetStatusFilter = document.getElementById("assetStatusFilter");
const assetEditIndex = document.getElementById("assetEditIndex");
const assetSubmitButton = document.getElementById("assetSubmitButton");

function resetAssetForm() {
  if (assetForm) assetForm.reset();
  if (assetEditIndex) assetEditIndex.value = "";
  if (assetSubmitButton) assetSubmitButton.textContent = "Cadastrar Ativo";
}

function preencherFormularioAtivo(index) {
  const ativo = ativos[index];
  if (!ativo) return;

  if (assetNome) assetNome.value = ativo.nome;
  if (assetLocal) assetLocal.value = ativo.local;
  if (assetStatus) assetStatus.value = ativo.status;
  if (assetCategoria) assetCategoria.value = ativo.categoria;
  if (assetEditIndex) assetEditIndex.value = index;
  if (assetSubmitButton) assetSubmitButton.textContent = "Salvar Alterações";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function excluirAtivo(id) {
  const confirmar = confirm("Deseja realmente excluir este ativo?");
  if (!confirmar) return;

  ativos = ativos.filter((item) => item.id !== id);
  saveAtivos();
  refreshAllViews();
}

function renderAtivos() {
  if (!ativosTable) return;

  ativosTable.innerHTML = "";

  const termoBusca = assetSearchInput ? assetSearchInput.value.toLowerCase() : "";
  const filtroSelecionado = assetStatusFilter ? assetStatusFilter.value : "todos";

  ativos.forEach((ativo, index) => {
    const textoLinha = `
      ${ativo.id}
      ${ativo.nome}
      ${ativo.categoria}
      ${ativo.status}
      ${ativo.local}
    `.toLowerCase();

    const atendeBusca = textoLinha.includes(termoBusca);
    const atendeStatus =
      filtroSelecionado === "todos" ||
      getAssetFilterStatus(ativo.status) === filtroSelecionado;

    if (!atendeBusca || !atendeStatus) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ativo.id}</td>
      <td>${ativo.nome}</td>
      <td>${ativo.categoria}</td>
      <td><span class="status ${getStatusClass(ativo.status)}">${ativo.status}</span></td>
      <td>${ativo.local}</td>
      <td class="actions-cell">
        <button class="edit-btn" onclick="preencherFormularioAtivo(${index})">Editar</button>
        <button class="delete-btn" onclick="excluirAtivo('${ativo.id}')">Excluir</button>
      </td>
    `;
    ativosTable.appendChild(tr);
  });
}

function setupAssetForm() {
  if (!assetForm) return;

  assetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const indiceEdicao = assetEditIndex ? assetEditIndex.value : "";

    const novoAtivo = {
      id:
        indiceEdicao !== ""
          ? ativos[indiceEdicao].id
          : `#A${new Date().getTime().toString().slice(-4)}`,
      nome: assetNome.value,
      categoria: assetCategoria.value,
      status: assetStatus.value,
      local: assetLocal.value
    };

    if (indiceEdicao !== "") {
      ativos[indiceEdicao] = novoAtivo;
    } else {
      ativos.push(novoAtivo);
    }

    saveAtivos();
    resetAssetForm();
    refreshAllViews();
  });
}

function setupAssetFilters() {
  if (assetSearchInput) assetSearchInput.addEventListener("keyup", renderAtivos);
  if (assetStatusFilter) assetStatusFilter.addEventListener("change", renderAtivos);
}

/* =========================================================
   DASHBOARD
========================================================= */
function updateDashboard() {
  const cardAbertos = document.getElementById("cardAbertos");
  const cardAndamento = document.getElementById("cardAndamento");
  const cardResolvidos = document.getElementById("cardResolvidos");
  const cardTotal = document.getElementById("cardTotal");
  const cardTotalAtivos = document.getElementById("cardTotalAtivos");
  const cardAtivosOperacionais = document.getElementById("cardAtivosOperacionais");
  const cardAtivosManutencao = document.getElementById("cardAtivosManutencao");
  const cardAtivosDisponiveis = document.getElementById("cardAtivosDisponiveis");
  const dashboardResumo = document.getElementById("dashboardResumo");
  const ultimosChamadosDashboard = document.getElementById("ultimosChamadosDashboard");

  const abertos = chamados.filter((item) => item.status === "Aberto").length;
  const andamento = chamados.filter((item) => item.status === "Em andamento").length;
  const resolvidos = chamados.filter((item) => item.status === "Resolvido").length;

  const operacionais = ativos.filter((item) => item.status === "Operacional").length;
  const manutencao = ativos.filter((item) => item.status === "Manutenção").length;
  const disponiveis = ativos.filter((item) => item.status === "Disponível").length;

  if (cardAbertos) cardAbertos.textContent = abertos;
  if (cardAndamento) cardAndamento.textContent = andamento;
  if (cardResolvidos) cardResolvidos.textContent = resolvidos;
  if (cardTotal) cardTotal.textContent = chamados.length;

  if (cardTotalAtivos) cardTotalAtivos.textContent = ativos.length;
  if (cardAtivosOperacionais) cardAtivosOperacionais.textContent = operacionais;
  if (cardAtivosManutencao) cardAtivosManutencao.textContent = manutencao;
  if (cardAtivosDisponiveis) cardAtivosDisponiveis.textContent = disponiveis;

  if (dashboardResumo) {
    dashboardResumo.textContent =
      `O sistema possui ${chamados.length} chamado(s) e ${ativos.length} ativo(s) registrados no momento.`;
  }

  if (ultimosChamadosDashboard) {
    ultimosChamadosDashboard.innerHTML = "";
    chamados.slice(-5).reverse().forEach((chamado) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${chamado.id}</td>
        <td>${chamado.usuario}</td>
        <td>${chamado.problema}</td>
        <td><span class="priority ${getPriorityClass(chamado.prioridade)}">${chamado.prioridade}</span></td>
        <td><span class="status ${getStatusClass(chamado.status)}">${chamado.status}</span></td>
      `;
      ultimosChamadosDashboard.appendChild(tr);
    });
  }
}

/* =========================================================
   RELATÓRIOS
========================================================= */
function updateReports() {
  const cardTotalRelatorio = document.getElementById("cardTotalRelatorio");
  const cardAbertosRelatorio = document.getElementById("cardAbertosRelatorio");
  const cardAndamentoRelatorio = document.getElementById("cardAndamentoRelatorio");
  const cardResolvidosRelatorio = document.getElementById("cardResolvidosRelatorio");
  const cardTotalAtivosRelatorio = document.getElementById("cardTotalAtivosRelatorio");
  const cardAtivosOperacionaisRelatorio = document.getElementById("cardAtivosOperacionaisRelatorio");
  const cardAtivosManutencaoRelatorio = document.getElementById("cardAtivosManutencaoRelatorio");
  const cardAtivosDisponiveisRelatorio = document.getElementById("cardAtivosDisponiveisRelatorio");

  const abertos = chamados.filter((item) => item.status === "Aberto").length;
  const andamento = chamados.filter((item) => item.status === "Em andamento").length;
  const resolvidos = chamados.filter((item) => item.status === "Resolvido").length;

  const operacionais = ativos.filter((item) => item.status === "Operacional").length;
  const manutencao = ativos.filter((item) => item.status === "Manutenção").length;
  const disponiveis = ativos.filter((item) => item.status === "Disponível").length;

  if (cardTotalRelatorio) cardTotalRelatorio.textContent = chamados.length;
  if (cardAbertosRelatorio) cardAbertosRelatorio.textContent = abertos;
  if (cardAndamentoRelatorio) cardAndamentoRelatorio.textContent = andamento;
  if (cardResolvidosRelatorio) cardResolvidosRelatorio.textContent = resolvidos;

  if (cardTotalAtivosRelatorio) cardTotalAtivosRelatorio.textContent = ativos.length;
  if (cardAtivosOperacionaisRelatorio) cardAtivosOperacionaisRelatorio.textContent = operacionais;
  if (cardAtivosManutencaoRelatorio) cardAtivosManutencaoRelatorio.textContent = manutencao;
  if (cardAtivosDisponiveisRelatorio) cardAtivosDisponiveisRelatorio.textContent = disponiveis;
}

/* =========================================================
   GRÁFICOS
========================================================= */
function updateCharts() {
  const total = chamados.length || 1;
  const abertos = chamados.filter((item) => item.status === "Aberto").length;
  const andamento = chamados.filter((item) => item.status === "Em andamento").length;
  const resolvidos = chamados.filter((item) => item.status === "Resolvido").length;

  const pctAbertos = (abertos / total) * 100;
  const pctAndamento = (andamento / total) * 100;
  const pctResolvidos = (resolvidos / total) * 100;

  const barAbertos = document.getElementById("barAbertos");
  const barAndamento = document.getElementById("barAndamento");
  const barResolvidos = document.getElementById("barResolvidos");
  const labelAbertosGrafico = document.getElementById("labelAbertosGrafico");
  const labelAndamentoGrafico = document.getElementById("labelAndamentoGrafico");
  const labelResolvidosGrafico = document.getElementById("labelResolvidosGrafico");

  const relatorioBarAbertos = document.getElementById("relatorioBarAbertos");
  const relatorioBarAndamento = document.getElementById("relatorioBarAndamento");
  const relatorioBarResolvidos = document.getElementById("relatorioBarResolvidos");
  const relatorioAbertosGrafico = document.getElementById("relatorioAbertosGrafico");
  const relatorioAndamentoGrafico = document.getElementById("relatorioAndamentoGrafico");
  const relatorioResolvidosGrafico = document.getElementById("relatorioResolvidosGrafico");

  if (barAbertos) barAbertos.style.width = `${pctAbertos}%`;
  if (barAndamento) barAndamento.style.width = `${pctAndamento}%`;
  if (barResolvidos) barResolvidos.style.width = `${pctResolvidos}%`;

  if (labelAbertosGrafico) labelAbertosGrafico.textContent = abertos;
  if (labelAndamentoGrafico) labelAndamentoGrafico.textContent = andamento;
  if (labelResolvidosGrafico) labelResolvidosGrafico.textContent = resolvidos;

  if (relatorioBarAbertos) relatorioBarAbertos.style.width = `${pctAbertos}%`;
  if (relatorioBarAndamento) relatorioBarAndamento.style.width = `${pctAndamento}%`;
  if (relatorioBarResolvidos) relatorioBarResolvidos.style.width = `${pctResolvidos}%`;

  if (relatorioAbertosGrafico) relatorioAbertosGrafico.textContent = abertos;
  if (relatorioAndamentoGrafico) relatorioAndamentoGrafico.textContent = andamento;
  if (relatorioResolvidosGrafico) relatorioResolvidosGrafico.textContent = resolvidos;
}

/* =========================================================
   REFRESH GERAL
========================================================= */
function refreshAllViews() {
  renderChamados();
  renderAtivos();
  updateTicketCards();
  updateTicketSideKpis();
  updateDashboard();
  updateReports();
  updateCharts();
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */
protectPage();
setupLogin();
setupLogout();
applySavedTheme();
setupThemeToggle();
setupSidebarToggle();
setupTicketForm();
setupTicketFilters();
setupAssetForm();
setupAssetFilters();
refreshAllViews();

/* =========================================================
   DISPONIBILIZAÇÃO GLOBAL
========================================================= */
window.preencherFormularioEdicao = preencherFormularioEdicao;
window.excluirChamado = excluirChamado;
window.preencherFormularioAtivo = preencherFormularioAtivo;
window.excluirAtivo = excluirAtivo;