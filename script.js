document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const searchBar = document.getElementById("search-bar");
    const sortNameButton = document.getElementById("sort-name");
    const sortPriceButton = document.getElementById("sort-price");
    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelDeleteButton = document.getElementById("cancel-delete");

    console.log("form:", form);
    console.log("productList:", productList);
    console.log("searchBar:", searchBar);
    console.log("sortNameButton:", sortNameButton);
    console.log("sortPriceButton:", sortPriceButton);
    console.log("deleteModal:", deleteModal);
    console.log("confirmDeleteButton:", confirmDeleteButton);
    console.log("cancelDeleteButton:", cancelDeleteButton);

    if (!form || !productList) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    let products = [];
    let productToDelete = null;

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("productName").value;
        const description = document.getElementById("productDescription").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const imageFile = document.getElementById("productImage").files[0];

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
            renderProducts();
            deleteModal.classList.remove("visible");
            productToDelete = null;
        }
    });

    cancelDeleteButton.addEventListener("click", () => {
        deleteModal.classList.remove("visible");
        productToDelete = null;
    });

    // Handle search
    if (searchBar) {
        searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            renderFilteredProducts(filteredProducts);
        });
    }

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
    if (sortNameButton) {
        sortNameButton.addEventListener("click", () => {
            products.sort((a, b) => a.name.localeCompare(b.name));
            renderProducts();
        });
    }

    if (sortPriceButton) {
        sortPriceButton.addEventListener("click", () => {
            products.sort((a, b) => a.price - b.price);
            renderProducts();
        });
    }
});