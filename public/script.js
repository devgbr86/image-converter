const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.textContent = 'Convertendo...';

  const fileInput = document.getElementById('imageFile');
  const formatSelect = document.getElementById('formatSelect');

  if (!fileInput.files.length || !formatSelect.value) {
    resultDiv.textContent = 'Selecione um arquivo e um formato.';
    return;
  }

  const formData = new FormData();
  formData.append('imageFile', fileInput.files[0]);
  formData.append('format', formatSelect.value);

  try {
    const response = await fetch('/convert', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.outputUrl) {
      resultDiv.innerHTML = `Imagem convertida: <a href="${data.outputUrl}" target="_blank" download>Clique para baixar</a>`;
    } else {
      resultDiv.textContent = 'Erro na conversão';
    }
  } catch (error) {
    resultDiv.textContent = 'Erro: ' + error.message;
  }
});
