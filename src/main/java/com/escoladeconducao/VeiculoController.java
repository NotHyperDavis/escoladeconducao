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

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") int id) {
        Veiculo veiculo = veiculoService.getById(id);
        if (veiculo == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(veiculo).build();
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

    @PUT
    @Path("/{id}")
    public Response update(
        @PathParam("id") int id,
        @QueryParam("matricula") String matricula,
        @QueryParam("categoria") String categoria,
        @QueryParam("estado") String estado
    ) {
        Veiculo veiculo = veiculoService.update(id, matricula, categoria, estado);
        if (veiculo == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(veiculo).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id) {
        if (!veiculoService.delete(id)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}