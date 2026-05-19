# 🚀 GUIA RÁPIDO DE INÍCIO - SISREG FLOW

Comece a usar o Sistema SISREG FLOW em 5 minutos!

---

## 📥 Passo 1: Preparar os Arquivos (2 minutos)

### Estrutura de Pastas Necessária:
```
sisreg-flow/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   └── user-avatar.jpg
│   └── icons/
└── README.md
```

### Como Organizar:
1. Crie uma pasta chamada `sisreg-flow`
2. Coloque `index.html` na raiz
3. Crie pasta `css/` e copie `styles.css`
4. Crie pasta `js/` e copie `main.js`
5. Crie pasta `assets/images/` com uma imagem de avatar

---

## 🌐 Passo 2: Abrir no Navegador (1 minuto)

### Opção A: Duplo Clique (Mais Simples)
1. Vá até a pasta do projeto
2. Duplo clique em `index.html`
3. O navegador abrirá automaticamente

### Opção B: Arrastar para Navegador
1. Abra seu navegador
2. Arraste o `index.html` para a janela
3. Pronto!

### Opção C: Com Servidor Local (Recomendado)

**Python 3:**
```bash
cd sisreg-flow
python -m http.server 8000
# Abra http://localhost:8000 no navegador
```

**Node.js:**
```bash
cd sisreg-flow
npx http-server
# Abra http://localhost:8080 no navegador
```

---

## 🎯 Passo 3: Conhecer a Interface (2 minutos)

### Layout Principal:
```
┌────────────────────────────────────────────┐
│     🏥 SISREG FLOW    🔔    👤 Usuário    │
├──────────────────────────────────────────────┤
│         │                                    │
│ SIDEBAR │         CONTEÚDO PRINCIPAL         │
│         │                                    │
│ ☐ Dashboard      (Visão geral)              │
│ ☐ Pacientes      (Gerenciar pacientes)      │
│ ☐ Encam.         (Gerenciar encaminhamentos)│
│ ☐ Agendamentos   (Agendar consultas)        │
│ ☐ Fila           (Monitorar fila)           │
│ ☐ Relatórios     (Gerar relatórios)         │
│                                              │
└────────────────────────────────────────────┘
```

### Elementos Principais:

**Cabeçalho (Header):**
- 🏥 Logo do sistema
- 🔔 Ícone de notificações
- 👤 Menu do usuário (dropdown)

**Barra Lateral (Sidebar):**
- Menu de navegação com 6 opções
- Informações do usuário logado
- Indicador de seção ativa

**Conteúdo (Main):**
- Muda conforme você clica no menu
- Contém formulários, tabelas e cards
- Responsivo para mobile/tablet

---

## 📊 Passo 4: Explorar as Páginas

### 1️⃣ Dashboard (Padrão)
**O que você vê:**
- 4 cards com estatísticas
- Gráfico placeholder
- Botões de ações rápidas

**O que fazer:**
- Clique em "Novo Encaminhamento" (abre formulário)
- Clique em "Ver Fila" (vai para página de fila)

### 2️⃣ Pacientes
**O que você vê:**
- Tabela com lista de pacientes
- Caixa de busca no topo
- Botão "Novo Paciente"

**O que fazer:**
- **Buscar:** Digite nome, CPF ou email na caixa de busca
- **Novo Paciente:** Clique no botão azul para abrir modal
- **Preencher formulário:** Nome, CPF, email, telefone, etc.
- **Salvar:** Clique em "Salvar Paciente"

### 3️⃣ Encaminhamentos
**O que você vê:**
- Cards de encaminhamentos
- Filtros (status e prioridade)
- Botões de ação por encaminhamento

**O que fazer:**
- **Filtrar:** Selecione status ou prioridade nos dropdowns
- **Aprovar:** Clique em "Aprovar" para autorizar
- **Rejeitar:** Clique em "Rejeitar" para negar
- **Informações:** Clique em "Solicitar Info" para pedir mais dados

### 4️⃣ Agendamentos
**O que você vê:**
- Formulário de novo agendamento (esquerda)
- Lista de próximos agendamentos (direita)

**O que fazer:**
- Preencha o formulário com:
  - Paciente (nome)
  - Especialidade
  - Data da consulta
  - Horário
  - Local
- Clique em "Agendar"
- Veja a consulta aparecer na lista

### 5️⃣ Fila de Espera
**O que você vê:**
- Cards da fila com posição
- Informações de cada paciente
- Tempo de espera

**O que fazer:**
- **Filtrar:** Selecione especialidade no dropdown
- **Agendar:** Clique em "Agendar" para agendamento rápido
- **Detalhes:** Clique em "Detalhes" para ver mais info

### 6️⃣ Relatórios
**O que você vê:**
- Botões para diferentes relatórios
- Área de visualização de gráficos

**O que fazer:**
- Clique em um dos botões:
  - 📊 Ocupação de Vagas
  - ⏳ Tempo de Espera
  - 👥 Faltas a Consultas
  - 📋 Auditoria

---

## 🎨 Dicas de Design

### Cores e Significados:
- 🔵 **Azul** = Ação primária (botão importante)
- ⚪ **Cinza** = Ação secundária
- 🟢 **Verde** = Sucesso/Autorizado
- 🔴 **Vermelho** = Perigo/Rejeição
- 🟡 **Amarelo** = Aviso/Pendente

### Ícones Usados:
- 🏥 Hospital (logo)
- 📊 Dashboard
- 👥 Pacientes
- 📄 Documentos/Encaminhamentos
- 📅 Calendário/Agendamentos
- 📋 Lista/Fila
- 📈 Relatórios
- ✅ Aprova/Sucesso
- ❌ Nega/Erro

---

## 📝 Exemplos de Uso Real

### Exemplo 1: Cadastrar um Novo Paciente
```
1. Clique em "Pacientes" no menu lateral
2. Clique no botão azul "Novo Paciente"
3. Preencha o formulário:
   - Nome: João Silva
   - CPF: 123.456.789-00
   - Email: joao@email.com
   - Telefone: (81) 98765-4321
4. Clique em "Salvar Paciente"
5. Veja a notificação verde de sucesso
```

### Exemplo 2: Aprovar um Encaminhamento
```
1. Clique em "Encaminhamentos" no menu lateral
2. Localize o encaminhamento pendente
3. Clique no botão verde "Aprovar"
4. Veja o status mudar para "Autorizado"
5. Receba notificação de sucesso
```

### Exemplo 3: Agendar uma Consulta
```
1. Clique em "Agendamentos" no menu lateral
2. Preencha o formulário à esquerda:
   - Paciente: João Silva
   - Especialidade: Cardiologia
   - Data: 25/05/2026
   - Horário: 09:00
   - Local: Hospital Central
3. Clique em "Agendar"
4. Veja a consulta aparecer na lista à direita
```

---

## 🔧 Personalizações Rápidas

### Mudar a Cor do Sistema

Abra `css/styles.css` e procure por:

```css
--primary-color: #0066cc;  /* Azul padrão */
```

Altere para a cor desejada:
```css
--primary-color: #cc0000;  /* Vermelho */
--primary-color: #00cc00;  /* Verde */
--primary-color: #ff9900;  /* Laranja */
```

### Mudar o Nome do Sistema

Abra `index.html` e procure por:

```html
<h1 class="brand-name">SISREG FLOW</h1>
```

Altere para:
```html
<h1 class="brand-name">MEU SISTEMA</h1>
```

### Mudar o Logo

Abra `index.html` e procure por:

```html
<i class="fas fa-hospital"></i>
```

Vá em [Font Awesome](https://fontawesome.com) e escolha outro ícone, depois altere `fa-hospital` para o novo nome.

---

## ⚠️ Troubleshooting Rápido

### P: A página abre mas está feia (sem cores)
**R:** O arquivo CSS não carregou. Verifique:
- Se `css/styles.css` existe
- Se o caminho em `index.html` está correto
- Limpe o cache (Ctrl+Shift+Del)

### P: Os botões não funcionam
**R:** O JavaScript não carregou. Verifique:
- Se `js/main.js` existe
- Se o caminho em `index.html` está correto
- Abra o console (F12) para ver erros

### P: Os modais não abrem
**R:** Pode ser um erro de JavaScript. Verifique:
- Abra o console (F12)
- Procure por "Uncaught Error"
- Verifique se os IDs dos botões estão corretos

### P: A tabela de pacientes está vazia
**R:** Pode ser que os dados não carregaram. Tente:
- Recarregar a página (F5)
- Abrir o console (F12) e verificar se há erros
- Verificar se `js/main.js` está sendo carregado

---

## 🎓 Próximos Passos

Depois de explorar o sistema básico:

1. **Ler a documentação completa:**
   - Abra `README.md`
   - Leia `01_ESPECIFICACAO_PROJETO.md`

2. **Entender a arquitetura:**
   - Leia `02_ARQUITETURA_DADOS.md`
   - Entenda o fluxo de dados

3. **Aprender a personalizar:**
   - Leia `03_GUIA_DESENVOLVIMENTO.md`
   - Modifique o CSS e JS

4. **Conectar a um backend real:**
   - Configure um servidor Node/Python
   - Crie a API REST
   - Integre com banco de dados

---

## 📚 Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| F12 | Abrir Developer Tools |
| Ctrl+Shift+Del | Limpar cache |
| Ctrl+R | Recarregar página |
| Tab | Navegar entre elementos |
| Enter | Ativar botão/link |
| Escape | Fechar modal |

---

## 🆘 Precisa de Ajuda?

1. **Leia o README.md** - Tem respostas para muitas dúvidas
2. **Verifique o console (F12)** - Mostra erros
3. **Procure nos comentários do código** - Explicações úteis
4. **Consulte a documentação** - Detalhes técnicos

---

## ✨ Dicas Profissionais

✅ **FAÇA:**
- Sempre trabalhe com servidor local
- Use o DevTools (F12) regularmente
- Leia o console para mensagens de erro
- Faça backup antes de grandes mudanças
- Teste em diferentes dispositivos

❌ **NÃO FAÇA:**
- Deixar console.log em código final
- Guardar senhas no código
- Mudar muitos arquivos de uma vez
- Ignorar mensagens de erro
- Esquecer de atualizar documentação

---

## 🎉 Pronto para Começar!

Você tem tudo que precisa para:
- ✅ Explorar o sistema
- ✅ Testar funcionalidades
- ✅ Personalizar cores e textos
- ✅ Entender a arquitetura
- ✅ Começar o desenvolvimento

---

**Boa diversão desenvolvendo com SISREG FLOW! 🏥✨**

*Última atualização: Maio 2026*
*Versão: 1.0.0*
