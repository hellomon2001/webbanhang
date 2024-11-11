const getProductsCategories = async (elementParent) => {
  const categories = elementParent.getAttribute("category");
  try {
    const res = await fetch(`/api/products?category=${categories}`);
    const data = await res.json();

    if (data && data.data && data.data.length > 0) {
      elementParent.innerHTML += `<div class="detail_products">
            ${data.data
              .map(
                (item) => `<div class="introduce_product">
              <a href="/product.html?sanpham=${item.title}&_id=${item["_id"]}">
                        <div class="top">
                            <div class="image_product"> 
                                <img src="${item.image_bg}" alt="${
                  item.title
                }"/>
                            </div>    
                        </div>
 
                        <div class="information_product">
                            <p>${item.title}</p>
                            <div class="price_product">
                                <span>${item.price_origin} $</span>
                                <p>${
                                  Math.round(
                                    (item.price_origin -
                                      (item.price_origin / 100) * item.sale) *
                                      100
                                  ) / 100
                                }
 $</p>      
                            </div>
                        </div>
                    </div>`
              )
              .join("")}
        </div>`;
    } else {
      const noProducts = document.createElement("div");
      noProducts.classList.add("no_products");
      noProducts.textContent = "No products found in this category.";
      elementParent.appendChild(noProducts);
    }
  } catch (error) {
    console.log("Something went wrong with getProductsCategories!", error);
  }
};
