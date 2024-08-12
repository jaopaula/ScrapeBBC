const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

(async () => {
    // Configurações do Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // URL do site de notícias (exemplo: BBC News)
    const url = 'https://www.bbc.com/news';
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Extração dos dados
    const newsItems = await page.evaluate(() => {
        const headlines = [];
        const items = document.querySelectorAll('a[href*="/news"]'); // Seletor ajustado para links de notícias
        
        items.forEach(item => {
            const title = item.textContent.trim();
            const url = item.href;
            
            if (title && url) {
                headlines.push({ title, url });
            }
        });

        console.log('Headlines:', headlines);
        return headlines;
    });

    // Fechando o navegador
    await browser.close();

    // Configuração do CSV Writer
    const csvWriter = createCsvWriter({
        path: 'news_data.csv',
        header: [
            { id: 'title', title: 'Title' },
            { id: 'url', title: 'URL' }
        ]
    });

    // Escrevendo os dados no arquivo CSV
    csvWriter.writeRecords(newsItems)
        .then(() => {
            console.log('Dados salvos em news_data.csv');
        })
        .catch(error => {
            console.error('Erro ao salvar dados em CSV:', error);
        });
})();
