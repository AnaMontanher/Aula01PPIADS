const formulario = document.getElementById("formCliente");

formulario.onsubmit = gravarCurso; //atribuir a função gravar curso ao evento submit do formulário
document.getElementById("btnAtualizar").onclick = () => {
  const id = document.getElementById("codigo").value;
  alterarCurso(id);
};
const formatarData = (data) => {
  if (!data) return "";
  return data.split("T")[0];
};
document.getElementById("btnReset").onclick = resetFormulário;

carregarDocentes();
exibirTabelaCursos();

function gravarCurso(evento) {
  if (validarFormulario()) {
    const id = document.getElementById("codigo").value;
    const nomeCurso = document.getElementById("nomeCurso").value;
    const sigla = document.getElementById("sigla").value;
    const carga = parseInt(document.getElementById("cargaHoraria").value);
    const valor = parseFloat(
      document.getElementById("valor").value.replace(",", ".")
    );
    const data_inicio = document.getElementById("dataInicio").value;
    const data_fim = document.getElementById("dataFim").value;
    const conteudoProg = document.getElementById("conteudoProg").value;
    const idDocente = document.getElementById("docente").value;

    fetch("http://localhost:4000/curso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id, //"codigo":codigo
        nome: nomeCurso,
        sigla: sigla,
        carga: carga,
        valor: valor,
        data_inicio: data_inicio,
        data_fim: data_fim,
        cont_prag: conteudoProg,
        docente: { cpf: idDocente },
      }),
    })
      .then((resposta) => {
        return resposta.json();
      })
      .then((dados) => {
        if (dados.status) {
          resetFormulário();
          exibirTabelaCursos();
        }
        alert(dados.mensagem);
      })
      .catch((erro) => {
        alert("Não foi possível gravar o curso" + erro.message);
      });
  }
  evento.stopPropagation();
  evento.preventDefault();
}

function validarFormulario() {
  const formValidado = formulario.checkValidity();
  if (formValidado) {
    formulario.classList.remove("was-validated");
  } else {
    formulario.classList.add("was-validated");
  }

  return formValidado;
}

function carregarDocentes() {
  fetch("http://localhost:4000/docente", { method: "GET" })
    .then((resposta) => {
      if (resposta.ok) {
        return resposta.json();
      } //retorna dados
    })
    .then((dados) => {
      if (dados.status) {
        const selectDocente = document.getElementById("docente");
        for (const docente of dados.docentes) {
          const option = document.createElement("option");
          //option.innerHTML = "<option value = '" + cidade.id"'>" + cidade.nome  + "/"+ cidade.uf + "</option>"
          //   option.innerHTML = `<option value = "${docente.cpf}">${docente.nome} ${docente.sobrenome}</option> `;
          option.value = docente.CPF;
          option.textContent = docente.nome + " " + docente.sobrenome;
          selectDocente.appendChild(option);
        }
      }
    })
    .catch((erro) => {
      alert("Não foi possível recuperar as cidades do backend." + erro.message);
    });
}

function excluirCurso(id) {
  if (confirm(`Deseja realmente excluir o curso (ID: ${id})?`)) {
    fetch("http://localhost:4000/curso/" + id, { method: "DELETE" })
      .then((resposta) => {
        if (resposta.ok) {
          return resposta.json();
        }
      })
      .then((dados) => {
        if (dados.status) {
          exibirTabelaCursos();
        }
        alert(dados.mensagem);
      })
      .catch((erro) => {
        alert("Não foi possível excluir o curso." + erro.message);
      });
  }
}

function prepararFormulario(id) {
  if (validarFormulario) {
    // Busca dados do curso
    fetch("http://localhost:4000/curso/" + id, { method: "GET" })
      .then((resposta) => resposta.json())
      .then((dados) => {
        if (dados.status || dados.resposta) {
          const curso = dados.cursos;

          // Preenchendo o formulário com os dados da tabela
          document.getElementById("codigo").value = curso.id;
          document.getElementById("nomeCurso").value = curso.nome;
          document.getElementById("sigla").value = curso.sigla;
          document.getElementById("cargaHoraria").value = curso.carga;
          document.getElementById("valor").value = parseFloat(curso.valor);
          document.getElementById("dataInicio").value = formatarData(
            curso.data_inicio
          );
          document.getElementById("dataFim").value = formatarData(
            curso.data_fim
          );
          document.getElementById("conteudoProg").value = curso.cont_prag;
          document.getElementById("docente").value = curso.docente.CPF;

          // Após preenchimento, envia alteração direto
          if (confirm(`Deseja alterar o curso (ID: ${curso.id})?`)) {
          } else {
            resetFormulário;
          }
        }
      })
      .catch((erro) => {
        alert("Erro ao buscar dados do curso: " + erro.message);
      });
  }
}

function alterarCurso(id) {
  const nomeCurso = document.getElementById("nomeCurso").value;
  const sigla = document.getElementById("sigla").value;
  const carga = parseInt(document.getElementById("cargaHoraria").value);
  const valor = parseFloat(
    document.getElementById("valor").value.replace(",", ".")
  );
  const data_inicio = document.getElementById("dataInicio").value;
  const data_fim = document.getElementById("dataFim").value;
  const conteudoProg = document.getElementById("conteudoProg").value;
  const idDocente = document.getElementById("docente").value;
  fetch("http://localhost:4000/curso/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      nome: nomeCurso,
      sigla: sigla,
      carga: carga,
      valor: valor,
      data_inicio: data_inicio,
      data_fim: data_fim,
      cont_prag: conteudoProg,
      docente: { cpf: idDocente },
    }),
  })
    .then((resposta) => {
      return resposta.json();
    })
    .then((dados) => {
      if (dados.status) {
        resetFormulário();
        exibirTabelaCursos();
      }
      alert(dados.mensagem);
    })
    .catch((erro) => {
      alert("Não foi possível gravar o cliente" + erro.message);
    });
}

function resetFormulário() {
  document.getElementById("codigo").value = "";
  document.getElementById("nomeCurso").value = "";
  document.getElementById("sigla").value = "";
  document.getElementById("cargaHoraria").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
  document.getElementById("conteudoProg").value = "";
  document.getElementById("docente").value = "";
}

function exibirTabelaCursos() {
  const espacoTabela = document.getElementById("tabela");
  espacoTabela.innerHTML = "";

  fetch("http://localhost:4000/curso", { method: "GET" })
    .then((resposta) => {
      if (resposta.ok) {
        return resposta.json();
      } //retorna dados
    })
    .then((dados) => {
      if (dados.status) {
        const tabela = document.createElement("table");
        tabela.className = "table table-stripped tabela table-hover";
        const cabecalho = document.createElement("thead");
        cabecalho.innerHTML = `
          <tr>
          <th>CÓD</th>
          <th>NOME</th>
          <th>SIGLA</th>
          <th>CARGA</th>
          <th>VALOR</th>
         <th>DT INICIO</th>
          <th>DT FIM</th>
          <th>CONT. PROG</th>
          <th>DOCENTE</th>
          <th>AÇÕES</th>
          </tr>
          `;
        tabela.appendChild(cabecalho);
        const corpoTabela = document.createElement("tbody");

        for (const curso of dados.cursos) {
          const linhaDados = document.createElement("tr");
          linhaDados.innerHTML = `<td>${curso.id}</td>
          <td>${curso.nome}</td>
          <td>${curso.sigla}</td>
          <td>${curso.carga}</td>
          <td>${curso.valor}</td>
          <td>${formatarData(curso.data_inicio)}</td>
          <td>${formatarData(curso.data_fim)}</td>
          <td>${curso.cont_prag}</td>
          <td>${curso.docente.nome}</td>
          <td><div class="d-flex gap-2">
          <button type="button" class="btn btn-danger" onclick="excluirCurso('${
            curso.id
          }')" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
          </svg></button>
          <button type="button" class="btn btn-secondary" onclick="prepararFormulario('${
            curso.id
          }')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>   <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg></button>  </div>
          </td>`;
          corpoTabela.appendChild(linhaDados);
        }
        tabela.appendChild(corpoTabela);
        espacoTabela.appendChild(tabela);
      }
    })
    .catch((erro) => {
      alert("Não foi possível recuperar os dados do backend." + erro.message);
    });
}
