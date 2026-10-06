package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class UtilizadorRepository {
    @PersistenceContext
    private EntityManager em;

    public Utilizador getByUsername(String username) {
        try {
            return em.createQuery(
                    "select u from Utilizador u where u.username = :username", Utilizador.class)
                    .setParameter("username", username)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public Utilizador getById(int id) {
        return em.find(Utilizador.class, id);
    }

    public void create(Utilizador utilizador) {
        em.persist(utilizador);
    }
}