# GUIA DE DESENVOLVIMENTO
## Sistema SISREG FLOW

---

## 1. PADRÕES DE CÓDIGO

### 1.1 Nomenclatura

**HTML (IDs e Classes):**
```
- Classes: kebab-case (ex: .form-container, .btn-primary)
- IDs: camelCase (ex: #patientForm, #submitBtn)
- Data attributes: data-kebab-case (ex: data-patient-id)
```

**JavaScript:**
```
- Funções: camelCase (ex: submitForm(), validateEmail())
- Constantes: UPPER_SNAKE_CASE (ex: MAX_RETRIES, API_URL)
- Variáveis: camelCase (ex: patientName, isValid)
- Classes: PascalCase (ex: PatientManager, FormValidator)
```

**CSS:**
```
- Classes: kebab-case (ex: .main-header, .card-container)
- IDs: camelCase ou kebab-case (ex: #mainContent)
- Variáveis CSS: --kebab-case (ex: --primary-color, --spacing-unit)
```

### 1.2 Estrutura de Pastas

```
sisreg-flow/
│
├── index.html              # Página principal
├── css/
│   ├── reset.css           # Reset de estilos padrão
│   ├── variables.css       # Variáveis CSS compartilhadas
│   ├── layout.css          # Estilos de layout e grid
│   ├── components.css      # Componentes reutilizáveis
│   ├── forms.css           # Estilos de formulários
│   └── responsive.css      # Media queries
├── js/
│   ├── main.js             # Script principal
│   ├── auth.js             # Autenticação e login
│   ├── patients.js         # Gerenciamento de pacientes
│   ├── referrals.js        # Gerenciamento de encaminhamentos
│   ├── scheduling.js       # Agendamentos
│   ├── utils.js            # Funções utilitárias
│   └── api.js              # Chamadas de API (futuro)
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── docs/
    ├── ESPECIFICACAO_PROJETO.md
    ├── ARQUITETURA_DADOS.md
    └── GUIA_DESENVOLVIMENTO.md
```

---

## 2. ARQUITETURA FRONTEND (MVC)

### 2.1 Model
```javascript
class Patient {
  constructor(data) {
    this.id = data.id;
    this.cpf = data.cpf;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
  }
  
  validate() {
    // Lógica de validação
  }
}
```

### 2.2 View
```javascript
class PatientView {
  renderForm() {
    // Renderizar formulário na DOM
  }
  
  displayPatients(patients) {
    // Exibir lista de pacientes
  }
}
```

### 2.3 Controller
```javascript
class PatientController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  
  addPatient(data) {
    // Lógica de negócio
  }
}
```

---

## 3. CONVENÇÕES DE CÓDIGO

### 3.1 HTML
```html
<!-- Use comentários descritivos -->
<!-- Seção: Formulário de Cadastro de Paciente -->
<form id="patientForm" class="form-container">
  <!-- Campo com nome descritivo -->
  <input 
    type="text" 
    id="patientName" 
    class="form-input"
    data-field="name"
    required
    aria-label="Nome completo do paciente"
  />
</form>

<!-- Sempre use atributos semânticos -->
<section class="main-content">
  <article class="referral-card">
    <header>
      <h2>Encaminhamento #5001</h2>
    </header>
  </article>
</section>
```

### 3.2 CSS
```css
/* Use variáveis para cores e espaçamento */
:root {
  --primary-color: #0066cc;
  --danger-color: #dc3545;
  --spacing-unit: 8px;
}

/* BEM (Block Element Modifier) */
.button {
  padding: calc(var(--spacing-unit) * 1.5);
}

.button__primary {
  background-color: var(--primary-color);
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile-first */
@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### 3.3 JavaScript
```javascript
// Use arrow functions e destructuring
const processData = ({ id, name, email }) => {
  return { id, name, email: email.toLowerCase() };
};

// Comentários para lógica complexa
// Verifica se o paciente tem prioridade urgente
const isUrgent = (priority) => priority === 'urgencia' || priority === 'emergencia';

// Eventos com tratamento de erro
document.getElementById('submitBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    // Lógica
  } catch (error) {
    console.error('Erro ao processar:', error);
  }
});

// Use const por padrão, let quando necessário
const MAX_RETRIES = 3;
let currentAttempt = 0;
```

---

## 4. COMENTÁRIOS NO CÓDIGO

### 4.1 Padrão de Comentários

```javascript
/**
 * Calcula o tempo médio de espera para uma especialidade
 * @param {string} specialty - ID da especialidade
 * @param {number} days - Número de dias para análise
 * @returns {number} Tempo médio em dias
 */
function calculateWaitTime(specialty, days) {
  // TODO: Integrar com API real
  // FIXME: Considerar sazonalidade
  // NOTE: Função pode ser otimizada com cache
  
  return days / 2; // Placeholder
}
```

### 4.2 Comentários HTML

```html
<!-- 
  Seção: Gerenciamento de Encaminhamentos
  Responsável: Equipe de Regulação
  Última atualização: 2026-05-18
-->
<section class="referrals-container" id="referralsSection">
  <!-- Campo de entrada para filtro de especialidade -->
  <input type="text" id="specialtyFilter" />
  
  <!-- Lista de encaminhamentos pendentes -->
  <ul id="referralsList" class="referrals-list"></ul>
</section>
```

---

## 5. TRATAMENTO DE ERROS

```javascript
// Classe personalizada para erros da aplicação
class AppError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}

// Uso
try {
  validatePatientData(data);
} catch (error) {
  if (error instanceof AppError) {
    console.error(`[${error.code}] ${error.message}`);
  }
}

// Exibir erros ao usuário
const showError = (message, duration = 5000) => {
  const errorEl = document.createElement('div');
  errorEl.className = 'alert alert--error';
  errorEl.textContent = message;
  document.body.appendChild(errorEl);
  
  setTimeout(() => errorEl.remove(), duration);
};
```

---

## 6. VALIDAÇÃO DE DADOS

```javascript
const validators = {
  // Validação de CPF
  cpf: (cpf) => {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.length === 11;
  },
  
  // Validação de email
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  // Validação de telefone
  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11;
  },
  
  // Validação de data
  date: (date) => {
    return !isNaN(Date.parse(date));
  }
};

// Uso
const isValid = validators.cpf('123.456.789-00');
```

---

## 7. ACESSIBILIDADE (A11Y)

```html
<!-- Use labels associados -->
<label for="patientEmail">Email do Paciente:</label>
<input 
  type="email" 
  id="patientEmail" 
  required
  aria-required="true"
/>

<!-- Use atributos ARIA para elementos dinâmicos -->
<button 
  aria-label="Fechar modal"
  aria-pressed="false"
  onclick="toggleModal()"
>
  ✕
</button>

<!-- Contraste de cores adequado -->
<!-- Use pelo menos 4.5:1 para texto pequeno -->

<!-- Suporte a navegação por teclado -->
<!-- Todos os controles devem ser acessíveis via Tab -->
```

---

## 8. PERFORMANCE

```javascript
// Debounce para eventos frequentes
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const handleSearch = debounce((query) => {
  searchPatients(query);
}, 500);

// Throttle para scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading de imagens
const images = document.querySelectorAll('img[data-src]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});
images.forEach(img => observer.observe(img));
```

---

## 9. BOAS PRÁTICAS

✅ **FAÇA:**
- Use const por padrão
- Adicione comentários para lógica complexa
- Valide dados no cliente E no servidor
- Use async/await em vez de callbacks
- Implemente tratamento de erros
- Teste componentes em diferentes resoluções
- Use semantic HTML
- Implemente autenticação segura

❌ **NÃO FAÇA:**
- Use var para declaração de variáveis
- Adicione múltiplos event listeners ao mesmo elemento
- Deixe console.log em produção
- Manipule DOM diretamente sem verificação
- Use setTimeout/setInterval sem controle
- Armazene senhas em localStorage
- Ignore tratamento de exceções

---

## 10. CHECKLIST PRÉ-PRODUÇÃO

- [ ] Código revisado por peer
- [ ] Testes unitários passando
- [ ] Console sem erros ou warnings
- [ ] Performance testada (Lighthouse >90)
- [ ] Compatibilidade com navegadores verificada
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Acessibilidade validada
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente configuradas
- [ ] Backup de dados implementado

