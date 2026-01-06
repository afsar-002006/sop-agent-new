const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const searchBtn = document.getElementById('searchBtn');
const queryInput = document.getElementById('queryInput');
const resultsArea = document.getElementById('resultsArea');

const API_URL = 'http://localhost:5000/api';

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    uploadStatus.textContent = 'Uploading...';

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            uploadStatus.textContent = `Upload successful! Generated ${result.chunkCount} chunks.`;
            uploadStatus.style.color = 'green';
        } else {
            uploadStatus.textContent = 'Upload failed.';
            uploadStatus.style.color = 'red';
        }
    } catch (error) {
        uploadStatus.textContent = 'Error: ' + error.message;
        uploadStatus.style.color = 'red';
    }
});

searchBtn.addEventListener('click', async () => {
    const query = queryInput.value.trim();
    if (!query) return;

    resultsArea.innerHTML = 'Searching...';

    try {
        const response = await fetch(`${API_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        resultsArea.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(result => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <div class="result-source">Source: ${result.filename}</div>
                    <div class="result-content">${result.content}</div>
                `;
                resultsArea.appendChild(div);
            });
        } else {
            resultsArea.innerHTML = 'No results found.';
        }

    } catch (error) {
        resultsArea.innerHTML = 'Error searching.';
        console.error(error);
    }
});
