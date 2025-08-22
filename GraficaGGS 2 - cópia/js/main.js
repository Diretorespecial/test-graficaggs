// Autor: José Minelli
isdebug = false;

isminimized = false;
ispf = true;
ispj = false;

// Função pra verificar se é mobile
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// Ajusta altura da área de avisos
function changeavisosheight() {
  let height;
  if (ispj) {
    height = isMobile() ? 800 : 420;
  } else {
    height = isMobile() ? 720 : 380;
  }
  $("#avisos").css("height", height + "px");
}

$(document).ready(function () {

  // Função que seleciona o card de receituário
  function selecionarCard(card) {
    $(".radioCard").removeClass("selected");
    $(card).addClass("selected");
    $(card).find("input[type='radio']").prop("checked", true).change();
  }

  // Seleção de cards com clique e toque
  $(".radioCard").each(function() {
    this.addEventListener("click", function() {
      selecionarCard(this);
    });
    this.addEventListener("touchstart", function() {
      selecionarCard(this);
    });
  });

  // Alterar tipo de receituário (desativa quantidade se amarelo)
  $(".radioCard input[type='radio']").change(function () {
    if ($(this).val() == "tipo_amarelo") {
      $("#qtd").val("1").attr("disabled", true);
      $("#valor").val("R$ 90,00");
    } else {
      $("#qtd").attr("disabled", false);
    }
  });

  // Atualizar valor baseado na quantidade
  $("#qtd").change(function () {
    let valor = 0;
    switch ($(this).val()) {
      case "1": valor = 100; break;
      case "2": valor = 120; break;
      case "3": valor = 130; break;
      case "4": valor = 140; break;
      case "5": valor = 150; break;
      case "6": valor = 170; break;
      case "10": valor = 210; break;
      case "20": valor = 260; break;
    }
    $("#valor").val("R$ " + valor + ",00");
  });

  // Botão copiar PITX
  $("#pitxbtn").click(function () {
    navigator.clipboard.writeText(13641389000104).then(function () {
      alert("Pitx copiado para a área de transferência!");
    });
  });

  // Botão minimizar avisos
  $("#minimizar").click(function () {
    if (isminimized) {
      $("#avisos").removeClass("minimized");
      $("#minimizar").removeClass("rotated").addClass("rotated2");
    } else {
      $("#avisos").addClass("minimized");
      $("#minimizar").removeClass("rotated2").addClass("rotated");
    }
    isminimized = !isminimized;
  });

  $("#pjFields").hide();

  // Alternar pessoa física
  $("#fisica").click(function () {
    $("#avisoP").html(`
      ● Procuração, Requisição e Declaração (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      ● Declaração ou comprovante de endereço de atendimento em nome do médico (a Secretaria de Saúde aceita apenas contas de água, luz ou telefone) com até 90 dias de emissão.<br>
    `);
    $("#pjFields").fadeOut(300, function () {
      $("#pfFields").fadeIn(300);
    });
    ispj = false;
    ispf = true;
    changeavisosheight();
    $("#juridica").addClass("inactive");
    $("#fisica").removeClass("inactive");
  });

  // Alternar pessoa jurídica
  $("#juridica").click(function () {
    $("#avisoP").html(`
      ● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      <b> ● Cartão CNPJ. -- adicional para pessoa jurídica<br> 
      ● Certificado de regularidade.  -- adicional para pessoa jurídica<br> </b>
    `);
    $("#pfFields").fadeOut(300, function () {
      $("#pjFields").fadeIn(300);
    });
    ispj = true;
    ispf = false;
    changeavisosheight();
    $("#fisica").addClass("inactive");
    $("#juridica").removeClass("inactive");
  });

  // Gerar documentos
  $("#generateDoc").click(function () {
    if (!checkimputs()) return;

    setTimeout(function () {
      $("html, body").animate({ scrollTop: $("#preview").offset().top }, 800);
    }, 500);

    $(".results").fadeIn(300).removeClass("hidden");
    $(".result").removeClass("hidden");

    let docType = $("input[name='receituario']:checked").val();
    let docPath = `assets/${docType}.png`;

    // Coleta dados do formulário
    let nome, crm, especialidade, endereco, telefone, bairro, cidade, cep,
        rg, numero, data, valor, complemento, nomesocial, cpf, rua;

    if ($("#fisica").hasClass("inactive")) { // PJ
      nome = $("#razaoSocial").val();
      crm = $("#crmPJ").val();
      especialidade = $("#especialidadePJ").val();
      rua = $("#rua").val();
      endereco = $("#enderecoPJ").val();
      telefone = $("#telefonePJ").val();
      bairro = $("#bairro_pj").val();
      cidade = $("#cidade_pj").val();
      cep = $("#cep_pj").val();
      numero = $("#numero_pj").val();
      complemento = $("#complemento_pj").val();
      cpf = $("#cnpj").val();
      rg = "";
      nomesocial = $("#razaoSocial").val();
      data = $("#data_pj").val();
    } else { // PF
      rua = $("#rua").val();
      nome = $("#nameform").val();
      crm = $("#crm").val();
      especialidade = $("#especialidade").val();
      endereco = $("#endereco").val();
      telefone = $("#telefone").val();
      bairro = $("#bairro").val();
      complemento = $("#complemento").val();
      cidade = $("#cidade").val();
      cep = $("#cep").val();
      rg = $("#rg").val();
      numero = $("#numero").val();
      cpf = $("#cpf").val();
      nomesocial = $("#nome_social").val();
      data = $("#data").val();
    }

    if (isdebug) { // Dados de teste
      nome = nomesocial = "José Minelli";
      crm = "123456";
      especialidade = "Cardiologia";
      endereco = "Rua Exemplo, 123";
      telefone = "(11) 98765-4321";
      bairro = "Centro";
      complemento = "Apto 101";
      cidade = "São Paulo";
      cep = "12345-678";
      rg = "12.345.678-9";
      numero = "123";
      cpf = "123.456.789-00";
      data = "2023-10-01";
    }

    let dataFormatada = new Date(data);
    let dia = dataFormatada.getDate().toString().padStart(2, "0");
    let mes = dataFormatada.toLocaleString("default", { month: "long" });
    let ano = dataFormatada.getFullYear();

    // Função genérica para gerar PDF a partir de Canvas
    function gerarPDF(imgSrc, largura, altura, downloadBtnId, fileName, drawCallback) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.src = imgSrc;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        drawCallback(ctx);
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [largura, altura] });
        let imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 0, largura, altura);
        $(`#${downloadBtnId}`).attr("href", doc.output("bloburl")).attr("download", fileName).show();
        $(`#preview${downloadBtnId.slice(-1)}`).attr("src", imgData);
      };
    }

    // Aqui você mantém as chamadas de gerarPDF para Receituário, Procuração, Requisição e Declaração
    // [O código existente de gerarPDF continua igual, não precisa mudar]

  });
});

// Verifica campos obrigatórios, destacando os campos vazios
function checkimputs() {
  if (isdebug) return true;

  let valid = true;
  let activeForm = ispj ? "#pjFields" : "#pfFields";

  $(activeForm).find("input[required], select[required]").each(function () {
    if ($(this).val().trim() === "") {
      $(this).addClass("error"); // adiciona borda vermelha
      valid = false;
    } else {
      $(this).removeClass("error");
    }
  });

  // NÃO torna o tipo de receituário obrigatório
  return valid;
}
