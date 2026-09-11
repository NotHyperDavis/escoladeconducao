package com.escoladeconducao;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import com.escoladeconducao.controller.AlunoController;

import java.util.Set;

@ApplicationPath("/api")
public class AppPath extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        return Set.of(AlunoController.class);
    }
}