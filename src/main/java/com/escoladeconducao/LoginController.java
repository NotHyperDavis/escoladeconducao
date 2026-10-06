package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/login")
@Produces(MediaType.APPLICATION_JSON)
public class LoginController {
    @Inject
    private AuthService authService;

    @POST
    public Response login(@QueryParam("username") String username, @QueryParam("password") String password) {
        Utilizador utilizador = authService.autenticar(username, password);
        if (utilizador == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Credenciais inválidas.").build();
        }
        String token = authService.gerarToken(utilizador);
        return Response.ok(new SessaoResponse(token, utilizador)).build();
    }

    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("Authorization") String authHeader) {
        authService.logout(authHeader);
        return Response.noContent().build();
    }

    // Endpoint temporário para criar a primeira conta de admin.
    // Depois de criares a tua conta, o mais seguro é remover este método
    // (e o AuthService.registarAdmin), já que fica aberto a qualquer pessoa.
    @POST
    @Path("/criar-admin")
    public Response criarAdmin(@QueryParam("username") String username, @QueryParam("password") String password) {
        Utilizador utilizador = authService.registarAdmin(username, password);
        if (utilizador == null) {
            return Response.status(Response.Status.CONFLICT).entity("Esse nome de utilizador já existe.").build();
        }
        return Response.status(Response.Status.CREATED).build();
    }
}