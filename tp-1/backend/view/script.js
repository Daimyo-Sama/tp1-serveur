// Fetch data from backend
axios.get('http://localhost:3500/data')
    .then(response => {
        // Extract data from response
        const data = response.data;

        // Render data in HTML
        const dataContainer = document.getElementById('dataContainer');
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.textContent = JSON.stringify(item);
            dataContainer.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });