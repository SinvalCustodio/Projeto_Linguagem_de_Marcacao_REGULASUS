# ESPECIFICAÇÃO DE PROJETO
## Sistema de Gerenciamento de Disponibilidade de Vagas para Consultas Eletivas

**Nome do Sistema:** REGULASUS - Sistema Integrado de Regulação de Fluxo de Saúde

**Versão:** 1.0  
**Data de Criação:** Maio 2026  
**Status:** Especificação de Desenvolvimento

---

## 1. INTRODUÇÃO

### 1.1 Objetivo Geral
Desenvolver uma plataforma web para gerenciar o fluxo de pacientes desde a Unidade Básica de Saúde (UBS) até hospitais públicos ou conveniados com o SUS, facilitando o agendamento de consultas especializadas e exames, com priorização clínica automática.

### 1.2 Objetivo Específicos
- Permitir cadastro de encaminhamentos de pacientes na UBS
- Automatizar a auditoria e classificação de prioridade
- Gerenciar disponibilidade de vagas em centros especializados
- Notificar pacientes sobre agendamentos
- Gerar relatórios de ocupação e fila de espera
- Integrar dados de pacientes com sistema municipal

---

## 2. PÚBLICO-ALVO

- **Médicos da UBS:** Emitem encaminhamentos
- **Equipe Administrativa:** Cadastra dados e gerencia filas
- **Médicos Reguladores:** Validam pedidos e autorizam agendamentos
- **Centros Especializados/Hospitais:** Gerenciam vagas disponíveis
- **Pacientes:** Acompanham agendamentos
- **Gestores:** Monitoram indicadores

---

## 3. FUNCIONALIDADES PRINCIPAIS

### 3.1 Módulo UBS
- [ ] Cadastro de pacientes
- [ ] Emissão de encaminhamento com especialidade solicitada
- [ ] Classificação de prioridade (rotina, urgência, emergência)
- [ ] Anexação de documentos (exames prévios, receitas)
- [ ] Visualização de status do encaminhamento

### 3.2 Módulo de Auditoria e Regulação
- [ ] Dashboard de solicitações pendentes
- [ ] Avaliação de pedidos por médico regulador
- [ ] Autorização ou rejeição de encaminhamentos
- [ ] Solicitação de complementação de informações
- [ ] Priorização automática por critério clínico

### 3.3 Módulo de Gestão de Vagas
- [ ] Cadastro de especialidades
- [ ] Registros de vagas disponíveis por período
- [ ] Visualização de agenda de consultas
- [ ] Cancelamento e reagendamento
- [ ] Bloqueio de períodos (férias, manutenção)

### 3.4 Módulo de Pacientes
- [ ] Login e autenticação
- [ ] Visualização de encaminhamentos
- [ ] Confirmação de agendamento
- [ ] Consulta de status da fila
- [ ] Histórico de consultas realizadas

### 3.5 Módulo de Relatórios
- [ ] Relatório de ocupação por especialidade
- [ ] Tempo médio de espera
- [ ] Taxa de falta a consultas
- [ ] Auditoria de movimentação
- [ ] Indicadores de desempenho

---

## 4. FLUXO DE FUNCIONAMENTO

```
┌─────────────────────────────────────────────────────────────┐
│                      PACIENTE CHEGA NA UBS                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           MÉDICO GENERALISTA AVALIA NECESSIDADE              │
│                                                               │
│    NÃO PRECISA          PRECISA DE ESPECIALISTA              │
│    DE ESPECIALISTA      ou EXAME ESPECIALIZADO              │
│         │                         │                          │
│         └─────► TRATAMENTO NA UBS │                          │
│                                   ▼                          │
│              ┌────────────────────────────────────┐           │
│              │ EMITIR ENCAMINHAMENTO COM DADOS:  │           │
│              │ - Especialidade                   │           │
│              │ - Prioridade (rotina/urgência)    │           │
│              │ - Diagnóstico provisório          │           │
│              │ - Documentação clínica            │           │
│              └────────────────┬───────────────────┘           │
│                               │                              │
│                               ▼                              │
│              ┌────────────────────────────────────┐           │
│              │  INSERIR NO REGULASUS            │           │
│              │  (Equipe administrativa)          │           │
│              └────────────────┬───────────────────┘           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                AUDITORIA E REGULAÇÃO                         │
│                                                               │
│         Médico Regulador avalia: ☑️ AUTORIZADO               │
│         - Valida dados clínicos                              │
│         - Classifica prioridade                              │
│         - Encaminha para fila de espera                      │
└────────────────────────┬────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        VAG DISPONÍVEL       AGUARDANDO VAGA
              │                     │
              ▼                     ▼
        AGENDAMENTO IMEDIATO  FILA DE ESPERA
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
    ┌────────────────────────────────────────┐
    │  NOTIFICAÇÃO DO PACIENTE/POSTO         │
    │  - Telefone, SMS ou Email              │
    │  - Data, hora e local da consulta      │
    └────────────────┬───────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────┐
    │  PACIENTE COMPARECE À CONSULTA         │
    │  NO CENTRO ESPECIALIZADO/HOSPITAL      │
    └────────────────┬───────────────────────┘
                     │
              ┌──────┴──────┐
              │             │
        COMPARECEU    NÃO COMPARECEU
              │             │
              ▼             ▼
        CONSULTA      REGISTRO DE FALTA
        REALIZADA     E REMARCAÇÃO
```

---

## 5. ESTRUTURA TÉCNICA

### 5.1 Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Arquitetura:** MVC (Model-View-Controller)
- **Responsividade:** Mobile-first

### 5.2 Componentes da Interface
- Header com logo e navegação
- Sidebar com menu de contexto
- Dashboard principal
- Formulários de entrada
- Tabelas de dados
- Modais de confirmação

### 5.3 Camadas de Dados
```
┌──────────────────────────────┐
│      APLICAÇÃO WEB           │
│  (HTML, CSS, JavaScript)     │
└────────────┬─────────────────┘
             │
┌────────────▼─────────────────┐
│     SERVIDOR/BANCO DE DADOS   │
│  (API REST, Autenticação)    │
└──────────────────────────────┘
```

---

## 6. SEGURANÇA E CONFORMIDADE

- Conformidade com LGPD (Lei Geral de Proteção de Dados)
- Criptografia de dados sensíveis (CPF, dados médicos)
- Autenticação obrigatória
- Logs de auditoria de todas as operações
- Controle de acesso por perfil de usuário
- Backup periódico de dados

---

## 7. INDICADORES DE SUCESSO

- Redução do tempo médio de espera em 30%
- Aumento na taxa de ocupação de vagas (>85%)
- Redução de faltas a consultas (<5%)
- Satisfação de usuários (>4.5/5.0)
- Disponibilidade do sistema (>99%)

---

## 8. CRONOGRAMA

| Fase | Duração | Atividades |
|------|---------|-----------|
| Planejamento | 2 semanas | Levantamento de requisitos |
| Design | 3 semanas | Prototipagem e mockups |
| Desenvolvimento | 8 semanas | Codificação front/backend |
| Testes | 3 semanas | QA e testes integrados |
| Implantação | 2 semanas | Deploy e treinamento |

**Total: 18 semanas (~4,5 meses)**

---

## 9. PRÓXIMOS PASSOS

1. ✅ Especificação de Projeto (CONCLUÍDO)
2. ⏳ Criar protótipo funcional (EM PROGRESSO)
3. ⏳ Documentação técnica de API
4. ⏳ Desenvolver módulos back-end
5. ⏳ Testes de integração
6. ⏳ Implantação piloto

---

**Documento preparado para desenvolvimento.**

