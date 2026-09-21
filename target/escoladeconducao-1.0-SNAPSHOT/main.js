const BASE = "/api";

async function listar(recurso) {
  const div = document.getElementById("resultado-" + recurso);
  div.textContent = "A carregar...";
  try {
    const res = await fetch(`${BASE}/${recurso}`);
    const dados = await res.json();
    div.textContent = JSON.stringify(dados, null, 2);
  } catch (e) {
    div.textContent = "Erro ao carregar: " + e;
  }
}

function mostrarMensagem(id, texto, ok) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "msg " + (ok ? "ok" : "erro");
}

async function criar(recurso, params, msgId, formEl) {
  const query = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${BASE}/${recurso}?${query}`, { method: "POST" });
    if (res.status === 201) {
      mostrarMensagem(msgId, "Criado com sucesso!", true);
      formEl.reset();
      listar(recurso);
    } else {
      const texto = await res.text();
      mostrarMensagem(msgId, `Erro (${res.status}): ${texto || "não foi possível criar"}`, false);
    }
  } catch (e) {
    mostrarMensagem(msgId, "Erro de rede: " + e, false);
  }
}

document.getElementById("form-aluno").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  criar("alunos", {
    nome: f.get("nome"),
    email: f.get("email"),
    telefone: f.get("telefone")
  }, "msg-aluno", e.target);
});

document.getElementById("form-instrutor").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  criar("instrutores", {
    nome: f.get("nome"),
    categoriasHabilitado: f.get("categoriasHabilitado")
  }, "msg-instrutor", e.target);
});

document.getElementById("form-veiculo").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  criar("veiculos", {
    matricula: f.get("matricula"),
    categoria: f.get("categoria"),
    estado: f.get("estado")
  }, "msg-veiculo", e.target);
});

document.getElementById("form-aula").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const params = {
    alunoId: f.get("alunoId"),
    instrutorId: f.get("instrutorId"),
    tipo: f.get("tipo"),
    dataHoraInicio: f.get("dataHoraInicio"),
    dataHoraFim: f.get("dataHoraFim")
  };
  if (f.get("veiculoId")) params.veiculoId = f.get("veiculoId");
  criar("aulas", params, "msg-aula", e.target);
});