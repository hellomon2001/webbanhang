const getProductsCategories = async (elementParent) => {
  const categories = elementParent.getAttribute("category");
  try {
    const res = await fetch(`/api/products?category=${categories}`);
    const data = await res.json();
    console.log(categories, data);
    

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
                                <span>${item.price_origin} đ</span>
                                <p>${
                                  item.price_origin -
                                  (item.price_origin / 100) * item.sale
                                } đ</p>      
                            </div>
                        </div>
                    </div>`
              )
              .join("")}
        </div>`;
    } else {
      elementParent.innerHTML += `<div class="no_products">No products found in this category.</div>`;
    }
  } catch (error) {
    console.log("Something went wrong with getProductsCategories!", error);
  }
};
