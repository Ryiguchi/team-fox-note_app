export default class View {
  noteSection = document.querySelector(".note-container");
  overlay = document.querySelector(".overlay");

  // tag-list-filter
  // tagListTitleAll;

  renderTagList(parEl, tags) {
    parEl.innerHTML = "";
    let markup = "";
    tags?.forEach((tag, i) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `
        ${
          parEl.classList.contains("tag-list-title") && i === 0
            ? `<div>Tags:</div>`
            : ""
        }
       ${
         parEl.classList.contains("tag-list-title")
           ? '<div class="triangle-left"></div>'
           : ""
       }
        <li class="tag-selection tag-selection-${newTag} tag-selection-${
        parEl.classList.contains("tag-list-title") ? "title" : ""
      }${parEl.classList.contains("tag-list-title-all") ? "title-list" : ""}${
        parEl.classList.contains("tag-list-filter") ? "filter" : ""
      }" data-tag="${newTag}"
        >
          ${
            parEl.classList.contains("tag-list-title-all")
              ? `
                  <i class="ph-tag-fill tag-icon-tag-menu tag-icon-tag-menu-fill 
                  tag-icon-tag-menu-${newTag} icon hidden"></i>
                  <i class="ph-tag tag-icon-tag-menu tag-icon-tag-menu-line 
                  tag-icon-tag-menu-${newTag} icon "></i>
                `
              : ""
          }
          
                    
          ${tag}
          ${
            parEl.classList.contains("tag-list-settings")
              ? '<i class="ph-minus-circle-bold remove-font-btn-settings icon"></i>'
              : ""
          }
          ${
            parEl.classList.contains("tag-list-title")
              ? `<i class="ph-x remove-tag-icon icon" data-tag="${tag}"></i><i class="ph-circle-fill tag-hole"></i>`
              : ""
          }
        </li>
      `;
    });

    parEl.insertAdjacentHTML("beforeend", markup);
  }

  toggleActiveTag(el) {
    const [...children] = el.closest(".tag-selection").children;
    children.forEach((el) => el.classList.toggle("hidden"));
  }

  toggleOverlay() {
    this.overlay.classList.toggle("hidden");
  }

  removeAllSiblingsAfter(el) {
    let nextSibling = el.nextElementSibling;
    while (nextSibling) {
      nextSibling.remove();
      nextSibling = el.nextElementSibling;
    }
  }
}
