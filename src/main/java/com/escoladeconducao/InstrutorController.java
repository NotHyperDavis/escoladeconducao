package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/instrutores")
@Produces(MediaType.APPLICATION_JSON)
public class InstrutorController {
    @Inject
    private InstrutorService instrutorService;

    @GET
    public Response getAll() {
        List<Instrutor> instrutores = instrutorService.getAll();
        return Response.ok(instrutores).build();
    }

    @POST
    public Response create(
        @QueryParam("nome") String nome,
        @QueryParam("categoriasHabilitado") String categoriasHabilitado
    ) {
        Instrutor instrutor = instrutorService.create(nome, categoriasHabilitado);
        return Response.status(Response.Status.CREATED).entity(instrutor).build();
    }
}