package com.escoladeconducao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Utilizador {

    public enum Tipo {
        ADMIN, ALUNO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String username;

    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno; // null para utilizadores ADMIN

    public Utilizador() {
    }

    // usado pelo AdminSeeder (cria sempre tipo ADMIN, sem aluno associado)
    public Utilizador(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.tipo = Tipo.ADMIN;
    }

    public Utilizador(String username, String passwordHash, Tipo tipo, Aluno aluno) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.tipo = tipo;
        this.aluno = aluno;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }
    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
}