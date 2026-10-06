package com.escoladeconducao;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.util.Set;

@ApplicationPath("/api")
public class AppPath extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        return Set.of(AlunoController.class, InstrutorController.class, VeiculoController.class,
                AulaController.class, LoginController.class, UtilizadorController.class);
    }
}