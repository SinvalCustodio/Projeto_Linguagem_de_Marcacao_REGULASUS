/**
 * =====================================================
 * REGULASUS — CHARTS.JS
 * Configuração e renderização de gráficos (Chart.js)
 * =====================================================
 */

'use strict';

// Configurações globais do Chart.js
Chart.defaults.font.family = "'Inter', 'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#64748b';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b';
Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';

// Paleta de cores da aplicação
const CHART_COLORS = {
    primary:  '#2563eb',
    success:  '#16a34a',
    warning:  '#d97706',
    danger:   '#dc2626',
    info:     '#0891b2',
    purple:   '#9333ea',
    orange:   '#ea580c',
    gray:     '#64748b',

    // Versões com transparência
    primaryAlpha: (a) => `rgba(37, 99, 235, ${a})`,
    successAlpha: (a) => `rgba(22, 163, 74, ${a})`,
    warningAlpha: (a) => `rgba(217, 119, 6, ${a})`,
    dangerAlpha:  (a) => `rgba(220, 38, 38, ${a})`,
    infoAlpha:    (a) => `rgba(8, 145, 178, ${a})`,
    purpleAlpha:  (a) => `rgba(147, 51, 234, ${a})`,
    orangeAlpha:  (a) => `rgba(234, 88, 12, ${a})`
};

// Armazenamento de instâncias de gráficos
const chartInstances = {};

/**
 * Destrói um gráfico existente antes de recriar
 * @param {string} id
 */
function destroyChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

/**
 * Gráfico de encaminhamentos por especialidade (Barras)
 */
function renderSpecialtyChart() {
    const ctx = document.getElementById('specialtyChart');
    if (!ctx) return;

    destroyChart('specialty');

    const data = CHART_DATA.specialtyReferrals;

    chartInstances['specialty'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Encaminhamentos',
                data: data.values,
                backgroundColor: [
                    CHART_COLORS.primaryAlpha(0.85),
                    CHART_COLORS.infoAlpha(0.85),
                    CHART_COLORS.successAlpha(0.85),
                    CHART_COLORS.warningAlpha(0.85),
                    CHART_COLORS.purpleAlpha(0.85),
                    CHART_COLORS.orangeAlpha(0.85)
                ],
                borderColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.info,
                    CHART_COLORS.success,
                    CHART_COLORS.warning,
                    CHART_COLORS.purple,
                    CHART_COLORS.orange
                ],
                borderWidth: 1.5,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y} encaminhamentos`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(226, 232, 240, 0.6)' },
                    ticks: {
                        stepSize: 20,
                        callback: val => val
                    }
                }
            }
        }
    });
}

/**
 * Gráfico de tendência mensal (Linha)
 */
function renderTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    destroyChart('trend');

    const data = CHART_DATA.monthlyTrend;

    chartInstances['trend'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Encaminhamentos',
                    data: data.referrals,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: CHART_COLORS.primaryAlpha(0.08),
                    borderWidth: 2.5,
                    pointBackgroundColor: CHART_COLORS.primary,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Agendados',
                    data: data.scheduled,
                    borderColor: CHART_COLORS.success,
                    backgroundColor: CHART_COLORS.successAlpha(0.06),
                    borderWidth: 2.5,
                    pointBackgroundColor: CHART_COLORS.success,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(226, 232, 240, 0.6)' },
                    ticks: { stepSize: 30 }
                }
            }
        }
    });
}

/**
 * Gráfico de ocupação por especialidade (Rosca)
 */
function renderOccupancyChart() {
    const ctx = document.getElementById('occupancyChart');
    if (!ctx) return;

    destroyChart('occupancy');

    const data = CHART_DATA.occupancyBySpecialty;

    chartInstances['occupancy'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.info,
                    CHART_COLORS.success,
                    CHART_COLORS.gray
                ],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, font: { size: 11 } }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed}% ocupação`
                    }
                }
            }
        }
    });
}

// -----------------------------------------------
// GRÁFICOS DE RELATÓRIOS
// -----------------------------------------------

/**
 * Gráfico de ocupação de vagas (Relatório)
 */
function renderOccupancyReportChart() {
    const ctx = document.getElementById('occupancyReportChart');
    if (!ctx) return;

    destroyChart('occupancyReport');

    const data = CHART_DATA.occupancyReport;

    chartInstances['occupancyReport'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Vagas Ocupadas',
                    data: data.occupied,
                    backgroundColor: CHART_COLORS.primaryAlpha(0.85),
                    borderColor: CHART_COLORS.primary,
                    borderWidth: 1.5,
                    borderRadius: 6
                },
                {
                    label: 'Vagas Disponíveis',
                    data: data.available,
                    backgroundColor: CHART_COLORS.successAlpha(0.75),
                    borderColor: CHART_COLORS.success,
                    borderWidth: 1.5,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', align: 'end' } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(226, 232, 240, 0.6)' }
                }
            }
        }
    });
}

/**
 * Gráfico de tempo médio de espera (Relatório)
 */
function renderWaitTimeChart() {
    const ctx = document.getElementById('waitTimeChart');
    if (!ctx) return;

    destroyChart('waitTime');

    const data = CHART_DATA.waitTimeReport;

    chartInstances['waitTime'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Dias de Espera',
                data: data.avgDays,
                backgroundColor: [
                    CHART_COLORS.dangerAlpha(0.8),
                    CHART_COLORS.infoAlpha(0.8),
                    CHART_COLORS.warningAlpha(0.8),
                    CHART_COLORS.successAlpha(0.8),
                    CHART_COLORS.purpleAlpha(0.8)
                ],
                borderColor: [
                    CHART_COLORS.danger,
                    CHART_COLORS.info,
                    CHART_COLORS.warning,
                    CHART_COLORS.success,
                    CHART_COLORS.purple
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.y} dias em média`
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(226, 232, 240, 0.6)' },
                    ticks: { callback: val => `${val}d` }
                }
            }
        }
    });
}

/**
 * Gráfico de faltas/comparecimentos (Relatório)
 */
function renderAbsencesChart() {
    const ctx = document.getElementById('absencesChart');
    if (!ctx) return;

    destroyChart('absences');

    const data = CHART_DATA.absencesReport;

    chartInstances['absences'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Comparecimentos',
                    data: data.attended,
                    borderColor: CHART_COLORS.success,
                    backgroundColor: CHART_COLORS.successAlpha(0.08),
                    borderWidth: 2.5,
                    pointBackgroundColor: CHART_COLORS.success,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Faltas',
                    data: data.absences,
                    borderColor: CHART_COLORS.danger,
                    backgroundColor: CHART_COLORS.dangerAlpha(0.06),
                    borderWidth: 2.5,
                    pointBackgroundColor: CHART_COLORS.danger,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top', align: 'end' } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(226, 232, 240, 0.6)' }
                }
            }
        }
    });
}

/**
 * Inicializa todos os gráficos do dashboard
 */
function initDashboardCharts() {
    renderSpecialtyChart();
    renderTrendChart();
    renderOccupancyChart();
}

/**
 * Inicializa gráficos de relatório por aba
 * @param {string} tab
 */
function initReportCharts(tab) {
    switch (tab) {
        case 'occupancy':
            setTimeout(renderOccupancyReportChart, 50);
            break;
        case 'waittime':
            setTimeout(renderWaitTimeChart, 50);
            break;
        case 'absences':
            setTimeout(renderAbsencesChart, 50);
            break;
    }
}
