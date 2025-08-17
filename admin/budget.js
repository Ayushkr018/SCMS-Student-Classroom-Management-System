// Theme Management - Consistent with Dashboard
function initializeTheme() {
    const savedTheme = localStorage.getItem('scms-theme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeIcon = document.getElementById('themeIcon');
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const themeSwitch = document.getElementById('themeSwitch');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('scms-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-moon';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        if (themeSwitch) themeSwitch.classList.remove('active');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scms-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (mobileThemeIcon) mobileThemeIcon.className = 'fas fa-sun';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        if (themeSwitch) themeSwitch.classList.add('active');
    }
}

// Mobile Sidebar Management
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Demo Data for Hackathon Presentation
const DEMO_INCOME_DATA = [
    {
        category: 'Tuition Fees',
        amount: 875000,
        description: 'Spring semester tuition fees from 1,200 students',
        dateAdded: '8/1/2025'
    },
    {
        category: 'Government Grants',
        amount: 450000,
        description: 'Federal education development grant',
        dateAdded: '8/2/2025'
    },
    {
        category: 'Private Donations',
        amount: 125000,
        description: 'Alumni donation for library renovation',
        dateAdded: '8/5/2025'
    },
    {
        category: 'Research Funding',
        amount: 280000,
        description: 'NSF research grant for AI laboratory',
        dateAdded: '8/8/2025'
    },
    {
        category: 'Event Revenue',
        amount: 45000,
        description: 'Annual tech fest and cultural events',
        dateAdded: '8/10/2025'
    },
    {
        category: 'Other Income',
        amount: 75000,
        description: 'Consulting services and partnerships',
        dateAdded: '8/12/2025'
    }
];

const DEMO_EXPENSE_DATA = [
    {
        category: 'Staff Salaries',
        amount: 620000,
        description: 'Monthly salaries for 85 faculty and staff members',
        dateAdded: '8/1/2025'
    },
    {
        category: 'Infrastructure',
        amount: 180000,
        description: 'Campus building maintenance and renovations',
        dateAdded: '8/3/2025'
    },
    {
        category: 'Utilities',
        amount: 85000,
        description: 'Electricity, water, internet, and heating costs',
        dateAdded: '8/4/2025'
    },
    {
        category: 'Academic Supplies',
        amount: 120000,
        description: 'Books, laboratory equipment, and learning materials',
        dateAdded: '8/6/2025'
    },
    {
        category: 'Technology',
        amount: 95000,
        description: 'Computer hardware, software licenses, and IT support',
        dateAdded: '8/7/2025'
    },
    {
        category: 'Maintenance',
        amount: 45000,
        description: 'Equipment servicing and campus upkeep',
        dateAdded: '8/9/2025'
    },
    {
        category: 'Transportation',
        amount: 35000,
        description: 'Student bus services and field trip expenses',
        dateAdded: '8/11/2025'
    },
    {
        category: 'Other Expenses',
        amount: 55000,
        description: 'Insurance, legal fees, and miscellaneous costs',
        dateAdded: '8/13/2025'
    }
];

// Enhanced Budget Manager Class
class EnhancedBudgetManager {
    constructor() {
        this.income = [];
        this.expenses = [];
        this.chart = null;
        this.chartType = 'doughnut';
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.initChart();
        this.loadCurrentUser();

        // Auto-load demo data if no existing data
        if (this.income.length === 0 && this.expenses.length === 0) {
            this.loadDemoDataSilently();
        }
    }

    loadCurrentUser() {
        const currentUser = localStorage.getItem('scms_current_user');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = user.name;
        } else {
            // Set default user for demo
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = 'Dr. Sarah Johnson';
        }
    }

    loadDemoDataSilently() {
        // Load demo data without notifications
        DEMO_INCOME_DATA.forEach((item, index) => {
            this.income.push({
                id: Date.now() + index,
                category: item.category,
                amount: item.amount,
                description: item.description,
                dateAdded: item.dateAdded,
                timestamp: new Date()
            });
        });

        DEMO_EXPENSE_DATA.forEach((item, index) => {
            this.expenses.push({
                id: Date.now() + 1000 + index,
                category: item.category,
                amount: item.amount,
                description: item.description,
                dateAdded: item.dateAdded,
                timestamp: new Date()
            });
        });

        this.saveData();
        this.updateDisplay();
        this.updateInsights();
    }

    setupEventListeners() {
        document.getElementById('incomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addIncome();
        });

        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Close mobile sidebar on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        });
    }

    addIncome() {
        const category = document.getElementById('incomeCategory').value.trim();
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const description = document.getElementById('incomeDescription').value.trim();

        if (category && amount > 0) {
            const newIncome = {
                id: Date.now(),
                category,
                amount,
                description: description || 'No description provided',
                dateAdded: new Date().toLocaleDateString(),
                timestamp: new Date()
            };

            this.income.push(newIncome);
            this.saveData();
            this.updateDisplay();
            this.updateInsights();
            document.getElementById('incomeForm').reset();
            this.showNotification('Income added successfully!', 'success');
        }
    }

    addExpense() {
        const category = document.getElementById('expenseCategory').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const description = document.getElementById('expenseDescription').value.trim();

        if (category && amount > 0) {
            const newExpense = {
                id: Date.now(),
                category,
                amount,
                description: description || 'No description provided',
                dateAdded: new Date().toLocaleDateString(),
                timestamp: new Date()
            };

            this.expenses.push(newExpense);
            this.saveData();
            this.updateDisplay();
            this.updateInsights();
            document.getElementById('expenseForm').reset();
            this.showNotification('Expense added successfully!', 'success');
        }
    }

    deleteIncome(id) {
        this.income = this.income.filter(item => item.id !== id);
        this.saveData();
        this.updateDisplay();
        this.updateInsights();
        this.showNotification('Income entry deleted', 'info');
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(item => item.id !== id);
        this.saveData();
        this.updateDisplay();
        this.updateInsights();
        this.showNotification('Expense entry deleted', 'info');
    }

    updateDisplay() {
        this.updateSummaryCards();
        this.updateTables();
        this.updateChart();
    }

    updateSummaryCards() {
        const totalIncome = this.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, item) => sum + item.amount, 0);
        const netBalance = totalIncome - totalExpenses;
        const budgetUtilization = totalIncome > 0 ? (totalExpenses / totalIncome * 100) : 0;

        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('netBalance').textContent = this.formatCurrency(netBalance);
        document.getElementById('budgetUtilization').textContent = `${budgetUtilization.toFixed(1)}%`;

        // Update change indicators with realistic demo values
        document.getElementById('incomeChange').textContent = `+12.5% vs last month`;
        document.getElementById('expenseChange').textContent = `+8.3% vs last month`;
        document.getElementById('balanceChange').textContent = netBalance >= 0 ? 'Healthy Surplus' : 'Budget Deficit';
        document.getElementById('utilizationTrend').textContent = budgetUtilization <= 80 ? 'Optimal Range' : budgetUtilization <= 95 ? 'Monitor Closely' : 'Over Budget';

        // Update card colors based on balance
        const balanceCard = document.querySelector('.balance-card');
        if (netBalance < 0) {
            balanceCard.style.setProperty('--accent-color', 'var(--accent-red)');
        } else {
            balanceCard.style.setProperty('--accent-color', 'var(--accent-blue)');
        }
    }

    updateTables() {
        this.updateIncomeTable();
        this.updateExpenseTable();
    }

    updateIncomeTable() {
        const tbody = document.querySelector('#incomeTable tbody');
        const emptyState = document.getElementById('incomeTableEmpty');

        tbody.innerHTML = '';

        if (this.income.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        this.income.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${item.category}</strong></td>
                <td><strong class="text-success">${this.formatCurrency(item.amount)}</strong></td>
                <td>${item.description}</td>
                <td>${item.dateAdded}</td>
                <td>
                    <button class="delete-btn" onclick="budgetManager.deleteIncome(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    updateExpenseTable() {
        const tbody = document.querySelector('#expenseTable tbody');
        const emptyState = document.getElementById('expenseTableEmpty');

        tbody.innerHTML = '';

        if (this.expenses.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        this.expenses.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${item.category}</strong></td>
                <td><strong class="text-danger">${this.formatCurrency(item.amount)}</strong></td>
                <td>${item.description}</td>
                <td>${item.dateAdded}</td>
                <td>
                    <button class="delete-btn" onclick="budgetManager.deleteExpense(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    initChart() {
        const ctx = document.getElementById('budgetChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6',
                        '#ef4444', '#14b8a6', '#f97316', '#6366f1',
                        '#ec4899', '#84cc16', '#06b6d4', '#f43f5e'
                    ],
                    borderWidth: 2,
                    borderColor: 'var(--bg-primary)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: 'var(--text-primary)'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Budget Distribution Overview',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: 'var(--text-primary)'
                    }
                }
            }
        });
    }

    updateChart() {
        if (!this.chart) return;

        const allItems = [
            ...this.income.map(item => ({ ...item, type: 'Income' })),
            ...this.expenses.map(item => ({ ...item, type: 'Expense' }))
        ];

        if (allItems.length === 0) {
            this.chart.data.labels = ['No Data'];
            this.chart.data.datasets[0].data = [1];
            this.chart.data.datasets.backgroundColor = ['#e2e8f0'];
        } else {
            const labels = allItems.map(item => `${item.category} (${item.type})`);
            const data = allItems.map(item => item.amount);

            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
        }

        this.chart.update();
    }

    updateInsights() {
        const insightsContainer = document.getElementById('budgetInsights');
        const totalIncome = this.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, item) => sum + item.amount, 0);
        const netBalance = totalIncome - totalExpenses;

        let insights = [];

        if (this.income.length === 0 && this.expenses.length === 0) {
            insights.push({
                icon: 'fas fa-info-circle text-blue',
                text: 'Add income and expense entries to see personalized insights'
            });
        } else {
            if (netBalance > 0) {
                insights.push({
                    icon: 'fas fa-check-circle text-success',
                    text: `Excellent! You have a surplus of ${this.formatCurrency(netBalance)} - Consider reinvestment opportunities`
                });
            } else if (netBalance < 0) {
                insights.push({
                    icon: 'fas fa-exclamation-triangle text-danger',
                    text: `Alert: Budget deficit of ${this.formatCurrency(Math.abs(netBalance))} - Review expense priorities`
                });
            }

            if (totalExpenses > 0 && totalIncome > 0) {
                const utilization = (totalExpenses / totalIncome * 100);
                if (utilization > 95) {
                    insights.push({
                        icon: 'fas fa-exclamation-triangle text-danger',
                        text: `Critical: Very high budget utilization at ${utilization.toFixed(1)}% - Immediate review needed`
                    });
                } else if (utilization > 80) {
                    insights.push({
                        icon: 'fas fa-exclamation-triangle text-warning',
                        text: `Warning: High budget utilization at ${utilization.toFixed(1)}% - Monitor expenses closely`
                    });
                } else {
                    insights.push({
                        icon: 'fas fa-thumbs-up text-success',
                        text: `Great budget management: ${utilization.toFixed(1)}% utilized - Well within healthy range`
                    });
                }
            }

            // Largest expense category analysis
            if (this.expenses.length > 0) {
                const expensesByCategory = {};
                this.expenses.forEach(expense => {
                    if (!expensesByCategory[expense.category]) {
                        expensesByCategory[expense.category] = 0;
                    }
                    expensesByCategory[expense.category] += expense.amount;
                });

                const largestCategory = Object.keys(expensesByCategory).reduce((a, b) =>
                    expensesByCategory[a] > expensesByCategory[b] ? a : b
                );

                const percentage = ((expensesByCategory[largestCategory] / totalExpenses) * 100).toFixed(1);

                insights.push({
                    icon: 'fas fa-chart-bar text-blue',
                    text: `Primary expense: ${largestCategory} represents ${percentage}% of total expenses (${this.formatCurrency(expensesByCategory[largestCategory])})`
                });
            }

            // Primary income source analysis
            if (this.income.length > 0) {
                const incomeByCategory = {};
                this.income.forEach(income => {
                    if (!incomeByCategory[income.category]) {
                        incomeByCategory[income.category] = 0;
                    }
                    incomeByCategory[income.category] += income.amount;
                });

                const largestIncomeCategory = Object.keys(incomeByCategory).reduce((a, b) =>
                    incomeByCategory[a] > incomeByCategory[b] ? a : b
                );

                const percentage = ((incomeByCategory[largestIncomeCategory] / totalIncome) * 100).toFixed(1);

                insights.push({
                    icon: 'fas fa-star text-success',
                    text: `Primary revenue: ${largestIncomeCategory} contributes ${percentage}% of total income (${this.formatCurrency(incomeByCategory[largestIncomeCategory])})`
                });
            }

            // Budget efficiency insight
            if (totalIncome > 0) {
                const efficiency = ((netBalance / totalIncome) * 100);
                if (efficiency > 20) {
                    insights.push({
                        icon: 'fas fa-trophy text-success',
                        text: `Outstanding budget efficiency: ${efficiency.toFixed(1)}% surplus margin - Excellent financial health`
                    });
                } else if (efficiency > 10) {
                    insights.push({
                        icon: 'fas fa-medal text-success',
                        text: `Good budget efficiency: ${efficiency.toFixed(1)}% surplus margin - Healthy financial position`
                    });
                } else if (efficiency > 0) {
                    insights.push({
                        icon: 'fas fa-balance-scale text-warning',
                        text: `Moderate efficiency: ${efficiency.toFixed(1)}% surplus margin - Consider optimizing expenses`
                    });
                }
            }
        }

        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }

    exportBudgetData() {
        let csvContent = 'Category,Amount,Type,Description,Date Added\n';

        this.income.forEach(item => {
            csvContent += `"${item.category}",${item.amount},Income,"${item.description}","${item.dateAdded}"\n`;
        });

        this.expenses.forEach(item => {
            csvContent += `"${item.category}",${item.amount},Expense,"${item.description}","${item.dateAdded}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SCMS_Budget_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Budget report exported successfully!', 'success');
    }

    saveData() {
        localStorage.setItem('scms_budget_income', JSON.stringify(this.income));
        localStorage.setItem('scms_budget_expenses', JSON.stringify(this.expenses));
    }

    loadData() {
        const savedIncome = localStorage.getItem('scms_budget_income');
        const savedExpenses = localStorage.getItem('scms_budget_expenses');

        if (savedIncome) {
            this.income = JSON.parse(savedIncome);
        }

        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
}

// Additional Functions for Demo and Hackathon
function loadDemoData() {
    if (confirm('This will replace existing data with comprehensive demo data. Continue?')) {
        budgetManager.income = [];
        budgetManager.expenses = [];

        // Load comprehensive demo data
        DEMO_INCOME_DATA.forEach((item, index) => {
            budgetManager.income.push({
                id: Date.now() + index,
                category: item.category,
                amount: item.amount,
                description: item.description,
                dateAdded: item.dateAdded,
                timestamp: new Date()
            });
        });

        DEMO_EXPENSE_DATA.forEach((item, index) => {
            budgetManager.expenses.push({
                id: Date.now() + 1000 + index,
                category: item.category,
                amount: item.amount,
                description: item.description,
                dateAdded: item.dateAdded,
                timestamp: new Date()
            });
        });

        budgetManager.saveData();
        budgetManager.updateDisplay();
        budgetManager.updateInsights();
        budgetManager.showNotification('Demo data loaded successfully! Perfect for hackathon presentation.', 'success');
    }
}

function updateChartType() {
    const chartType = document.getElementById('chartType').value;
    budgetManager.chartType = chartType;
    budgetManager.chart.destroy();
    budgetManager.initChart();
    budgetManager.updateChart();
    budgetManager.showNotification(`Chart updated to ${chartType} view`, 'info');
}

function clearForms() {
    document.getElementById('incomeForm').reset();
    document.getElementById('expenseForm').reset();
}

function confirmClearData() {
    if (confirm('Are you sure you want to clear all budget data? This action cannot be undone.')) {
        budgetManager.income = [];
        budgetManager.expenses = [];
        budgetManager.saveData();
        budgetManager.updateDisplay();
        budgetManager.updateInsights();
        budgetManager.showNotification('All budget data cleared', 'info');
    }
}

function sortTable(type, column) {
    if (type === 'income') {
        budgetManager.income.sort((a, b) => {
            if (column === 'amount') {
                return b.amount - a.amount;
            }
            return a[column].localeCompare(b[column]);
        });
    } else {
        budgetManager.expenses.sort((a, b) => {
            if (column === 'amount') {
                return b.amount - a.amount;
            }
            return a[column].localeCompare(b[column]);
        });
    }
    budgetManager.updateTables();
    budgetManager.showNotification(`${type} table sorted by ${column}`, 'info');
}

function generateBudgetReport() {
    budgetManager.showNotification('Generating comprehensive financial analysis report...', 'info');

    setTimeout(() => {
        const totalIncome = budgetManager.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = budgetManager.expenses.reduce((sum, item) => sum + item.amount, 0);
        const reportData = {
            reportDate: new Date().toISOString(),
            summary: {
                totalIncome,
                totalExpenses,
                netBalance: totalIncome - totalExpenses,
                budgetUtilization: totalIncome > 0 ? (totalExpenses / totalIncome * 100) : 0
            },
            incomeBreakdown: budgetManager.income,
            expenseBreakdown: budgetManager.expenses
        };

        console.log('Budget Report Generated:', reportData);
        budgetManager.showNotification('Advanced budget report generated successfully!', 'success');
    }, 2000);
}

function openBudgetAnalytics() {
    budgetManager.showNotification('Opening advanced analytics dashboard with AI-powered insights...', 'info');
    // In a real implementation, this would open a detailed analytics modal or page
}

function backupData() {
    const data = {
        income: budgetManager.income,
        expenses: budgetManager.expenses,
        exportDate: new Date().toISOString(),
        systemInfo: {
            version: '2.1.0',
            institution: 'SCMS Demo Institution',
            backupType: 'Full System Backup'
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SCMS_Budget_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    budgetManager.showNotification('Complete data backup created successfully!', 'success');
}

function openImportModal() {
    budgetManager.showNotification('Data import functionality - Upload CSV or JSON files to restore budget data', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('scms_current_user');
        budgetManager.showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    window.budgetManager = new EnhancedBudgetManager();
});
