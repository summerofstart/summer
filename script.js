let companies = [];

function addCompany() {
    const companyCode = document.getElementById('companyInput').value;
    if (companyCode && !companies.includes(companyCode)) {
        companies.push(companyCode);
        updateCompanyList();
        getFinancialData();
    }
    document.getElementById('companyInput').value = '';
}

function removeCompany(companyCode) {
    companies = companies.filter(code => code !== companyCode);
    updateCompanyList();
    getFinancialData();
}

function updateCompanyList() {
    const companyList = document.getElementById('companyList');
    companyList.innerHTML = companies.map(code => 
        `<span class="company-tag">${code} <span class="remove-btn" onclick="removeCompany('${code}')">&times;</span></span>`
    ).join('');
}

function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab:nth-child(${tabName === 'historicalCharts' ? '2' : '1'})`).classList.add('active');
    document.getElementById('financialInfo').style.display = tabName === 'financialInfo' ? 'block' : 'none';
    document.getElementById('historicalCharts').style.display = tabName === 'historicalCharts' ? 'block' : 'none';
}

async function getFinancialData() {
    const financialInfoDiv = document.getElementById('financialInfo');
    financialInfoDiv.innerHTML = '読み込み中...';

    try {
        const promises = companies.map(companyCode => 
            axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${companyCode}?modules=financialData,defaultKeyStatistics,price`)
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data.quoteSummary.result[0]);
        displayFinancialInfo(data);
        getHistoricalData();
    } catch (error) {
        console.error('Error fetching data:', error);
        financialInfoDiv.innerHTML = 'データの取得に失敗しました。企業コードを確認してください。';
    }
}

function displayFinancialInfo(companiesData) {
    const financialInfoDiv = document.getElementById('financialInfo');
    financialInfoDiv.innerHTML = '<div class="financial-grid">' + companiesData.map(data => {
        const financialData = data.financialData;
        const keyStats = data.defaultKeyStatistics;
        const price = data.price;

        return `
            <div class="financial-card">
                <h2>${price.longName} (${price.symbol})</h2>
                <table>
                    <tr><th>指標</th><th>値</th></tr>
                    <tr><td>現在値</td><td>${price.regularMarketPrice.fmt}</td></tr>
                    <tr><td>時価総額</td><td>${price.marketCap.fmt}</td></tr>
                    <tr><td>収益</td><td>${financialData.totalRevenue.fmt}</td></tr>
                    <tr><td>営業利益率</td><td>${financialData.operatingMargins.fmt}</td></tr>
                    <tr><td>当期純利益</td><td>${financialData.netIncome.fmt}</td></tr>
                    <tr><td>EPS（1株当たり利益）</td><td>${keyStats.trailingEps.fmt}</td></tr>
                    <tr><td>PER（株価収益率）</td><td>${keyStats.forwardPE.fmt}</td></tr>
                    <tr><td>ROE（自己資本利益率）</td><td>${financialData.returnOnEquity.fmt}</td></tr>
                    <tr><td>負債比率</td><td>${financialData.debtToEquity.fmt}</td></tr>
                </table>
            </div>
        `;
    }).join('') + '</div>';
}

async function getHistoricalData() {
    const historicalChartsDiv = document.getElementById('historicalCharts');
    historicalChartsDiv.innerHTML = '';

    try {
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - 365 * 24 * 60 * 60; // 1年前

        const promises = companies.map(companyCode => 
            axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${companyCode}?period1=${startDate}&period2=${endDate}&interval=1d`)
        );
        const responses = await Promise.all(promises);
        const data = responses.map(response => response.data.chart.result[0]);
        displayHistoricalCharts(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        historicalChartsDiv.innerHTML = '過去データの取得に失敗しました。';
    }
}

function displayHistoricalCharts(historicalData) {
    const historicalChartsDiv = document.getElementById('historicalCharts');
    historicalChartsDiv.innerHTML = historicalData.map((data, index) => 
        `<div class="chart-container">
            <h2>${companies[index]} - 株価推移（過去1年）</h2>
            <canvas id="chart-${index}"></canvas>
        </div>`
    ).join('');

    historicalData.forEach((data, index) => {
        const ctx = document.getElementById(`chart-${index}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.timestamp.map(t => new Date(t * 1000).toLocaleDateString()),
                datasets: [{
                    label: '終値',
                    data: data.indicators.quote[0].close,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '日付'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '株価'
                        }
                    }
                }
            }
        });
    });
}
