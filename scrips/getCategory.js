const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const displayContent = document.querySelector("#display_content");

if (!displayContent) {
  console.error("Element with ID 'display_content' not found.");
}

const getProductsByCategory = async (category) => {
  try {
    const res = await fetch(`/api/products?category=${category}`);
    const data = await res.json();

    if (displayContent) {
      displayContent.innerHTML = "";

      if (data && data.data && data.data.length > 0) {
        const detailProducts = document.createElement("div");
        detailProducts.classList.add("detail_products");

        data.data.forEach((item) => {
          const introduceProduct = document.createElement("div");
          introduceProduct.classList.add("introduce_product");

          const link = document.createElement("a");
          link.href = `/product.html?sanpham=${item.title}&_id=${item["_id"]}`;

          const topDiv = document.createElement("div");
          topDiv.classList.add("top");

          const imageDiv = document.createElement("div");
          imageDiv.classList.add("image_product");

          const img = document.createElement("img");
          img.src = item.image_bg;
          img.alt = item.title;

          imageDiv.appendChild(img);
          topDiv.appendChild(imageDiv);
          link.appendChild(topDiv);

          const infoDiv = document.createElement("div");
          infoDiv.classList.add("information_product");

          const titleP = document.createElement("p");
          titleP.textContent = item.title;

          const priceDiv = document.createElement("div");
          priceDiv.classList.add("price_product");

          const originalPrice = document.createElement("span");
          originalPrice.textContent = `${item.price_origin} đ`;

          const salePrice = document.createElement("p");
          const finalPrice =
            Math.round(
              (item.price_origin - (item.price_origin / 100) * item.sale) * 100
            ) / 100;
          salePrice.textContent = `${finalPrice} đ`;

          priceDiv.appendChild(originalPrice);
          priceDiv.appendChild(salePrice);

          infoDiv.appendChild(titleP);
          infoDiv.appendChild(priceDiv);

          link.appendChild(infoDiv);
          introduceProduct.appendChild(link);

          detailProducts.appendChild(introduceProduct);
        });

        displayContent.appendChild(detailProducts);
      } else {
        const noProducts = document.createElement("div");
        noProducts.classList.add("no_products");
        noProducts.textContent = "No products found in this category.";
        displayContent.appendChild(noProducts);
      }
    }
  } catch (error) {
    console.error("Something went wrong with getProductsByCategory!", error);
  }
};

if (category) {
  getProductsByCategory(category);
} else if (displayContent) {
  displayContent.textContent = "No category selected.";
}
