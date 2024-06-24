async function renderDetailProduct(id, elementParent, elementName) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (data.meta.success) {
      const {
        category,
        image_bg,
        imagesDetail,
        price_origin,
        sale,
        title,
        description_product,
      } = data.data;
      // const galleryImages = [image_bg, ...imagesDetail];
      const galleryImages = [image_bg];
      elementParent.innerHTML += `
                  <div class="product_info">
                      <div class="left_description">
                          <div class="description">
                            <a href="/index.html">${category}</a>
                            <h2 class="title_product">${title}</h2>
                            <p>${description_product}</p>
                          </div>
                      </div>
                           
                      <div class="center_img>
                        <div class="gallery">                       
                          <div class="cover_img">
                          <div class="boder_img">
                           ${galleryImages
                             .map((item) => `<img id="select" src="${item}" />`)
                             .join("")}
                          </div>  
                          </div> 
                        </div>  

                        <div class="right_description">                                
                          <div class="price">
                          <span>${price_origin} đ</span>
                          <p>${
                            price_origin - (price_origin / 100) * sale
                          } đ</p>    
                          </div>               
                      <button class="price_button" type="button">
                      Add to cart
                    </button>
                      </div>
                      </div>
                                  `;
      elementName.textContent = data.data.title;
    }
  } catch (error) {
    console.log("Something wrong with renderDetailProduct!", error);
  }
}
{
  /* <img id="show" src="${image_bg}" alt="${title}"/> */
}
