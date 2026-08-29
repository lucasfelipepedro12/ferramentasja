alert("ESTE É O SCRIPT NOVO");

function abrirQR() {
    document.getElementById("qr-tool").style.display = "flex";
    document.getElementById("qrTexto").focus();
}

function fecharQR() {
    document.getElementById("qr-tool").style.display = "none";
}

function gerarQR() {

    const texto = document.getElementById("qrTexto").value.trim();
    const areaQR = document.getElementById("qrcode");
    const botaoDownload = document.getElementById("baixarQR");

    if (texto === "") {
        alert("Digite um texto ou link.");
        return;
    }

    const url =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
        encodeURIComponent(texto);

    areaQR.innerHTML = `
        <img
            src="${url}"
            alt="QR Code"
            width="220"
            height="220"
        >
    `;

    botaoDownload.style.display = "block";
}

function baixarQR() {

    const imagem = document.querySelector("#qrcode img");

    if (!imagem) {
        alert("Primeiro gere um QR Code.");
        return;
    }

    const link = document.createElement("a");

    link.href = imagem.src;
    link.target = "_blank";
    link.download = "qrcode-ferramentasja.png";

    link.click();
}


// ================================
// WHATSAPP
// ================================

function abrirWhatsApp() {
    document.getElementById("whatsapp-tool").style.display = "flex";
    document.getElementById("whatsappNumero").focus();
}

function fecharWhatsApp() {
    document.getElementById("whatsapp-tool").style.display = "none";
}

function gerarWhatsApp() {

    const numero = document
        .getElementById("whatsappNumero")
        .value
        .replace(/\D/g, "");

    const mensagem = document
        .getElementById("whatsappMensagem")
        .value
        .trim();

    const resultado = document.getElementById("resultadoWhatsApp");
    const botaoCopiar = document.getElementById("copiarWhatsApp");

    if (numero === "") {
        alert("Digite o número do WhatsApp.");
        return;
    }

    if (numero.length < 10) {
        alert("Digite um número válido com DDD.");
        return;
    }

    let link = "https://wa.me/" + numero;

    if (mensagem !== "") {
        link += "?text=" + encodeURIComponent(mensagem);
    }

    resultado.innerHTML = `
        <div class="resultado-link">
            <p>Seu link está pronto:</p>
            <a href="${link}" target="_blank">${link}</a>
        </div>
    `;

    botaoCopiar.style.display = "block";

    botaoCopiar.dataset.link = link;
}

function copiarWhatsApp() {

    const botao = document.getElementById("copiarWhatsApp");
    const link = botao.dataset.link;

    if (!link) {
        return;
    }

    navigator.clipboard.writeText(link);

    botao.textContent = "✓ Link copiado!";

    setTimeout(() => {
        botao.textContent = "Copiar link";
    }, 2000);
}

// ================================
// COMPRESSOR DE IMAGEM
// ================================

let imagemComprimida = null;

function abrirCompressor() {
    document.getElementById("compressor-tool").style.display = "flex";
}

function fecharCompressor() {
    document.getElementById("compressor-tool").style.display = "none";
}

function comprimirImagem() {

    const input = document.getElementById("imagemInput");
    const arquivo = input.files[0];

    if (!arquivo) {
        alert("Escolha uma imagem primeiro.");
        return;
    }

    const imagem = new Image();
    const leitor = new FileReader();

    leitor.onload = function(evento) {

        imagem.onload = function() {

            const canvas = document.createElement("canvas");
            const contexto = canvas.getContext("2d");

            canvas.width = imagem.width;
            canvas.height = imagem.height;

            contexto.drawImage(
                imagem,
                0,
                0,
                imagem.width,
                imagem.height
            );

            canvas.toBlob(
                function(blob) {

                    imagemComprimida = blob;

                    const tamanhoOriginal =
                        formatarTamanho(arquivo.size);

                    const tamanhoNovo =
                        formatarTamanho(blob.size);

                    document.getElementById("resultadoCompressor").innerHTML = `
                        <div class="resultado-link">
                            <p><strong>Imagem comprimida!</strong></p>
                            <p>Original: ${tamanhoOriginal}</p>
                            <p>Nova: ${tamanhoNovo}</p>
                        </div>
                    `;

                    document.getElementById("baixarImagem").style.display = "block";

                },
                "image/jpeg",
                0.6
            );
        };

        imagem.src = evento.target.result;
    };

    leitor.readAsDataURL(arquivo);
}

function baixarImagem() {

    if (!imagemComprimida) {
        alert("Primeiro comprima uma imagem.");
        return;
    }

    const url = URL.createObjectURL(imagemComprimida);

    const link = document.createElement("a");

    link.href = url;
    link.download = "imagem-comprimida.jpg";

    link.click();

    URL.revokeObjectURL(url);
}

function formatarTamanho(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function abrirRedimensionador() {
    window.location.href = "redimensionar-imagem.html";
}