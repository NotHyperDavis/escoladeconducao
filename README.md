# Escola de Condução

Description

Sistema de gestão para uma escola de condução, permitindo controlar o processo completo de formação de condutores: inscrição de alunos, marcação de aulas teóricas e práticas, atribuição de instrutores e veículos, e acompanhamento da elegibilidade de cada aluno para realizar o exame de condução.

Main Entities (Data Base)

Aluno — id, nome, email, telefone
Instrutor — id, nome, categorias_habilitado
Veículo — id, matrícula, categoria, estado (disponível / manutenção)
Aula — id, aluno_id, instrutor_id, veiculo_id (nulo se teórica), tipo (teórica/prática), data_hora_inicio, data_hora_fim, estado (marcada, realizada, cancelada)


Main Business Rules

1. Elegibilidade para exame prático.

2. Validação de conflitos na marcação de aulas.

3. Cálculo de pagamentos e aulas extra.