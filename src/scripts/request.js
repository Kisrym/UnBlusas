
document.getElementById('generate-button').addEventListener('click', () => {
    const prompt = document.getElementById('texture-prompt').value;
    const size = '1024x1024';

    fetch('http://localhost:5000/generateimage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ prompt, size }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.image) {
                console.log(`Imagem gerada:\n${data.image}`);
            }
            else {
                console.log(`Erro ao gerar imagem: ${data.error}`);
            }
        })
        .catch(error => {
            console.error('Erro ao fazer requisição para a API:', error);
        });
});