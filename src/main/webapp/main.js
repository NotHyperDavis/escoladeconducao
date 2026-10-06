const BASE = "/api";

// ================= Navegação por abas =================
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll("main > section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

function mostrarMensagem(recurso, texto, ok) {
  const el = document.getElementById("msg-" + recurso);
  el.textContent = texto;
  el.className = "msg " + (ok ? "ok" : "erro");
}

// Preenche um <select> com base numa lista, preservando a seleção atual se ainda existir
function popularSelect(seletor, itens, textoFn, opcaoVazia) {
  const select = document.querySelector(seletor);
  if (!select) return;
  const valorAtual = select.value;
  select.innerHTML = `<option value="">${opcaoVazia}</option>` +
    itens.map(item => `<option value="${item.id}">${textoFn(item)}</option>`).join("");
  if ([...select.options].some(o => o.value === valorAtual)) {
    select.value = valorAtual;
  }
}

// ================= ALUNOS =================
async function carregarAlunos() {
  const res = await fetch(`${BASE}/alunos`);
  const todos = await res.json();

  // Admin vê todos; um aluno só se vê a si próprio; sem sessão não vê ninguém.
  let alunos;
  if (isAdmin()) {
    alunos = todos;
  } else if (isAluno()) {
    const meuId = sessionStorage.getItem("sessaoAlunoId");
    alunos = todos.filter(a => String(a.id) === String(meuId));
  } else {
    alunos = [];
  }

  const tbody = document.getElementById("tabela-alunos");
  tbody.innerHTML = "";
  alunos.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${a.nome}</td>
      <td>${a.email}</td>
      <td>${a.telefone}</td>
      <td>
        ${isAdmin() ? `<button class="editar" data-id="${a.id}">Editar</button>
        <button class="apagar" data-id="${a.id}">Apagar</button>` : ""}
      </td>`;
    if (isAdmin()) {
      tr.querySelector(".editar").addEventListener("click", () => editarAluno(a));
      tr.querySelector(".apagar").addEventListener("click", () => apagarAluno(a.id));
    }
    tbody.appendChild(tr);
  });
}

function editarAluno(a) {
  const form = document.getElementById("form-alunos");
  form.id.value = a.id;
  form.nome.value = a.nome;
  form.email.value = a.email;
  form.telefone.value = a.telefone;
  form.querySelector("button[type=submit]").textContent = "Guardar alterações";
  form.querySelector(".cancelar").style.display = "inline-block";
}

function resetFormAlunos() {
  const form = document.getElementById("form-alunos");
  form.reset();
  form.id.value = "";
  form.querySelector("button[type=submit]").textContent = "Criar";
  form.querySelector(".cancelar").style.display = "none";
}

async function apagarAluno(id) {
  if (!isAdmin()) return;
  if (!confirm("Apagar este aluno?")) return;
  const res = await fetch(`${BASE}/alunos/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    mostrarMensagem("alunos", "Apagado.", true);
    carregarAlunos();
  } else {
    mostrarMensagem("alunos", `Erro ao apagar (${res.status}).`, false);
  }
}

document.getElementById("form-alunos").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isAdmin()) return;
  const form = e.target;
  const id = form.id.value;
  const params = new URLSearchParams({
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value
  });
  const url = id ? `${BASE}/alunos/${id}?${params}` : `${BASE}/alunos?${params}`;
  const res = await fetch(url, { method: id ? "PUT" : "POST" });
  if (res.status === 201 || res.status === 200) {
    mostrarMensagem("alunos", id ? "Atualizado!" : "Criado!", true);
    resetFormAlunos();
    carregarAlunos();
  } else {
    mostrarMensagem("alunos", `Erro (${res.status}).`, false);
  }
});

document.querySelector("#form-alunos .cancelar").addEventListener("click", resetFormAlunos);

// ================= INSTRUTORES =================
async function carregarInstrutores() {
  const res = await fetch(`${BASE}/instrutores`);
  const instrutores = await res.json();
  const tbody = document.getElementById("tabela-instrutores");
  tbody.innerHTML = "";
  instrutores.forEach(i => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.id}</td>
      <td>${i.nome}</td>
      <td>${i.categoriasHabilitado}</td>
      <td>
        ${isAdmin() ? `<button class="editar" data-id="${i.id}">Editar</button>
        <button class="apagar" data-id="${i.id}">Apagar</button>` : ""}
      </td>`;
    if (isAdmin()) {
      tr.querySelector(".editar").addEventListener("click", () => editarInstrutor(i));
      tr.querySelector(".apagar").addEventListener("click", () => apagarInstrutor(i.id));
    }
    tbody.appendChild(tr);
  });
  popularSelect('#form-aulas select[name="instrutorId"]', instrutores, i => `#${i.id} — ${i.nome}`, "Instrutor...");
}

function editarInstrutor(i) {
  const form = document.getElementById("form-instrutores");
  form.id.value = i.id;
  form.nome.value = i.nome;
  form.categoriasHabilitado.value = i.categoriasHabilitado;
  form.querySelector("button[type=submit]").textContent = "Guardar alterações";
  form.querySelector(".cancelar").style.display = "inline-block";
}

function resetFormInstrutores() {
  const form = document.getElementById("form-instrutores");
  form.reset();
  form.id.value = "";
  form.querySelector("button[type=submit]").textContent = "Criar";
  form.querySelector(".cancelar").style.display = "none";
}

async function apagarInstrutor(id) {
  if (!isAdmin()) return;
  if (!confirm("Apagar este instrutor?")) return;
  const res = await fetch(`${BASE}/instrutores/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    mostrarMensagem("instrutores", "Apagado.", true);
    carregarInstrutores();
  } else {
    mostrarMensagem("instrutores", `Erro ao apagar (${res.status}).`, false);
  }
}

document.getElementById("form-instrutores").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isAdmin()) return;
  const form = e.target;
  const id = form.id.value;
  const params = new URLSearchParams({
    nome: form.nome.value,
    categoriasHabilitado: form.categoriasHabilitado.value
  });
  const url = id ? `${BASE}/instrutores/${id}?${params}` : `${BASE}/instrutores?${params}`;
  const res = await fetch(url, { method: id ? "PUT" : "POST" });
  if (res.status === 201 || res.status === 200) {
    mostrarMensagem("instrutores", id ? "Atualizado!" : "Criado!", true);
    resetFormInstrutores();
    carregarInstrutores();
  } else {
    mostrarMensagem("instrutores", `Erro (${res.status}).`, false);
  }
});

document.querySelector("#form-instrutores .cancelar").addEventListener("click", resetFormInstrutores);

// ================= VEICULOS =================
async function carregarVeiculos() {
  const res = await fetch(`${BASE}/veiculos`);
  const todos = await res.json();
  // Quem não é admin só vê (e só pode escolher, ao marcar aula) os veículos disponíveis
  const veiculos = isAdmin() ? todos : todos.filter(v => v.estado === "DISPONIVEL");
  const tbody = document.getElementById("tabela-veiculos");
  tbody.innerHTML = "";
  veiculos.forEach(v => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>${v.matricula}</td>
      <td>${v.categoria}</td>
      <td>${v.estado}</td>
      <td>
        ${isAdmin() ? `<button class="editar" data-id="${v.id}">Editar</button>
        <button class="apagar" data-id="${v.id}">Apagar</button>` : ""}
      </td>`;
    if (isAdmin()) {
      tr.querySelector(".editar").addEventListener("click", () => editarVeiculo(v));
      tr.querySelector(".apagar").addEventListener("click", () => apagarVeiculo(v.id));
    }
    tbody.appendChild(tr);
  });
  popularSelect('#form-aulas select[name="veiculoId"]', veiculos, v => `#${v.id} — ${v.matricula}`, "Sem veículo (teórica)");
}

function editarVeiculo(v) {
  const form = document.getElementById("form-veiculos");
  form.id.value = v.id;
  form.matricula.value = v.matricula;
  form.categoria.value = v.categoria;
  form.estado.value = v.estado;
  form.querySelector("button[type=submit]").textContent = "Guardar alterações";
  form.querySelector(".cancelar").style.display = "inline-block";
}

function resetFormVeiculos() {
  const form = document.getElementById("form-veiculos");
  form.reset();
  form.id.value = "";
  form.querySelector("button[type=submit]").textContent = "Criar";
  form.querySelector(".cancelar").style.display = "none";
}

async function apagarVeiculo(id) {
  if (!isAdmin()) return;
  if (!confirm("Apagar este veículo?")) return;
  const res = await fetch(`${BASE}/veiculos/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    mostrarMensagem("veiculos", "Apagado.", true);
    carregarVeiculos();
  } else {
    mostrarMensagem("veiculos", `Erro ao apagar (${res.status}).`, false);
  }
}

document.getElementById("form-veiculos").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isAdmin()) return;
  const form = e.target;
  const id = form.id.value;
  const params = new URLSearchParams({
    matricula: form.matricula.value,
    categoria: form.categoria.value,
    estado: form.estado.value
  });
  const url = id ? `${BASE}/veiculos/${id}?${params}` : `${BASE}/veiculos?${params}`;
  const res = await fetch(url, { method: id ? "PUT" : "POST" });
  if (res.status === 201 || res.status === 200) {
    mostrarMensagem("veiculos", id ? "Atualizado!" : "Criado!", true);
    resetFormVeiculos();
    carregarVeiculos();
  } else {
    mostrarMensagem("veiculos", `Erro (${res.status}).`, false);
  }
});

document.querySelector("#form-veiculos .cancelar").addEventListener("click", resetFormVeiculos);

// ================= SESSÃO (opcional, só para a aba Aulas) =================
// Guardada em sessionStorage: sessaoToken, sessaoTipo (ADMIN/ALUNO), sessaoNome, sessaoAlunoId

function sessaoAtiva() {
  return sessionStorage.getItem("sessaoToken") !== null;
}

function isAdmin() {
  return sessaoAtiva() && sessionStorage.getItem("sessaoTipo") === "ADMIN";
}

function isAluno() {
  return sessaoAtiva() && sessionStorage.getItem("sessaoTipo") === "ALUNO";
}

// Alunos, Instrutores e Veículos: criar/editar/apagar só com sessão de admin (a mesma da aba Aulas).
// Em Alunos, um aluno só vê o seu próprio registo.
function atualizarPermissoesRecursos() {
  const admin = isAdmin();

  document.getElementById("form-alunos").style.display = admin ? "flex" : "none";
  const avisoAlunos = document.getElementById("aviso-alunos");
  if (admin) {
    avisoAlunos.style.display = "none";
  } else {
    avisoAlunos.textContent = isAluno()
      ? "Só vês os teus próprios dados. Para gerir todos os alunos, inicia sessão como admin na aba \"Aulas\"."
      : "Inicia sessão (aba \"Aulas\") para veres os teus dados.";
    avisoAlunos.style.display = "block";
  }

  document.getElementById("form-instrutores").style.display = admin ? "flex" : "none";
  document.getElementById("aviso-instrutores").style.display = admin ? "none" : "block";

  document.getElementById("form-veiculos").style.display = admin ? "flex" : "none";
  document.getElementById("aviso-veiculos").style.display = admin ? "none" : "block";

  // Reconstrói as tabelas para mostrar/esconder linhas e botões de ação
  carregarAlunos();
  carregarInstrutores();
  carregarVeiculos();
}

function cabecalhosAuth() {
  const token = sessionStorage.getItem("sessaoToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function guardarSessao(dados) {
  sessionStorage.setItem("sessaoToken", dados.token);
  sessionStorage.setItem("sessaoTipo", dados.tipo);
  sessionStorage.setItem("sessaoNome", dados.nome);
  if (dados.alunoId != null) {
    sessionStorage.setItem("sessaoAlunoId", dados.alunoId);
  } else {
    sessionStorage.removeItem("sessaoAlunoId");
  }
}

function limparSessao() {
  sessionStorage.removeItem("sessaoToken");
  sessionStorage.removeItem("sessaoTipo");
  sessionStorage.removeItem("sessaoNome");
  sessionStorage.removeItem("sessaoAlunoId");
}

function atualizarAuthUI() {
  const ativa = sessaoAtiva();
  const tipo = sessionStorage.getItem("sessaoTipo");

  document.getElementById("auth-anonimo").style.display = ativa ? "none" : "block";
  document.getElementById("auth-logado").style.display = ativa ? "block" : "none";
  document.getElementById("painel-sem-sessao").style.display = ativa ? "none" : "block";
  document.getElementById("painel-admin").style.display = ativa && tipo === "ADMIN" ? "block" : "none";
  document.getElementById("painel-aluno").style.display = ativa && tipo === "ALUNO" ? "block" : "none";

  if (ativa) {
    document.getElementById("auth-nome").textContent = sessionStorage.getItem("sessaoNome");
    document.getElementById("auth-tipo").textContent = tipo === "ADMIN" ? "admin" : "aluno";
    if (tipo === "ADMIN") {
      carregarAulasAdmin();
    } else {
      carregarAulasAluno();
    }
  }

  atualizarPermissoesRecursos();
}

// Alternar entre "Entrar" e "Criar conta"
document.querySelectorAll(".auth-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const mostrarRegisto = btn.dataset.authTab === "registo";
    document.getElementById("form-entrar").style.display = mostrarRegisto ? "none" : "flex";
    document.getElementById("form-registo-aluno").style.display = mostrarRegisto ? "flex" : "none";
    document.getElementById("msg-auth").textContent = "";
  });
});

document.getElementById("form-entrar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(
    `${BASE}/login?username=${encodeURIComponent(form.username.value)}&password=${encodeURIComponent(form.password.value)}`,
    { method: "POST" }
  );
  if (res.status === 200) {
    const dados = await res.json();
    guardarSessao(dados);
    document.getElementById("msg-auth").textContent = "";
    form.reset();
    atualizarAuthUI();
  } else {
    document.getElementById("msg-auth").textContent = "Utilizador ou password incorretos.";
  }
});

document.getElementById("form-registo-aluno").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const params = new URLSearchParams({
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value,
    username: form.username.value,
    password: form.password.value
  });
  const res = await fetch(`${BASE}/utilizadores/registo?${params}`, { method: "POST" });
  if (res.status === 201) {
    const dados = await res.json();
    guardarSessao(dados);
    document.getElementById("msg-auth").textContent = "";
    form.reset();
    atualizarAuthUI();
  } else if (res.status === 409) {
    document.getElementById("msg-auth").textContent = "Esse nome de utilizador já existe.";
  } else {
    document.getElementById("msg-auth").textContent = `Erro (${res.status}).`;
  }
});

document.getElementById("btn-auth-logout").addEventListener("click", async () => {
  await fetch(`${BASE}/login/logout`, { method: "POST", headers: cabecalhosAuth() });
  limparSessao();
  atualizarAuthUI();
});

// ================= AULAS =================
const ESTADOS_AULA = ["MARCADA", "REALIZADA", "CANCELADA"];

// Blocos horários pré-definidos (ajusta conforme o horário real da escola)
const HORARIOS = [
  ["09:00", "10:00"],
  ["10:00", "11:00"],
  ["11:00", "12:00"],
  ["14:00", "15:00"],
  ["15:00", "16:00"],
  ["16:00", "17:00"],
  ["17:00", "18:00"],
  ["18:00", "19:00"]
];

function popularHorarios() {
  const select = document.querySelector('#form-aulas select[name="horario"]');
  select.innerHTML = '<option value="">Horário...</option>' +
    HORARIOS.map(([inicio, fim]) => `<option value="${inicio},${fim}">${inicio} - ${fim}</option>`).join("");
}

// ---- Painel ADMIN: todas as aulas ----
async function carregarAulasAdmin() {
  const res = await fetch(`${BASE}/aulas`, { headers: cabecalhosAuth() });
  const aulas = await res.json();
  const tbody = document.getElementById("tabela-aulas-admin");
  tbody.innerHTML = "";
  aulas.forEach(aula => {
    const tr = document.createElement("tr");
    const opcoesEstado = ESTADOS_AULA.map(estado =>
      `<option value="${estado}" ${estado === aula.estado ? "selected" : ""}>${estado}</option>`
    ).join("");
    tr.innerHTML = `
      <td>${aula.id}</td>
      <td>${aula.aluno ? aula.aluno.nome : "-"}</td>
      <td>${aula.instrutor ? aula.instrutor.nome : "-"}</td>
      <td>${aula.veiculo ? aula.veiculo.matricula : "-"}</td>
      <td>${aula.tipo}</td>
      <td>${aula.dataHoraInicio}</td>
      <td>${aula.dataHoraFim}</td>
      <td><select class="estado-select">${opcoesEstado}</select></td>
      <td><button class="apagar">Apagar</button></td>`;
    tr.querySelector(".estado-select").addEventListener("change", (e) => mudarEstadoAula(aula.id, e.target.value, carregarAulasAdmin));
    tr.querySelector(".apagar").addEventListener("click", () => apagarAula(aula.id));
    tbody.appendChild(tr);
  });
}

async function apagarAula(id) {
  if (!confirm("Apagar esta aula?")) return;
  const res = await fetch(`${BASE}/aulas/${id}`, { method: "DELETE", headers: cabecalhosAuth() });
  if (res.status === 204) {
    mostrarMensagem("aulas", "Apagada.", true);
    carregarAulasAdmin();
  } else if (res.status === 401) {
    mostrarMensagem("aulas", "Sessão de admin expirada, entra outra vez.", false);
  } else {
    mostrarMensagem("aulas", `Erro ao apagar (${res.status}).`, false);
  }
}

// ---- Painel ALUNO: só as suas aulas ----
async function carregarAulasAluno() {
  const res = await fetch(`${BASE}/aulas/minhas`, { headers: cabecalhosAuth() });
  if (res.status !== 200) {
    mostrarMensagem("aulas", "Sessão expirada, entra outra vez.", false);
    limparSessao();
    atualizarAuthUI();
    return;
  }
  const aulas = await res.json();
  const tbody = document.getElementById("tabela-aulas-aluno");
  tbody.innerHTML = "";
  aulas.forEach(aula => {
    const tr = document.createElement("tr");
    const podeCancel = aula.estado === "MARCADA";
    tr.innerHTML = `
      <td>${aula.id}</td>
      <td>${aula.instrutor ? aula.instrutor.nome : "-"}</td>
      <td>${aula.veiculo ? aula.veiculo.matricula : "-"}</td>
      <td>${aula.tipo}</td>
      <td>${aula.dataHoraInicio}</td>
      <td>${aula.dataHoraFim}</td>
      <td>${aula.estado}</td>
      <td>${podeCancel ? '<button class="cancelar-aula">Cancelar</button>' : ""}</td>`;
    if (podeCancel) {
      tr.querySelector(".cancelar-aula").addEventListener("click", () =>
        mudarEstadoAula(aula.id, "CANCELADA", carregarAulasAluno));
    }
    tbody.appendChild(tr);
  });
}

async function mudarEstadoAula(id, estado, recarregar) {
  const res = await fetch(`${BASE}/aulas/${id}/estado?estado=${estado}`, {
    method: "PUT",
    headers: cabecalhosAuth()
  });
  if (res.status === 200) {
    mostrarMensagem("aulas", "Estado atualizado.", true);
  } else if (res.status === 401) {
    mostrarMensagem("aulas", "Sessão expirada, entra outra vez.", false);
  } else if (res.status === 403) {
    mostrarMensagem("aulas", "Sem permissão para esta alteração.", false);
  } else {
    mostrarMensagem("aulas", `Erro (${res.status}).`, false);
  }
  recarregar();
}

// ---- Marcar nova aula (painel do aluno) ----
document.getElementById("form-aulas").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  if (!form.horario.value) {
    mostrarMensagem("aulas", "Escolhe um horário.", false);
    return;
  }
  const [horaInicio, horaFim] = form.horario.value.split(",");

  const params = {
    instrutorId: form.instrutorId.value,
    tipo: form.tipo.value,
    dataHoraInicio: `${form.data.value}T${horaInicio}:00`,
    dataHoraFim: `${form.data.value}T${horaFim}:00`
  };
  if (form.veiculoId.value) params.veiculoId = form.veiculoId.value;

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/aulas?${query}`, { method: "POST", headers: cabecalhosAuth() });
  if (res.status === 201) {
    mostrarMensagem("aulas", "Aula marcada!", true);
    form.reset();
    carregarAulasAluno();
  } else if (res.status === 409) {
    mostrarMensagem("aulas", "Conflito de horário: instrutor ou veículo já ocupados.", false);
  } else if (res.status === 401) {
    mostrarMensagem("aulas", "Sessão expirada, entra outra vez.", false);
  } else {
    const texto = await res.text();
    mostrarMensagem("aulas", `Erro (${res.status}): ${texto}`, false);
  }
});

// ================= Arranque =================
popularHorarios();
carregarAlunos();
carregarInstrutores();
carregarVeiculos();
atualizarAuthUI();