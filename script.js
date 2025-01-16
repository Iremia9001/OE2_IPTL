document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("upload-form");
    const productList = document.getElementById("products");
    const searchBar = document.getElementById("search-bar");
    const sortNameButton = document.getElementById("sort-name");
    const sortPriceButton = document.getElementById("sort-price");
    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelDeleteButton = document.getElementById("cancel-delete");

    let products = [];
    let productToDelete = null;

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("product-name").value;
        const description = document.getElementById("product-description").value;
        const price = parseFloat(document.getElementById("product-price").value);
        const imageFile = document.getElementById("product-image").files[0];

        if (!imageFile || !["image/jpeg", "image/png"].includes(imageFile.type) || imageFile.size > 5 * 1024 * 1024) {
            alert("Please upload a valid image file (JPEG/PNG, max 5MB).");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result;
            const product = { name, description, price, imageUrl };
            products.push(product);
            renderProducts();
            form.reset();
        };
        reader.readAsDataURL(imageFile);
    });

    // Render products
    function renderProducts() {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                </div>
                <div class="actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            productList.appendChild(productDiv);
        });

        // Attach event listeners
        document.querySelectorAll(".delete").forEach(button => button.addEventListener("click", handleDelete));
    }

    // Handle delete
    function handleDelete(event) {
        const index = event.target.dataset.index;
        productToDelete = index;
        deleteModal.classList.add("visible");
    }

    confirmDeleteButton.addEventListener("click", () => {
        if (productToDelete !== null) {
            products.splice(productToDelete, 1);
            productToDelete = null;
            renderProducts();
        }
        deleteModal.classList.remove("visible");
    });

    cancelDeleteButton.addEventListener("click", () => {
        productToDelete = null;
        deleteModal.classList.remove("visible");
    });

    // Handle search
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        renderFilteredProducts(filteredProducts);
    });

    function renderFilteredProducts(filteredProducts) {
        productList.innerHTML = "";
        filteredProducts.forEach((product, index) => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                </div>
                <div class="actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            productList.appendChild(productDiv);
        });
    }

    // Handle sorting
    sortNameButton.addEventListener("click", () => {
        products.sort((a, b) => a.name.localeCompare(b.name));
        renderProducts();
    });

    sortPriceButton.addEventListener("click", () => {
        products.sort((a, b) => a.price - b.price);
        renderProducts();
    });
});