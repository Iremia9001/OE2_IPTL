document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const deleteModal = document.getElementById("delete-modal");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelDeleteButton = document.getElementById("cancel-delete");
    const editModal = document.getElementById("edit-modal");
    const confirmEditButton = document.getElementById("confirm-edit");
    const cancelEditButton = document.getElementById("cancel-edit");
    const imagePreview = document.getElementById("imagePreview");
    const submitBtn = document.getElementById("submitBtn");
    const sortCriteria = document.getElementById("sortCriteria");
    const sortOrder = document.getElementById("sortOrder");
    const searchInput = document.getElementById("searchInput");

    let products = [];
    let productToDelete = null;
    let productToEdit = null;
    let pendingProduct = null;

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("productName").value;
        const description = document.getElementById("productDescription").value;
        const price = parseFloat(document.getElementById("productPrice").value).toFixed(2);
        const rating = parseInt(document.getElementById("productRating").value);
        const imageFile = document.getElementById("productImage").files[0];

        const handleProductSave = (imageUrl) => {
            const product = { name, description, price: parseFloat(price), rating, imageUrl };

            if (productToEdit !== null) {
                pendingProduct = product;
                editModal.classList.add("visible");
            } else {
                products.push(product);
                renderProducts();
                form.reset();
                imagePreview.innerHTML = ""; // Clear the image preview
                submitBtn.textContent = "Upload Product"; // Reset button text
            }
        };

        if (imageFile) {
            if (!["image/jpeg", "image/png"].includes(imageFile.type) || imageFile.size > 5 * 1024 * 1024) {
                alert("Please upload a valid image file (JPEG/PNG, max 5MB).");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                console.log("Image URL:", imageUrl); // Debugging line
                handleProductSave(imageUrl);
            };
            reader.readAsDataURL(imageFile);
        } else {
            const existingImageUrl = productToEdit !== null ? products[productToEdit].imageUrl : "";
            handleProductSave(existingImageUrl);
        }
    });

    // Render products
    function renderProducts() {
        const criteria = sortCriteria.value;
        const order = sortOrder.value;
        const searchTerm = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );

        filteredProducts.sort((a, b) => {
            let comparison = 0;
            if (criteria === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (criteria === "price") {
                comparison = a.price - b.price;
            } else if (criteria === "rating") {
                comparison = a.rating - b.rating;
            }
            return order === "asc" ? comparison : -comparison;
        });

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
                    <p>Rating: ${product.rating}/5</p>
                </div>
                <div class="actions">
                    <button class="edit" data-index="${index}">Edit</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            productList.appendChild(productDiv);
        });

        // Attach event listeners
        document.querySelectorAll(".edit").forEach(button => button.addEventListener("click", handleEdit));
        document.querySelectorAll(".delete").forEach(button => button.addEventListener("click", handleDelete));
    }

    // Handle edit
    function handleEdit(event) {
        const index = event.target.dataset.index;
        const product = products[index];

        document.getElementById("productName").value = product.name;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productPrice").value = product.price.toFixed(2);
        document.getElementById("productRating").value = product.rating;
        // Display the current image in the preview area
        imagePreview.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; border-radius: 8px;">`;

        productToEdit = index;
        submitBtn.textContent = "Update Product"; // Change button text to "Update Product"
    }

    // Handle delete
    function handleDelete(event) {
        const index = event.target.dataset.index;
        productToDelete = index;
        deleteModal.classList.add("visible");
    }

    // Confirm delete
    confirmDeleteButton.addEventListener("click", () => {
        if (productToDelete !== null) {
            products.splice(productToDelete, 1);
            productToDelete = null;
            renderProducts();
            deleteModal.classList.remove("visible");
        }
    });

    // Cancel delete
    cancelDeleteButton.addEventListener("click", () => {
        productToDelete = null;
        deleteModal.classList.remove("visible");
    });

    // Confirm edit
    confirmEditButton.addEventListener("click", () => {
        if (productToEdit !== null && pendingProduct !== null) {
            products[productToEdit] = pendingProduct;
            productToEdit = null;
            pendingProduct = null;
            renderProducts();
            form.reset();
            imagePreview.innerHTML = ""; // Clear the image preview
            editModal.classList.remove("visible");
            submitBtn.textContent = "Upload Product"; // Reset button text
        }
    });

    // Cancel edit
    cancelEditButton.addEventListener("click", () => {
        pendingProduct = null;
        editModal.classList.remove("visible");
        submitBtn.textContent = "Upload Product"; // Reset button text
    });

    // Handle sort criteria and search input change
    sortCriteria.addEventListener("change", renderProducts);
    sortOrder.addEventListener("change", renderProducts);
    searchInput.addEventListener("input", renderProducts);
});