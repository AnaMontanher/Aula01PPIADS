class Curso {
  constructor(descricao, valorUnit) {
    (this.descricao = descricao), (this.valorUnit = valorUnit);
  }
}

const financas = new Curso("financas", 54.9);
const python = new Curso("python", 89.99);
const javascript = new Curso("javascript", 80.9);

const listaCursos = [financas, python, javascript];

const total = document.getElementById("total");
const quantidade = document.getElementById("quantidade");
const cursoPag = total.classList[0];
const cursoObj = listaCursos.find(
  (elemento) => elemento.descricao === cursoPag
);

quantidade.addEventListener("input", (e) => {
  const unid = cursoObj.valorUnit;
  let quantidade = e.target.value;
  const valorTotal = calcular(quantidade, unid);
  total.style.display = "block";
  total.textContent = `TOTAL:    ${valorTotal.toFixed(2)}`;
});
