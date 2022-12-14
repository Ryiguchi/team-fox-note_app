export default class View {
  noteSection = document.querySelector(".note-container");
  overlay = document.querySelector(".overlay");

  renderTagList(parEl, tags) {
    parEl.innerHTML = "";
    let markup = "";
    tags.forEach((tag) => {
      const newTag = tag.replaceAll(/\s+/g, "_");
      markup += `
        <li class="tag-selection tag-selection-${newTag}" data-tag="${newTag}">
          ${
            parEl.classList.contains("tag-list-toolbar")
              ? `
                  <i class="ph-tag-fill tag-icon-tag-menu tag-icon-tag-menu-fill 
                  tag-icon-tag-menu-${newTag} icon hidden"></i>
                  <i class="ph-tag tag-icon-tag-menu tag-icon-tag-menu-line 
                  tag-icon-tag-menu-${newTag} icon "></i>
                `
              : ""
          }
          ${tag}
        </li>
      `;
    });
    parEl.insertAdjacentHTML("beforeend", markup);
  }

  toggleActiveTag(el) {
    const [...children] = el.closest(".tag-selection").children;
    children.forEach((el) => el.classList.toggle("hidden"));
  }
}
