/**
 * =====================================================
 * REGULASUS — DATA.JS
 * Dados mock e configuração da aplicação
 * =====================================================
 */

'use strict';

// -----------------------------------------------
// CONFIGURAÇÃO GLOBAL
// -----------------------------------------------

const APP_CONFIG = {
    APP_NAME: 'REGULASUS',
    VERSION: '1.0.0',
    DEBUG: false,
    ITEMS_PER_PAGE: 10,
    TOAST_DURATION: 4000
};

// -----------------------------------------------
// DADOS: PACIENTES
// -----------------------------------------------

const MOCK_PATIENTS = [
    {
        id: 1,
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        email: 'joao.silva@email.com',
        phone: '(81) 98765-4321',
        birthDate: '1978-03-15',
        gender: 'M',
        address: 'Rua das Flores, 123',
        neighborhood: 'Boa Viagem',
        city: 'Recife',
        registrationDate: '2026-05-15',
        status: 'ativo'
    },
    {
        id: 2,
        name: 'Maria Oliveira Costa',
        cpf: '987.654.321-00',
        email: 'maria.costa@email.com',
        phone: '(81) 99876-5432',
        birthDate: '1985-07-22',
        gender: 'F',
        address: 'Av. Agamenon Magalhães, 456',
        neighborhood: 'Derby',
        city: 'Recife',
        registrationDate: '2026-05-10',
        status: 'ativo'
    },
    {
        id: 3,
        name: 'Pedro Ferreira Alves',
        cpf: '456.789.123-00',
        email: 'pedro.alves@email.com',
        phone: '(81) 97654-3210',
        birthDate: '1992-11-05',
        gender: 'M',
        address: 'Rua do Hospício, 789',
        neighborhood: 'Boa Vista',
        city: 'Recife',
        registrationDate: '2026-04-20',
        status: 'ativo'
    },
    {
        id: 4,
        name: 'Ana Paula Mendes',
        cpf: '321.654.987-00',
        email: 'ana.mendes@email.com',
        phone: '(81) 96543-2109',
        birthDate: '1990-04-18',
        gender: 'F',
        address: 'Rua da Aurora, 321',
        neighborhood: 'Soledade',
        city: 'Recife',
        registrationDate: '2026-05-24',
        status: 'ativo'
    },
    {
        id: 5,
        name: 'Carlos Eduardo Lima',
        cpf: '654.321.098-00',
        email: 'carlos.lima@email.com',
        phone: '(81) 95432-1098',
        birthDate: '1965-09-30',
        gender: 'M',
        address: 'Av. Conde da Boa Vista, 654',
        neighborhood: 'Boa Vista',
        city: 'Recife',
        registrationDate: '2026-03-12',
        status: 'ativo'
    }
];

// -----------------------------------------------
// DADOS: ENCAMINHAMENTOS
// -----------------------------------------------

const MOCK_REFERRALS = [
    {
        id: 5001,
        patientId: 1,
        patientName: 'João Silva Santos',
        specialty: 'Cardiologia',
        doctor: 'Dra. Maria Oliveira',
        unit: 'UBS Centro',
        diagnosis: 'Dor no peito — avaliação cardiológica urgente',
        priority: 'urgencia',
        status: 'pendente',
        date: '2026-05-15 10:30',
        notes: 'Paciente relata dor precordial há 3 dias. ECG alterado.'
    },
    {
        id: 5002,
        patientId: 2,
        patientName: 'Maria Oliveira Costa',
        specialty: 'Oftalmologia',
        doctor: 'Dr. Carlos Silva',
        unit: 'UBS Boa Viagem',
        diagnosis: 'Redução progressiva de visão bilateral',
        priority: 'rotina',
        status: 'autorizado',
        date: '2026-05-14 14:00',
        notes: 'Acuidade visual reduzida. Suspeita de catarata.'
    },
    {
        id: 5003,
        patientId: 3,
        patientName: 'Pedro Ferreira Alves',
        specialty: 'Ortopedia',
        doctor: 'Dr. Roberto Santos',
        unit: 'UBS Norte',
        diagnosis: 'Dor no joelho direito — suspeita de lesão meniscal',
        priority: 'urgencia',
        status: 'agendado',
        date: '2026-05-13 09:15',
        notes: 'Dor intensa ao caminhar. RX sem fratura aparente.'
    }
];

// -----------------------------------------------
// DADOS: FILA DE ESPERA
// -----------------------------------------------

const MOCK_QUEUE = [
    {
        id: 1,
        position: 1,
        patientName: 'João Silva Santos',
        specialty: 'Cardiologia',
        priority: 'urgencia',
        entryDate: '2026-05-13',
        daysInQueue: 11,
        referralId: 5001
    },
    {
        id: 2,
        position: 2,
        patientName: 'Ana Paula Mendes',
        specialty: 'Cardiologia',
        priority: 'media',
        entryDate: '2026-05-12',
        daysInQueue: 12,
        referralId: null
    },
    {
        id: 3,
        position: 3,
        patientName: 'Lucas Gomes',
        specialty: 'Cardiologia',
        priority: 'baixa',
        entryDate: '2026-05-10',
        daysInQueue: 14,
        referralId: null
    },
    {
        id: 4,
        position: 4,
        patientName: 'Fernanda Castro',
        specialty: 'Oftalmologia',
        priority: 'rotina',
        entryDate: '2026-05-08',
        daysInQueue: 16,
        referralId: null
    },
    {
        id: 5,
        position: 5,
        patientName: 'Roberto Nunes',
        specialty: 'Ortopedia',
        priority: 'urgencia',
        entryDate: '2026-05-18',
        daysInQueue: 6,
        referralId: null
    }
];

// -----------------------------------------------
// DADOS: AGENDAMENTOS PRÓXIMOS
// -----------------------------------------------

const MOCK_SCHEDULES = [
    {
        id: 1,
        patient: 'João Silva Santos',
        specialty: 'Cardiologia',
        date: '2026-05-28',
        time: '09:00',
        location: 'Hospital Central do Recife',
        priority: 'urgencia',
        status: 'confirmado'
    },
    {
        id: 2,
        patient: 'Maria Oliveira Costa',
        specialty: 'Oftalmologia',
        date: '2026-06-02',
        time: '14:30',
        location: 'Ambulatório Norte',
        priority: 'rotina',
        status: 'pendente'
    }
];

// -----------------------------------------------
// DADOS: GRÁFICOS
// -----------------------------------------------

const CHART_DATA = {
    // Encaminhamentos por especialidade (últimos 30 dias)
    specialtyReferrals: {
        labels: ['Cardiologia', 'Oftalmologia', 'Ortopedia', 'Dermatologia', 'Neurologia', 'Endocrinologia'],
        values: [68, 45, 52, 38, 29, 13]
    },

    // Tendência mensal (últimos 6 meses)
    monthlyTrend: {
        labels: ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        referrals:   [198, 215, 189, 230, 241, 245],
        scheduled:   [142, 160, 145, 178, 185, 189]
    },

    // Ocupação por especialidade
    occupancyBySpecialty: {
        labels: ['Cardiologia', 'Oftalmologia', 'Ortopedia', 'Outros'],
        values: [92, 78, 85, 70]
    },

    // Relatório: Ocupação de vagas por mês
    occupancyReport: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        occupied:  [280, 265, 290, 275, 278],
        available: [40, 55, 30, 45, 42]
    },

    // Relatório: Tempo de espera por especialidade
    waitTimeReport: {
        labels: ['Cardiologia', 'Oftalmologia', 'Ortopedia', 'Dermatologia', 'Neurologia'],
        avgDays: [22, 14, 18, 10, 30]
    },

    // Relatório: Faltas por mês
    absencesReport: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        absences:   [28, 32, 25, 38, 34],
        attended:   [220, 215, 230, 210, 244]
    }
};
