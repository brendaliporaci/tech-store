// Mapeamento de elementos do DOM
const selectCategory = document.getElementById('fcategory');
const form = document.getElementById('productForm');
const catalog = document.getElementById('catalog');
const inputNewCategory = document.getElementById('newCategory');
const divNewCategory = document.getElementById('newCategoryGroup');

// Array para armazenar os itens em tempo real
let products = [];

// Controle da exibição do campo de nova categoria
// Função é executada quando há mudança no select de categoria
selectCategory.addEventListener('change', function () {
    // Se o usuário escolher "outra" no select de Categoria, os campos de Nova categoria aparecem e se tornam obrigatórios
    if (this.value === 'outra') {
        divNewCategory.style.display = 'block';
        inputNewCategory.required = true;
    } else {
        // Caso contrário, os campos são escondidos, deixam de ser obrigatórios e são limpos
        divNewCategory.style.display = 'none';
        inputNewCategory.required = false;
        inputNewCategory.value = '';
    }
});

// Cadastro de um novo produto
// Quando o botão de cadastrar for pressionado, chama a fução cadastrarProduto
form.addEventListener("submit", cadastrarProduto);

// Função para pegar os valores do formulário de cadastro
function cadastrarProduto(event) {
    event.preventDefault(); // impede recarregar a página

    // Pega valores
    const nome = document.getElementById("fname").value;
    const categoriaSelect = document.getElementById("fcategory").value;
    const novaCategoria = document.getElementById("newCategory").value;
    const preco = document.getElementById("fprice").value;

    // Variável para armazenar a categoria
    let categoriaFinal;

    // Decide qual categoria usar
    if (categoriaSelect === "outra" && novaCategoria !== "") {
        categoriaFinal = novaCategoria;
    } else {
        categoriaFinal = categoriaSelect;
    }

    // Se for uma nova categoria, adiciona no select
    if (categoriaSelect === "outra" && novaCategoria !== "") {

        // Verifica se já existe
        const existe = Array.from(selectCategory.options)
            .some(option => option.value === novaCategoria);

        if (!existe) {
            const option = document.createElement("option");
            option.value = novaCategoria;
            option.textContent = novaCategoria;

            // Adiciona antes da opção "Outra..."
            selectCategory.insertBefore(option, selectCategory.lastElementChild);
        }

        // Seleciona automaticamente a nova categoria
        selectCategory.value = novaCategoria;
    }

    // Adiciona produto no array products para calcular total e média
    products.push({
        nome: nome,
        categoria: categoriaFinal,
        preco: parseFloat(preco)
    });

    // Chama função para atualizar as métricas a cada produto adicionado
    atualizarMetricas();

    // Pega o índice do produto recém-adicionado
    const index = products.length - 1;

    // Cria um novo elemento div para exibir os itens
    const card = document.createElement("div");

    //Adiciona a classe CSS "product-card" no div
    card.classList.add("product-card");

    // Define o conteúdo HTML interno do card, usando template string
    card.innerHTML = `
        <h3>${nome}</h3>
        <p>Categoria: ${categoriaFinal}</p>
        <p>Preço: R$ ${parseFloat(preco).toFixed(2)}</p>
        <button onclick="removerProduto(this)">Remover</button>
    `;

    // Insere o card dentro do elemento "catalog" da página
    catalog.appendChild(card);

    // Limpa todos os campos do formulário
    form.reset();
}

// Função para remover produto do array
function removerProduto(botao) {
    // Pega o elemento pai do botão que foi clicado 
    const card = botao.parentElement;

    // Pega o nome do produto dentro do card
    const nome = card.querySelector("h3").textContent;

    // Remove do array (encontra pelo nome)
    const index = products.findIndex(p => p.nome === nome);

    if (index !== -1) {
        products.splice(index, 1);
    }

    // Remove da tela
    card.remove();

    // Atualiza métricas
    atualizarMetricas();
}

// Função para atualizar as métricas
function atualizarMetricas() {
    const totalSpan = document.getElementById("total");
    const averageSpan = document.getElementById("average");

    // Se o array de produtos tiver tamanho 0, está vazio, mostra 0.00 em ambos e encerra a função
    if (products.length === 0) {
        totalSpan.textContent = "0.00";
        averageSpan.textContent = "0.00";
        return;
    }

    // Inicializa a variável que vai acumular o valor total
    let total = 0;

    // Percorre cada produto do array e soma o preço ao total
    products.forEach(product => {
        total += product.preco;
    });

    // Calcula a média dividindo o total pelo número de produtos
    let media = total / products.length;

    //Atualiza os elementos da página com os valores formatados (2 casas decimais)
    totalSpan.textContent = total.toFixed(2);
    averageSpan.textContent = media.toFixed(2);
}