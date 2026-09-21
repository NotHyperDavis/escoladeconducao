package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/veiculos")
@Produces(MediaType.APPLICATION_JSON)
public class VeiculoController {
    @Inject
    private VeiculoService veiculoService;

    @GET
    public Response getAll() {
        List<Veiculo> veiculos = veiculoService.getAll();
        return Response.ok(veiculos).build();
    }

    @POST
    public Response create(
        @QueryParam("matricula") String matricula,
        @QueryParam("categoria") String categoria,
        @QueryParam("estado") String estado
    ) {
        Veiculo veiculo = veiculoService.create(matricula, categoria, estado);
        return Response.status(Response.Status.CREATED).entity(veiculo).build();
    }
}