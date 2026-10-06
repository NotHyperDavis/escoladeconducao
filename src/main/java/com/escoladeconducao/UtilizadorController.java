package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/utilizadores")
@Produces(MediaType.APPLICATION_JSON)
public class UtilizadorController {
    @Inject
    private AuthService authService;

    @POST
    @Path("/registo")
    public Response registar(
        @QueryParam("nome") String nome,
        @QueryParam("email") String email,
        @QueryParam("telefone") String telefone,
        @QueryParam("username") String username,
        @QueryParam("password") String password
    ) {
        Utilizador utilizador = authService.registarAluno(nome, email, telefone, username, password);
        if (utilizador == null) {
            return Response.status(Response.Status.CONFLICT).entity("Esse nome de utilizador já existe.").build();
        }
        String token = authService.gerarToken(utilizador);
        return Response.status(Response.Status.CREATED).entity(new SessaoResponse(token, utilizador)).build();
    }
}