const BASE = "/api";

// ---------- Navegação por abas ----------
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
  const alunos = await res.json();
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
        <button class="editar" data-id="${a.id}">Editar</button>
        <button class="apagar" data-id="${a.id}">Apagar</button>
      </td>`;
    tr.querySelector(".editar").addEventListener("click", () => editarAluno(a));
    tr.querySelector(".apagar").addEventListener("click", () => apagarAluno(a.id));
    tbody.appendChild(tr);
  });
  popularSelect('#form-aulas select[name="alunoId"]', alunos, a => `#${a.id} — ${a.nome}`, "Aluno...");
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
        <button class="editar" data-id="${i.id}">Editar</button>
        <button class="apagar" data-id="${i.id}">Apagar</button>
      </td>`;
    tr.querySelector(".editar").addEventListener("click", () => editarInstrutor(i));
    tr.querySelector(".apagar").addEventListener("click", () => apagarInstrutor(i.id));
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
  const veiculos = await res.json();
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
        <button class="editar" data-id="${v.id}">Editar</button>
        <button class="apagar" data-id="${v.id}">Apagar</button>
      </td>`;
    tr.querySelector(".editar").addEventListener("click", () => editarVeiculo(v));
    tr.querySelector(".apagar").addEventListener("click", () => apagarVeiculo(v.id));
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

// ================= AULAS =================
// Nota: não há edição completa da aula (isso implicaria voltar a validar
// conflitos de horário). Dá para mudar o estado diretamente na tabela,
// e para apagar. Para "editar" datas/aluno/instrutor, apaga e cria de novo.

const ESTADOS_AULA = ["MARCADA", "REALIZADA", "CANCELADA"];

// Blocos horários pré-definidos (podes ajustar conforme o horário real da escola)
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

async function carregarAulas() {
  const res = await fetch(`${BASE}/aulas`);
  const aulas = await res.json();
  const tbody = document.getElementById("tabela-aulas");
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
      <td><select class="estado-select" data-id="${aula.id}">${opcoesEstado}</select></td>
      <td><button class="apagar" data-id="${aula.id}">Apagar</button></td>`;
    tr.querySelector(".estado-select").addEventListener("change", (e) => mudarEstadoAula(aula.id, e.target.value));
    tr.querySelector(".apagar").addEventListener("click", () => apagarAula(aula.id));
    tbody.appendChild(tr);
  });
}

async function mudarEstadoAula(id, estado) {
  const res = await fetch(`${BASE}/aulas/${id}/estado?estado=${estado}`, { method: "PUT" });
  if (res.status === 200) {
    mostrarMensagem("aulas", "Estado atualizado.", true);
  } else {
    mostrarMensagem("aulas", `Erro ao atualizar estado (${res.status}).`, false);
    carregarAulas();
  }
}

async function apagarAula(id) {
  if (!confirm("Apagar esta aula?")) return;
  const res = await fetch(`${BASE}/aulas/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    mostrarMensagem("aulas", "Apagada.", true);
    carregarAulas();
  } else {
    mostrarMensagem("aulas", `Erro ao apagar (${res.status}).`, false);
  }
}

document.getElementById("form-aulas").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  if (!form.horario.value) {
    mostrarMensagem("aulas", "Escolhe um horário.", false);
    return;
  }
  const [horaInicio, horaFim] = form.horario.value.split(",");

  const params = {
    alunoId: form.alunoId.value,
    instrutorId: form.instrutorId.value,
    tipo: form.tipo.value,
    dataHoraInicio: `${form.data.value}T${horaInicio}:00`,
    dataHoraFim: `${form.data.value}T${horaFim}:00`
  };
  if (form.veiculoId.value) params.veiculoId = form.veiculoId.value;

  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/aulas?${query}`, { method: "POST" });
  if (res.status === 201) {
    mostrarMensagem("aulas", "Aula marcada!", true);
    form.reset();
    carregarAulas();
  } else if (res.status === 409) {
    mostrarMensagem("aulas", "Conflito de horário: instrutor ou veículo já ocupados.", false);
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
carregarAulas();