package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/alunos")
@Produces(MediaType.APPLICATION_JSON)
public class AlunoController {
    @Inject
    private AlunoService alunoService;

    @GET
    public Response getAll() {
        List<Aluno> alunos = alunoService.getAll();
        return Response.ok(alunos).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") int id) {
        Aluno aluno = alunoService.getById(id);
        if (aluno == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(aluno).build();
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

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") int id,
            @QueryParam("nome") String nome,
            @QueryParam("email") String email,
            @QueryParam("telefone") String telefone) {
        Aluno aluno = alunoService.update(id, nome, email, telefone);
        if (aluno == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(aluno).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id) {
        if (!alunoService.delete(id)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}