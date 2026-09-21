package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class AulaRepository {
    @PersistenceContext
    private EntityManager em;

    public List<Aula> getAll() {
        return em.createQuery("select a from Aula a", Aula.class).getResultList();
    }

    public Aula getById(int id) {
        return em.find(Aula.class, id);
    }

    public void create(Aula aula) {
        em.persist(aula);
    }

    public boolean existeConflitoInstrutor(Instrutor instrutor, LocalDateTime inicio, LocalDateTime fim) {
        Long total = em.createQuery(
                "select count(a) from Aula a " +
                "where a.instrutor = :instrutor " +
                "and a.estado <> com.escoladeconducao.Aula$Estado.CANCELADA " +
                "and a.dataHoraInicio < :fim and a.dataHoraFim > :inicio", Long.class)
                .setParameter("instrutor", instrutor)
                .setParameter("inicio", inicio)
                .setParameter("fim", fim)
                .getSingleResult();
        return total > 0;
    }

    public boolean existeConflitoVeiculo(Veiculo veiculo, LocalDateTime inicio, LocalDateTime fim) {
        Long total = em.createQuery(
                "select count(a) from Aula a " +
                "where a.veiculo = :veiculo " +
                "and a.estado <> com.escoladeconducao.Aula$Estado.CANCELADA " +
                "and a.dataHoraInicio < :fim and a.dataHoraFim > :inicio", Long.class)
                .setParameter("veiculo", veiculo)
                .setParameter("inicio", inicio)
                .setParameter("fim", fim)
                .getSingleResult();
        return total > 0;
    }
}