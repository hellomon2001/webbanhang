const getProductsCategories = async (categories, elementParent) => {
  try {
    const res = await fetch(`/api/products?category=${categories}`);
    const data = await res.json();
    console.log(data);
    if (data) {
      elementParent.innerHTML += `<div class="list_products">
            ${data.data.map(
              (item) => `<div>
                        <div class="detail_product">
                            <div class="image-product"> 
                                <img src="${item.image_bg}" alt="${
                item.title
              }"/>
                            </div>    
                        </div>

                        <div class="information_product">
                            <p>${item.title}</p>
                            <div>
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
    console.log("Something wrong!",error);
  }
};
