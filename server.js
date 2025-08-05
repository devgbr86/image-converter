const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração multer: pasta temporária para uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public')); // serve arquivos estáticos (index.html, css, js)

// Endpoint para upload e conversão
app.post('/convert', upload.single('imageFile'), async (req, res) => {
  const format = req.body.format;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  if (!['jpeg', 'png', 'webp'].includes(format)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  try {
    const inputPath = file.path;
    const outputFileName = `${path.parse(file.originalname).name}.${format}`;
    const outputPath = path.join('output', outputFileName);

    // Cria a pasta output se não existir
    if (!fs.existsSync('output')) fs.mkdirSync('output');

    // Converte e salva o arquivo
    await sharp(inputPath)
      [format]()
      .toFile(outputPath);

    // Apaga o arquivo temporário
    fs.unlinkSync(inputPath);

    // Retorna a URL para download
    res.json({
      message: 'Imagem convertida com sucesso!',
      outputUrl: `/output/${outputFileName}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro na conversão' });
  }
});

// Servir arquivos convertidos
app.use('/output', express.static('output'));

// Start do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
