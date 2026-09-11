package com.escoladeconducao.controller;

import com.escoladeconducao.Aluno;
import com.escoladeconducao.service.AlunoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/alunos")
public class AlunoController {
    @Inject
    private AlunoService alunoService;

    @GET
    public Response getAll() {
        List<Aluno> alunos = alunoService.getAll();
        return Response.ok(alunos).build();
    }

    @POST
    public Response create(
        @QueryParam("nome") String nome,
        @QueryParam("email") String email,
        @QueryParam("telefone") String telefone
    ) {
        Aluno aluno = alunoService.create(nome, email, telefone);
        return Response.status(Response.Status.CREATED).entity(aluno).build();
    }
}