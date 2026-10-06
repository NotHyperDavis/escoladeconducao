package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class AuthService {
    @Inject
    private UtilizadorRepository utilizadorRepository;
    @Inject
    private AlunoRepository alunoRepository;

    // token -> id do utilizador (em memória; reinicia quando o servidor reinicia)
    private final Map<String, Integer> tokensAtivos = new ConcurrentHashMap<>();

    public Utilizador autenticar(String username, String password) {
        Utilizador utilizador = utilizadorRepository.getByUsername(username);
        if (utilizador == null || !utilizador.getPasswordHash().equals(hash(password))) {
            return null;
        }
        return utilizador;
    }

    @Transactional
    public Utilizador registarAluno(String nome, String email, String telefone, String username, String password) {
        if (utilizadorRepository.getByUsername(username) != null) {
            return null;
        }
        Aluno aluno = new Aluno(nome, email, telefone);
        alunoRepository.create(aluno);

        Utilizador utilizador = new Utilizador(username, hash(password), Utilizador.Tipo.ALUNO, aluno);
        utilizadorRepository.create(utilizador);
        return utilizador;
    }

    // Cria uma conta de admin (sem Aluno associado). Usado apenas para arrancar o primeiro
    // utilizador admin via o endpoint POST /login/criar-admin do LoginController.
    @Transactional
    public Utilizador registarAdmin(String username, String password) {
        if (utilizadorRepository.getByUsername(username) != null) {
            return null;
        }
        Utilizador utilizador = new Utilizador(username, hash(password), Utilizador.Tipo.ADMIN, null);
        utilizadorRepository.create(utilizador);
        return utilizador;
    }

    public String gerarToken(Utilizador utilizador) {
        String token = UUID.randomUUID().toString();
        tokensAtivos.put(token, utilizador.getId());
        return token;
    }

    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokensAtivos.remove(authHeader.substring("Bearer ".length()));
        }
    }

    public Utilizador getUtilizadorAutenticado(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        Integer id = tokensAtivos.get(authHeader.substring("Bearer ".length()));
        if (id == null) {
            return null;
        }
        return utilizadorRepository.getById(id);
    }

    public boolean validarAdmin(String authHeader) {
        Utilizador utilizador = getUtilizadorAutenticado(authHeader);
        return utilizador != null && utilizador.getTipo() == Utilizador.Tipo.ADMIN;
    }

    public static String hash(String texto) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(texto.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}