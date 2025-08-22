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
    $("input[required], select[required], textarea[required]").removeClass("campo-invalido");

    $("input[required], select[required], textarea[required]").each(function () {
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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let tipoPessoa = $("#tipoPessoa").val();
    let nome, cpfCnpj, endereco;

    if (tipoPessoa === "pf") {
      nome = $("#nomePF").val();
      cpfCnpj = $("#cpf").val();
      endereco = $("#enderecoPF").val();
    } else {
      nome = $("#nomePJ").val();
      cpfCnpj = $("#cnpj").val();
      endereco = $("#enderecoPJ").val();
    }

    let quantidade = $("#quantidade").val();
    let tipoReceituario = $("#tipoReceituario").val() || "Não selecionado";

    doc.text("Receituário", 105, 20, { align: "center" });
    doc.text("Nome: " + nome, 20, 40);
    doc.text("CPF/CNPJ: " + cpfCnpj, 20, 50);
    doc.text("Endereço: " + endereco, 20, 60);
    doc.text("Tipo de Receituário: " + tipoReceituario, 20, 70);
    doc.text("Quantidade: " + quantidade, 20, 80);

    doc.save("receituario.pdf");
  }

  function gerarProcuracao() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    let tipoPessoa = $("#tipoPessoa").val();
    let nome, cpfCnpj, endereco;

    if (tipoPessoa === "pf") {
      nome = $("#nomePF").val();
      cpfCnpj = $("#cpf").val();
      endereco = $("#enderecoPF").val();
    } else {
      nome = $("#nomePJ").val();
      cpfCnpj = $("#cnpj").val();
      endereco = $("#enderecoPJ").val();
    }

    doc.text("PROCURAÇÃO", 105, 20, { align: "center" });
    doc.text(
      "Eu, " +
        nome +
        ", inscrito sob o CPF/CNPJ " +
        cpfCnpj +
        ", residente/endereço " +
        endereco +
        ", nomeio e constituo meu bastante procurador para os devidos fins.",
      20,
      40,
      { maxWidth: 170 }
    );

    doc.text("Local e Data: ___________________________", 20, 100);
    doc.text("Assinatura: ___________________________", 20, 120);

    doc.save("procuracao.pdf");
  }

  function gerarRequisicao() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("courier", "normal");
    doc.setFontSize(12);

    let tipoPessoa = $("#tipoPessoa").val();
    let nome, cpfCnpj, endereco;

    if (tipoPessoa === "pf") {
      nome = $("#nomePF").val();
      cpfCnpj = $("#cpf").val();
      endereco = $("#enderecoPF").val();
    } else {
      nome = $("#nomePJ").val();
      cpfCnpj = $("#cnpj").val();
      endereco = $("#enderecoPJ").val();
    }

    doc.text("REQUISIÇÃO", 105, 20, { align: "center" });
    doc.text("Solicitante: " + nome, 20, 40);
    doc.text("CPF/CNPJ: " + cpfCnpj, 20, 50);
    doc.text("Endereço: " + endereco, 20, 60);
    doc.text("Descrição da requisição:", 20, 80);
    doc.text($("#descricao").val(), 20, 90, { maxWidth: 170 });

    doc.save("requisicao.pdf");
  }
});
