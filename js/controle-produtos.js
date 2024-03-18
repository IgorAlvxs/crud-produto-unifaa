const URL = "http://localhost:3400/produtos"

let listaProdutos = [];
let btnAdicionar = document.querySelector("#btn-adicionar");
let tabelaProduto = document.querySelector("table>tbody");
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'))

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar"),
}

btnAdicionar.addEventListener('click', () =>{
    limparModalProduto();
    modalProduto.show()
})

function obterProdutos(){
    fetch(URL, {
        metho: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos = produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos){
    tabelaProduto.textContent = '';

    produtos.forEach(produtos => {
        criarLinhaNaTabela(produtos);
    });
}

function criarLinhaNaTabela(produto){
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidadeEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id
    tdNome.textContent = produto.nome
    tdValor.textContent = produto.valor
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque
    tdObservacao.textContent = produto.observacao
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener('click', () =>{
    let produto = obterProdutosModal();

    if(!produto.validar()){
        alert("Nome, quantidade e valor são obrigatorios!");
        return;
    }

    adicionarProdutoBackend(produto);
})

function obterProdutosModal(){
    return new Produto({
        id: formModal.id.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoBackend(produto) {
    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto = new Produto(response);
        listaProdutos.push(novoProduto);

        popularTabela(listaProdutos);

        modalProduto.hide();

        alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
    })
}

function limparModalProduto(){
    formModal.id.value = ''
    formModal.nome.value = ''
    formModal.valor.value = ''
    formModal.quantidadeEstoque.value = ''
    formModal.observacao.value = ''
    formModal.dataCadastro.value = ''
}

function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id);

    if(confirm("Deseja realmente excluir o produto " + produto.nome)){
        excluirProdutosNoBackend(id);
    }
}

function excluirProdutosNoBackend(id){
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {  
            Authorization: obterToken()
        }
    })
    .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);
    
    listaProdutos.splice(indice, 1);
}