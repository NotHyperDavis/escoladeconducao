package com.escoladeconducao;

public class SessaoResponse {
    public String token;
    public String tipo;
    public Integer alunoId;
    public String nome;

    public SessaoResponse() {
    }

    public SessaoResponse(String token, Utilizador utilizador) {
        this.token = token;
        this.tipo = utilizador.getTipo().name();
        if (utilizador.getAluno() != null) {
            this.alunoId = utilizador.getAluno().getId();
            this.nome = utilizador.getAluno().getNome();
        } else {
            this.nome = utilizador.getUsername();
        }
    }
}