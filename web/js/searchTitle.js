// Заранее скажу, я просто хотел по тестить, но эта не робит, этим уже сам займись, я не ебу как делать такое

async function loadJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки JSON файла:', error);
        return [];
    }
}

// Функция для поиска в JSON данных
function searchInJSON(query, data) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return data.filter(item => {
        // Ищем по всем значениям объекта
        return Object.values(item).some(value => 
            String(value).toLowerCase().includes(lowerQuery)
        );
    });
}

// Функция для выделения совпадений в тексте
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Функция для отображения результатов
function displayResults(results, query) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<li class="result-item">Ничего не найдено</li>';
        return;
    }
    
    results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'result-item';
        
        let html = '';
        for (const [key, value] of Object.entries(item)) {
            const highlightedValue = highlightText(String(value), query);
            html += `<div><strong>${key}:</strong> ${highlightedValue}</div>`;
        }
        
        li.innerHTML = html;
        resultsContainer.appendChild(li);
    });
}

// Обработчик ввода в поисковую строку
document.getElementById('searchInput').addEventListener('input', function(e) {
    const query = e.target.value.trim();
    const results = searchInJSON(query, jsonData);
    displayResults(results, query);
});

document.addEventListener('DOMContentLoaded', async () => {
            const data = await loadJSONFile('title.json');
            // Инициализация поиска с загруженными данными
            document.getElementById('searchInput').addEventListener('input', function(e) {
                const query = e.target.value.trim();
                const results = searchInJSON(query, data);
                displayResults(results, query);
            });
        });