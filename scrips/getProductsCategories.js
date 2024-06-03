const getProductsCategories = async (categories, elementParent) => {
  try {
    const res = await fetch(`/api/products?category=${categories}`);
    const data = await res.json();
    if (data) {
      elementParent.innerHTML += `<div class="detail_products">
            ${data.data.map(
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
                                <span>${item.price_origin} đ</span>
                                <p>${
                                  item.price_origin -
                                  (item.price_origin / 100) * item.sale
                                } đ</p>      
                            </div>
                        </div>
                    </div>`
            )}
        </div>`;
    }
  } catch (error) {
    console.log("Something wrong with getProductsCategories!", error);
  }
};
