// FerramentasJá — funções das ferramentas

// ================================
// QR CODE
// ================================
const gerarQRButton = document.getElementById("gerarQR");

if (gerarQRButton) {
    gerarQRButton.addEventListener("click", function () {
        const texto = document.getElementById("qrTexto").value.trim();
        const areaQR = document.getElementById("qrcode");
        const baixar = document.getElementById("baixarQR");

        if (!texto) {
            alert("Digite um texto ou link.");
            return;
        }

        areaQR.innerHTML = "";

        new QRCode(areaQR, {
            text: texto,
            width: 220,
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        setTimeout(() => {
            const imagem = areaQR.querySelector("img");
            const canvas = areaQR.querySelector("canvas");

            if (canvas) {
                baixar.href = canvas.toDataURL("image/png");
            } else if (imagem) {
                baixar.href = imagem.src;
            }

            baixar.download = "qrcode-ferramentasja.png";
            baixar.style.display = "block";
        }, 100);
    });
}

// ================================
// WHATSAPP
// ================================
const gerarWhatsAppButton = document.getElementById("gerarWhatsApp");

if (gerarWhatsAppButton) {
    gerarWhatsAppButton.addEventListener("click", function () {
        const numero = document
            .getElementById("whatsappNumero")
            .value
            .replace(/\D/g, "");

        const mensagem = document
            .getElementById("whatsappMensagem")
            .value
            .trim();

        const resultado = document.getElementById("resultadoWhatsApp");
        const copiar = document.getElementById("copiarWhatsApp");

        if (!numero) {
            alert("Digite o número do WhatsApp.");
            return;
        }

        if (numero.length < 10) {
            alert("Digite um número válido com DDD.");
            return;
        }

        let link = "https://wa.me/" + numero;

        if (mensagem) {
            link += "?text=" + encodeURIComponent(mensagem);
        }

        resultado.innerHTML = `
            <div class="resultado-link">
                <p><strong>Seu link está pronto:</strong></p>
                <a href="${link}" target="_blank" rel="noopener">${link}</a>
            </div>
        `;

        copiar.dataset.link = link;
        copiar.style.display = "block";
        copiar.textContent = "Copiar link";
    });
}

const copiarWhatsAppButton = document.getElementById("copiarWhatsApp");

if (copiarWhatsAppButton) {
    copiarWhatsAppButton.addEventListener("click", async function () {
        const link = this.dataset.link;

        if (!link) return;

        try {
            await navigator.clipboard.writeText(link);
            this.textContent = "✓ Link copiado!";
        } catch {
            alert("Não foi possível copiar automaticamente. Selecione o link e copie.");
        }

        setTimeout(() => {
            this.textContent = "Copiar link";
        }, 2000);
    });
}

// ================================
// COMPRESSOR DE IMAGEM
// ================================
const comprimirButton = document.getElementById("comprimirImagem");

if (comprimirButton) {
    comprimirButton.addEventListener("click", function () {
        const input = document.getElementById("imagemInput");
        const arquivo = input.files[0];
        const resultado = document.getElementById("resultadoCompressor");
        const baixar = document.getElementById("baixarImagem");

        if (!arquivo) {
            alert("Escolha uma imagem primeiro.");
            return;
        }

        resultado.innerHTML = "<p class='info'>Comprimindo imagem...</p>";
        baixar.style.display = "none";

        const imagem = new Image();
        const leitor = new FileReader();

        leitor.onload = function (evento) {
            imagem.onload = function () {
                const canvas = document.createElement("canvas");
                const contexto = canvas.getContext("2d");

                canvas.width = imagem.width;
                canvas.height = imagem.height;

                contexto.drawImage(imagem, 0, 0);

                canvas.toBlob(function (blob) {
                    if (!blob) {
                        resultado.innerHTML = "<p class='info'>Não foi possível comprimir a imagem.</p>";
                        return;
                    }

                    const url = URL.createObjectURL(blob);

                    resultado.innerHTML = `
                        <div class="resultado-box">
                            <p><strong>Imagem comprimida! ✅</strong></p>
                            <p>Original: ${formatarTamanho(arquivo.size)}</p>
                            <p>Nova: ${formatarTamanho(blob.size)}</p>
                        </div>
                    `;

                    baixar.href = url;
                    baixar.download = "imagem-comprimida.jpg";
                    baixar.style.display = "block";
                }, "image/jpeg", 0.6);
            };

            imagem.src = evento.target.result;
        };

        leitor.readAsDataURL(arquivo);
    });
}

// ================================
// REDIMENSIONADOR
// ================================
const imagemInput = document.getElementById("imagem");

if (imagemInput) {
    const larguraInput = document.getElementById("largura");
    const alturaInput = document.getElementById("altura");
    const manterProporcao = document.getElementById("proporcao");
    const preview = document.getElementById("preview");
    const resultado = document.getElementById("resultado");
    const botao = document.getElementById("redimensionar");

    let imagemOriginal = new Image();
    let proporcaoOriginal = 1;

    imagemInput.addEventListener("change", function () {
        const arquivo = this.files[0];

        if (!arquivo) return;

        const url = URL.createObjectURL(arquivo);

        imagemOriginal.onload = function () {
            proporcaoOriginal = imagemOriginal.width / imagemOriginal.height;

            larguraInput.value = imagemOriginal.width;
            alturaInput.value = imagemOriginal.height;

            preview.innerHTML = `
                <img src="${url}" alt="Prévia da imagem">
                <p>${imagemOriginal.width} × ${imagemOriginal.height}px</p>
            `;
        };

        imagemOriginal.src = url;
        resultado.innerHTML = "";
    });

    larguraInput.addEventListener("input", function () {
        if (!manterProporcao.checked) return;

        const largura = Number(this.value);

        if (largura > 0) {
            alturaInput.value = Math.round(largura / proporcaoOriginal);
        }
    });

    alturaInput.addEventListener("input", function () {
        if (!manterProporcao.checked) return;

        const altura = Number(this.value);

        if (altura > 0) {
            larguraInput.value = Math.round(altura * proporcaoOriginal);
        }
    });

    botao.addEventListener("click", function () {
        if (!imagemInput.files[0]) {
            alert("Escolha uma imagem primeiro.");
            return;
        }

        const largura = Number(larguraInput.value);
        const altura = Number(alturaInput.value);

        if (!largura || !altura || largura < 1 || altura < 1) {
            alert("Informe uma largura e uma altura válidas.");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(imagemOriginal, 0, 0, largura, altura);

        canvas.toBlob(function (blob) {
            if (!blob) return;

            const url = URL.createObjectURL(blob);

            resultado.innerHTML = `
                <h3>Imagem pronta! ✅</h3>
                <img src="${url}" alt="Imagem redimensionada" class="imagem-resultado">
                <a href="${url}" download="imagem-redimensionada.png" class="download">
                    Baixar imagem →
                </a>
            `;
        }, "image/png");
    });
}

// ================================
// PDF PARA IMAGENS
// ================================
const converterPDFButton = document.getElementById("converterPDF");

if (converterPDFButton) {
    if (typeof pdfjsLib !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    converterPDFButton.addEventListener("click", async function () {
        const input = document.getElementById("pdfInput");
        const resultado = document.getElementById("resultadoPDF");
        const arquivo = input.files[0];

        if (!arquivo) {
            alert("Escolha um PDF primeiro.");
            return;
        }

        if (typeof pdfjsLib === "undefined") {
            resultado.innerHTML = "<p class='info'>A biblioteca de PDF não carregou. Atualize a página e tente novamente.</p>";
            return;
        }

        try {
            resultado.innerHTML = "<p class='info'>Convertendo PDF...</p>";

            const dados = await arquivo.arrayBuffer();

            const pdf = await pdfjsLib.getDocument({
                data: dados
            }).promise;

            resultado.innerHTML = "";

            for (let numero = 1; numero <= pdf.numPages; numero++) {
                const pagina = await pdf.getPage(numero);
                const viewport = pagina.getViewport({ scale: 1.5 });

                const canvas = document.createElement("canvas");
                const contexto = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await pagina.render({
                    canvasContext: contexto,
                    viewport: viewport
                }).promise;

                const imagem = document.createElement("img");
                imagem.src = canvas.toDataURL("image/jpeg", 0.9);
                imagem.alt = `Página ${numero} do PDF`;

                resultado.appendChild(imagem);
            }
        } catch (erro) {
            console.error(erro);
            resultado.innerHTML = "<p class='info'>Não foi possível converter esse PDF.</p>";
        }
    });
}

// ================================
// CONTADOR DE PALAVRAS
// ================================
const textoInput = document.getElementById("texto");

if (textoInput) {
    const contagem = document.getElementById("contagem");

    function atualizarContagem() {
        const valor = textoInput.value;

        const palavras = valor.trim()
            ? valor.trim().split(/\s+/).length
            : 0;

        const caracteres = valor.length;

        const linhas = valor
            ? valor.split(/\r\n|\r|\n/).length
            : 0;

        contagem.innerHTML = `
            <div class="stat"><strong>${palavras}</strong><span>Palavras</span></div>
            <div class="stat"><strong>${caracteres}</strong><span>Caracteres</span></div>
            <div class="stat"><strong>${linhas}</strong><span>Linhas</span></div>
        `;
    }

    textoInput.addEventListener("input", atualizarContagem);
}

function formatarTamanho(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
