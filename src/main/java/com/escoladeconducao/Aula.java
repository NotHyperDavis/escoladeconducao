package com.escoladeconducao;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Aula {

    public enum Tipo {
        TEORICA, PRATICA
    }

    public enum Estado {
        MARCADA, REALIZADA, CANCELADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "instrutor_id", nullable = false)
    private Instrutor instrutor;

    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo; // nulo se a aula for teorica

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    public Aula() {
    }

    public Aula(Aluno aluno, Instrutor instrutor, Veiculo veiculo, Tipo tipo,
                LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim) {
        this.aluno = aluno;
        this.instrutor = instrutor;
        this.veiculo = veiculo;
        this.tipo = tipo;
        this.dataHoraInicio = dataHoraInicio;
        this.dataHoraFim = dataHoraFim;
        this.estado = Estado.MARCADA;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public Aluno getAluno() {
        return aluno;
    }
    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }
    public Instrutor getInstrutor() {
        return instrutor;
    }
    public void setInstrutor(Instrutor instrutor) {
        this.instrutor = instrutor;
    }
    public Veiculo getVeiculo() {
        return veiculo;
    }
    public void setVeiculo(Veiculo veiculo) {
        this.veiculo = veiculo;
    }
    public Tipo getTipo() {
        return tipo;
    }
    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }
    public LocalDateTime getDataHoraInicio() {
        return dataHoraInicio;
    }
    public void setDataHoraInicio(LocalDateTime dataHoraInicio) {
        this.dataHoraInicio = dataHoraInicio;
    }
    public LocalDateTime getDataHoraFim() {
        return dataHoraFim;
    }
    public void setDataHoraFim(LocalDateTime dataHoraFim) {
        this.dataHoraFim = dataHoraFim;
    }
    public Estado getEstado() {
        return estado;
    }
    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}