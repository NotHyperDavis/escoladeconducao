package com.escoladeconducao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Instrutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nome;
    private String categoriasHabilitado;

    public Instrutor() {
    }

    public Instrutor(String nome, String categoriasHabilitado) {
        this.nome = nome;
        this.categoriasHabilitado = categoriasHabilitado;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCategoriasHabilitado() {
        return categoriasHabilitado;
    }
    public void setCategoriasHabilitado(String categoriasHabilitado) {
        this.categoriasHabilitado = categoriasHabilitado;
    }
}