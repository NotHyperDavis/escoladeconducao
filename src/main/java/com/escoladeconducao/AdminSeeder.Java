package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.Initialized;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AdminSeeder {
    @Inject
    private UtilizadorRepository utilizadorRepository;

    @Transactional
    public void aoArrancar(@Observes @Initialized(ApplicationScoped.class) Object init) {
        if (utilizadorRepository.getByUsername("admin") == null) {
            Utilizador admin = new Utilizador("admin", AuthService.hash("admin123"));
            utilizadorRepository.create(admin);
        }
    }
}