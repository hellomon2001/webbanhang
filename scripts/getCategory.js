document.addEventListener("DOMContentLoaded", function () {
  const displayContent = document.querySelector("#display_content");
  if (!displayContent) {
    console.error("Element with ID 'display_content' not found.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "default";

  const getProductsByCategory = async (category, sortOrder) => {
    try {
      const res = await fetch(`/api/products?category=${category}`);
      const data = await res.json();

      displayContent.innerHTML = "";

      if (data && data.data && data.data.length > 0) {
        const sortedProducts = data.data.sort((a, b) => {
          const priceA =
            Math.round(
              (a.price_origin - (a.price_origin / 100) * a.sale) * 100
            ) / 100;
          const priceB =
            Math.round(
              (b.price_origin - (b.price_origin / 100) * b.sale) * 100
            ) / 100;

          return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
        });

        const detailProducts = document.createElement("div");
detailProducts.classList.add("detail_products");

sortedProducts.forEach((item) => {
  const productHTML = `
    <div class="introduce_product">
      <a href="/product.html?sanpham=${item.title}&_id=${item["_id"]}">
        <div class="top">
          <div class="image_product">
            <img src="${item.image_bg}" alt="${item.title}"/>
          </div>
        </div>
        <div class="information_product">
          <p>${item.title}</p>
          <div class="price_product">
            <span>${item.price_origin} $</span>
            <p>
              ${Math.round(
                (item.price_origin - (item.price_origin / 100) * item.sale) * 100
              ) / 100} $
            </p>
          </div>
        </div>
      </a>
    </div>
  `;

  detailProducts.innerHTML += productHTML;  
});

displayContent.appendChild(detailProducts);  

      } else {
        const noProducts = document.createElement("div");
        noProducts.classList.add("no_products");
        noProducts.textContent = "No products found in this category.";
        displayContent.appendChild(noProducts);
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const sortProducts = (order) => {
    const labels = document.querySelectorAll(".arrange label");
    labels.forEach((label) => label.classList.remove("active"));

    if (order === "lowToHigh") {
      const label = document.querySelector("[for='lowToHigh']");
      label.classList.add("active");
      getProductsByCategory(category, "lowToHigh");
    } else if (order === "highToLow") {
      const label = document.querySelector("[for='highToLow']");
      label.classList.add("active");
      getProductsByCategory(category, "highToLow");
    }
  };

  document.querySelector("#lowToHigh").onclick = function () {
    sortProducts("lowToHigh");
  };

  document.querySelector("#highToLow").onclick = function () {
    sortProducts("highToLow");
  };

  getProductsByCategory(category, "lowToHigh");
});
