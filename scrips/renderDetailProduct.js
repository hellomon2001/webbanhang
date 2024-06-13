async function renderDetailProduct(id, elementParent, elementName) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    if (data.meta.success) {
      const { category, image_bg, imagesDetail, price_origin, sale, title } =
        data.data;
      // const galleryImages = [image_bg, ...imagesDetail];
      const galleryImages = [image_bg];
      elementParent.innerHTML += `
                  <div>
                      <div class="image_content">
                          <div class="img_container">

                              <div class="gallery">
                                  ${galleryImages
                                    .map(
                                      (item) =>
                                        `<img id="select" src="${item}" />`
                                    )
                                    .join("")}
                              </div>
                          <div>
                      </div>
                      <div class="infor_content">
                      <p>${title}</p>
                      <div>
                          <span>${price_origin} đ</span>
                          <p>${
                            price_origin - (price_origin / 100) * sale
                          } đ</p>      
                      </div>
                      </div>
                  </div>
              `;
      elementName.textContent = data.data.title;
    }
  } catch (error) {
    console.log("Something wrong with renderDetailProduct!", error);
  }
}
{/* <img id="show" src="${image_bg}" alt="${title}"/> */}