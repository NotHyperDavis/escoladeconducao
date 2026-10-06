package com.escoladeconducao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.util.List;

@Path("/aulas")
@Produces(MediaType.APPLICATION_JSON)
public class AulaController {
    @Inject
    private AulaService aulaService;

    @Inject
    private AuthService authService;

    @GET
    public Response getAll() {
        List<Aula> aulas = aulaService.getAll();
        return Response.ok(aulas).build();
    }

    @GET
    @Path("/minhas")
    public Response getMinhas(@HeaderParam("Authorization") String authHeader) {
        Utilizador utilizador = authService.getUtilizadorAutenticado(authHeader);
        if (utilizador == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        if (utilizador.getTipo() != Utilizador.Tipo.ALUNO || utilizador.getAluno() == null) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        List<Aula> aulas = aulaService.getByAluno(utilizador.getAluno().getId());
        return Response.ok(aulas).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") int id) {
        Aula aula = aulaService.getById(id);
        if (aula == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(aula).build();
    }

    @POST
    public Response create(
        @QueryParam("alunoId") int alunoId,
        @QueryParam("instrutorId") int instrutorId,
        @QueryParam("veiculoId") Integer veiculoId,
        @QueryParam("tipo") Aula.Tipo tipo,
        @QueryParam("dataHoraInicio") String dataHoraInicio,
        @QueryParam("dataHoraFim") String dataHoraFim
    ) {
        try {
            LocalDateTime inicio = LocalDateTime.parse(dataHoraInicio);
            LocalDateTime fim = LocalDateTime.parse(dataHoraFim);
            Aula aula = aulaService.create(alunoId, instrutorId, veiculoId, tipo, inicio, fim);
            return Response.status(Response.Status.CREATED).entity(aula).build();
        } catch (ConflitoAgendamentoException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}/estado")
    public Response updateEstado(@PathParam("id") int id, @QueryParam("estado") Aula.Estado estado) {
        Aula aula = aulaService.updateEstado(id, estado);
        if (aula == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(aula).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") int id) {
    if (!aulaService.delete(id)) {
        return Response.status(Response.Status.NOT_FOUND).build();
        }
    return Response.noContent().build();
    }
}