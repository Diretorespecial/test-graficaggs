$(document).ready(function () {
  // Alternar entre PF e PJ
  $("#tipoPessoa").change(function () {
    if ($(this).val() === "pf") {
      $("#camposPF").show();
      $("#camposPJ").hide();
    } else {
      $("#camposPF").hide();
      $("#camposPJ").show();
    }
  });

  // Escolha de tipo de receituário (não obrigatório)
  $(".receituario-card").click(function () {
    $(".receituario-card").removeClass("selected");
    $(this).addClass("selected");
    $("#tipoReceituario").val($(this).data("value"));
  });

  // Impedir quantidade em tipo amarelo
  $("#tipoReceituario").change(function () {
    if ($(this).val() === "amarelo") {
      $("#quantidade").val(1).prop("disabled", true);
    } else {
      $("#quantidade").prop("disabled", false);
    }
  });

  // Cálculo automático de preço
  $("#quantidade").on("input", function () {
    let qtd = parseInt($(this).val()) || 0;
    let preco = qtd * 12;
    $("#valor").text("R$ " + preco.toFixed(2).replace(".", ","));
  });

  // Botões de geração de PDFs
  $("#gerarReceituario").click(function () {
    if (validarCampos()) gerarReceituario();
  });

  $("#gerarProcuracao").click(function () {
    if (validarCampos()) gerarProcuracao();
  });

  $("#gerarRequisicao").click(function () {
    if (validarCampos()) gerarRequisicao();
  });

  // -------------------------
  // Funções de validação
  // -------------------------
  function validarCampos() {
    let valid = true;

    // limpar estados antigos
    $("input[required], select[required]").removeClass("campo-invalido");

    $("input[required], select[required]").each(function () {
      if ($(this).val().trim() === "") {
        $(this).addClass("campo-invalido"); // adiciona borda vermelha
        valid = false;
      }
    });

    if (!valid) {
      alert("Preencha todos os campos obrigatórios.");
    }

    return valid;
  }

  // -------------------------
  // Funções para PDFs
  // -------------------------
  function gerarReceituario() {
    alert("Receituário gerado!");
    // Aqui entra sua lógica de PDF com jsPDF
  }

  function gerarProcuracao() {
    alert("Procuração gerada!");
    // Aqui entra sua lógica de PDF com jsPDF
  }

  function gerarRequisicao() {
    alert("Requisição gerada!");
    // Aqui entra sua lógica de PDF com jsPDF
  }
});
