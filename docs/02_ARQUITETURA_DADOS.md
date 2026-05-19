# ARQUITETURA DE DADOS
## Sistema SISREG FLOW

---

## 1. ENTIDADES PRINCIPAIS E RELACIONAMENTOS

### 1.1 Tabela: PACIENTES
```
paciente_id (PK)        → INT AUTO_INCREMENT PRIMARY KEY
cpf                     → VARCHAR(11) UNIQUE NOT NULL
nome_completo           → VARCHAR(255) NOT NULL
data_nascimento         → DATE NOT NULL
sexo                    → ENUM('M', 'F', 'O') NOT NULL
email                   → VARCHAR(255) UNIQUE
telefone                → VARCHAR(11) NOT NULL
endereco_completo       → VARCHAR(500)
bairro                  → VARCHAR(100)
cidade                  → VARCHAR(100)
cep                     → VARCHAR(8)
nome_responsavel        → VARCHAR(255)
telefone_responsavel    → VARCHAR(11)
data_cadastro           → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
status                  → ENUM('ativo', 'inativo', 'falecido')
```

### 1.2 Tabela: USUARIOS
```
usuario_id (PK)         → INT AUTO_INCREMENT PRIMARY KEY
nome                    → VARCHAR(255) NOT NULL
email                   → VARCHAR(255) UNIQUE NOT NULL
senha_hash              → VARCHAR(255) NOT NULL
cpf                     → VARCHAR(11) UNIQUE
tipo_usuario            → ENUM('ubs', 'regulador', 'hospital', 'admin', 'paciente')
unidade_id (FK)         → INT (referencia UNIDADES)
data_criacao            → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ultimo_acesso           → TIMESTAMP
ativo                   → BOOLEAN DEFAULT TRUE
```

### 1.3 Tabela: UNIDADES_SAUDE
```
unidade_id (PK)         → INT AUTO_INCREMENT PRIMARY KEY
nome                    → VARCHAR(255) NOT NULL
tipo                    → ENUM('ubs', 'ambulatorio', 'hospital')
cnes                    → VARCHAR(20) UNIQUE NOT NULL
endereco                → VARCHAR(500) NOT NULL
telefone                → VARCHAR(11) NOT NULL
email                   → VARCHAR(255)
cidade                  → VARCHAR(100) NOT NULL
ente_federativo         → ENUM('estado', 'municipal', 'privado')
convenio_sus            → BOOLEAN DEFAULT TRUE
capacidade_diaria       → INT
data_cadastro           → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ativo                   → BOOLEAN DEFAULT TRUE
```

### 1.4 Tabela: ESPECIALIDADES
```
especialidade_id (PK)   → INT AUTO_INCREMENT PRIMARY KEY
nome                    → VARCHAR(255) NOT NULL UNIQUE
descricao               → TEXT
tempo_medio_consulta    → INT (em minutos)
tempo_espera_medio      → INT (em dias) - estimativa
nivel_urgencia          → ENUM('baixo', 'medio', 'alto')
ativo                   → BOOLEAN DEFAULT TRUE
```

### 1.5 Tabela: ENCAMINHAMENTOS
```
encaminhamento_id (PK)  → INT AUTO_INCREMENT PRIMARY KEY
paciente_id (FK)        → INT (referencia PACIENTES)
ubs_origem_id (FK)      → INT (referencia UNIDADES_SAUDE)
especialidade_id (FK)   → INT (referencia ESPECIALIDADES)
medico_encaminhador     → VARCHAR(255) NOT NULL
diagnostico_provisorio  → TEXT NOT NULL
motivo_solicitacao      → TEXT NOT NULL
prioridade              → ENUM('rotina', 'urgencia', 'emergencia')
data_encaminhamento     → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
status                  → ENUM('pendente', 'autorizado', 'rejeitado', 'agendado', 'realizado', 'cancelado')
observacoes             → TEXT
data_criacao            → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### 1.6 Tabela: AUDITORIA_REGULACAO
```
auditoria_id (PK)       → INT AUTO_INCREMENT PRIMARY KEY
encaminhamento_id (FK)  → INT (referencia ENCAMINHAMENTOS)
medico_regulador_id (FK)→ INT (referencia USUARIOS)
data_avaliacao          → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
resultado               → ENUM('autorizado', 'rejeitado', 'pedindo_complementacao')
justificativa           → TEXT
documentos_solicitados  → TEXT
prioridade_final        → ENUM('baixa', 'media', 'alta', 'urgente')
```

### 1.7 Tabela: AGENDAS
```
agenda_id (PK)          → INT AUTO_INCREMENT PRIMARY KEY
unidade_id (FK)         → INT (referencia UNIDADES_SAUDE)
especialidade_id (FK)   → INT (referencia ESPECIALIDADES)
data_agenda             → DATE NOT NULL
turno                   → ENUM('manha', 'tarde', 'noite')
vagas_totais            → INT NOT NULL
vagas_disponiveis       → INT NOT NULL
data_criacao            → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
bloqueada               → BOOLEAN DEFAULT FALSE
motivo_bloqueio         → VARCHAR(255)
```

### 1.8 Tabela: AGENDAMENTOS
```
agendamento_id (PK)     → INT AUTO_INCREMENT PRIMARY KEY
encaminhamento_id (FK)  → INT (referencia ENCAMINHAMENTOS)
agenda_id (FK)          → INT (referencia AGENDAS)
paciente_id (FK)        → INT (referencia PACIENTES)
unidade_destino_id (FK) → INT (referencia UNIDADES_SAUDE)
data_agendamento        → TIMESTAMP
horario_agendado        → TIME
sala_consulta           → VARCHAR(10)
medico_agendado         → VARCHAR(255)
status                  → ENUM('confirmado', 'cancelado', 'realizado', 'nao_compareceu', 'remarcado')
data_criacao            → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
data_notificacao        → TIMESTAMP
motivo_cancelamento     → TEXT
```

### 1.9 Tabela: FILA_ESPERA
```
fila_id (PK)            → INT AUTO_INCREMENT PRIMARY KEY
encaminhamento_id (FK)  → INT (referencia ENCAMINHAMENTOS)
paciente_id (FK)        → INT (referencia PACIENTES)
especialidade_id (FK)   → INT (referencia ESPECIALIDADES)
posicao_fila            → INT NOT NULL
data_entrada_fila       → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
prioridade_clinica      → ENUM('baixa', 'media', 'alta', 'urgente')
tempo_espera_dias       → INT
data_cancelamento       → TIMESTAMP
motivo_cancelamento     → TEXT
```

### 1.10 Tabela: NOTIFICACOES
```
notificacao_id (PK)     → INT AUTO_INCREMENT PRIMARY KEY
paciente_id (FK)        → INT (referencia PACIENTES)
agendamento_id (FK)     → INT (referencia AGENDAMENTOS)
tipo_notificacao        → ENUM('email', 'sms', 'whatsapp')
mensagem                → TEXT NOT NULL
data_envio              → TIMESTAMP DEFAULT CURRENT_TIMESTAMP
lida                    → BOOLEAN DEFAULT FALSE
status_envio            → ENUM('enviada', 'falha', 'entregue')
```

---

## 2. DIAGRAMA DE RELACIONAMENTOS (MER)

```
PACIENTES
    │
    ├─→ ENCAMINHAMENTOS
    │       │
    │       ├─→ ESPECIALIDADES
    │       ├─→ AUDITORIA_REGULACAO
    │       │       └─→ USUARIOS (médico regulador)
    │       ├─→ AGENDAMENTOS
    │       │       ├─→ AGENDAS
    │       │       │   ├─→ UNIDADES_SAUDE
    │       │       │   └─→ ESPECIALIDADES
    │       │       └─→ NOTIFICACOES
    │       │
    │       └─→ FILA_ESPERA
    │           └─→ ESPECIALIDADES
    │
    └─→ USUARIOS (paciente)

UNIDADES_SAUDE
    │
    ├─→ USUARIOS (funcionários)
    ├─→ AGENDAS
    │   └─→ ESPECIALIDADES
    │
    └─→ ENCAMINHAMENTOS (origem)
```

---

## 3. TABELA DE EXEMPLO: DADOS DE TESTE

### Paciente Exemplo
```json
{
  "paciente_id": 1001,
  "cpf": "12345678901",
  "nome_completo": "João Silva Santos",
  "data_nascimento": "1978-03-15",
  "sexo": "M",
  "email": "joao.silva@email.com",
  "telefone": "81987654321",
  "endereco_completo": "Rua das Flores, 123",
  "bairro": "Boa Vista",
  "cidade": "Recife",
  "cep": "50050360",
  "status": "ativo"
}
```

### Encaminhamento Exemplo
```json
{
  "encaminhamento_id": 5001,
  "paciente_id": 1001,
  "ubs_origem_id": 2001,
  "especialidade_id": 101,
  "medico_encaminhador": "Dra. Maria Oliveira",
  "diagnostico_provisorio": "Dor crônica nas costas",
  "motivo_solicitacao": "Avaliação por especialista em coluna",
  "prioridade": "urgencia",
  "status": "pendente",
  "data_encaminhamento": "2026-05-15 10:30:00"
}
```

---

## 4. ÍNDICES PRINCIPAIS

```sql
CREATE INDEX idx_paciente_cpf ON PACIENTES(cpf);
CREATE INDEX idx_usuario_email ON USUARIOS(email);
CREATE INDEX idx_encaminhamento_status ON ENCAMINHAMENTOS(status);
CREATE INDEX idx_encaminhamento_data ON ENCAMINHAMENTOS(data_encaminhamento);
CREATE INDEX idx_fila_posicao ON FILA_ESPERA(posicao_fila);
CREATE INDEX idx_agendamento_data ON AGENDAMENTOS(data_agendamento);
CREATE INDEX idx_notificacao_paciente ON NOTIFICACOES(paciente_id);
```

---

## 5. INTEGRIDADE REFERENCIAL

- Todas as FK referem-se a PK de suas respectivas tabelas
- Cascata DELETE em relacionamentos apropriados
- Validação de datas e tipos ENUM
- Constraints de unicidade em campos identificadores

---

## 6. SEGURANÇA DE DADOS

- Senhas armazenadas com hash (bcrypt, argon2)
- CPF e dados sensíveis criptografados em repouso
- Logs de auditoria para qualquer alteração crítica
- Backup automático diário
- Replicação de dados para alta disponibilidade

