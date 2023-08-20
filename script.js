const apiUrl = 'https://crudcrud.com/api/0bb03ff0d29d4b19ba5e3ff796962f92/products'; // Replace with your API key
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productList = document.getElementById('product-list');
const totalValueDisplay = document.getElementById('total-value');

let products = [];

async function fetchProducts() {
    productList.innerHTML = '';

    const response = await fetch(apiUrl);
    products = await response.json();

    let totalValue = 0;
    products.forEach(product => {
        totalValue += parseFloat(product.price || 0);
        addProductToList(product);
    });

    updateTotalValueDisplay(totalValue);
}

async function addProduct(name, price) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price: parseFloat(price) }),
    });

    const newProduct = await response.json();
    products.push(newProduct);
    addProductToList(newProduct);

    const totalValue = getTotalValue();
    updateTotalValueDisplay(totalValue);
}

async function deleteProduct(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });

    products = products.filter(product => product._id !== id);
    const totalValue = getTotalValue();
    updateTotalValueDisplay(totalValue);
    fetchProducts(); // Re-fetch products to update the list
}

function addProductToList(product) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${product.name}</span>
        <span>$${product.price.toFixed(2)}</span>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
    `;
    productList.appendChild(li);
}

function getTotalValue() {
    return products.reduce((total, product) => total + (product.price || 0), 0);
}

function updateTotalValueDisplay(totalValue) {
    totalValueDisplay.textContent = `$${totalValue.toFixed(2)}`;
}

productForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = productNameInput.value;
    const price = productPriceInput.value;
    addProduct(name, price);
    productNameInput.value = '';
    productPriceInput.value = '';
});

fetchProducts();
