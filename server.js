const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.text({ type: 'text/plain' }));

// Set timeout to 10 minutes (adjust as needed)
const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${server.address().port}`);
});

server.setTimeout(600000); // 10 minutes in milliseconds

app.post('/convert', (req, res) => {
    const latexContent = req.body;
    console.log("Received LaTeX content:", latexContent);  // Log received LaTeX content
    const filename = uuidv4();
    const texFile = `${filename}.tex`;
    const pdfFile = `${filename}.pdf`;

    // Write LaTeX content to a .tex file
    fs.writeFileSync(texFile, latexContent);

    // Compile LaTeX to PDF using pdflatex
    const command = `/usr/local/texlive/bin/pdflatex -interaction=nonstopmode -halt-on-error ${texFile}`;

    const child = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling LaTeX: ${error.message}`);
            res.status(500).send(`Error compiling LaTeX: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`LaTeX compiler stderr: ${stderr}`);
        }
        console.log(`LaTeX compiler stdout: ${stdout}`);

        // Send the compiled PDF file
        res.sendFile(pdfFile, { root: __dirname }, (err) => {
            // Cleanup: delete temporary .tex and .pdf files
            if (err) {
                console.error(`Error sending file: ${err.message}`);
            }
            fs.unlinkSync(texFile);
            fs.unlinkSync(pdfFile);
        });
    });
});

