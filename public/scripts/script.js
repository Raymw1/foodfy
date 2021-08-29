/* eslint-disable eqeqeq */
// =========== MENU ===========
const Menu = {
  menuOverlay: document.querySelector(".menu"),
  menuIcon: document.querySelector(".menu-icon"),
  open() {
    this.menuOverlay.classList.add("active");
    this.menuIcon.setAttribute("onclick", "Menu.close()");
    this.menuIcon.children[0].innerText = "close";
  },
  close() {
    this.menuOverlay.classList.remove("active");
    this.menuIcon.setAttribute("onclick", "Menu.open()");
    this.menuIcon.children[0].innerText = "menu";
  },
};

// =========== PAGINATION ===========

function paginate(selectedPage, totalPages) {
  let oldPage;
  const pages = [];
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    if (
      firstAndLastPage ||
      (pagesAfterSelectedPage && pagesBeforeSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      } else if (oldPage && currentPage - oldPage == 2) {
        pages.push(currentPage - 1);
      }
      pages.push(currentPage);
      oldPage = currentPage;
    }
  }
  return pages;
}

function createPagination(pagination) {
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const filter = pagination.dataset.filter;
  const pages = paginate(page, total);
  let elements = "";
  for (const page of pages) {
    if (filter) {
      elements +=
        page != "..."
          ? `<a href="?page${page}&filter=${filter}">${page}</a>`
          : "<span>...</span>";
    } else {
      elements +=
        page != "..."
          ? `<a href="?page=${page}">${page}</a>`
          : "<span>...</span>";
    }
  }
  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");
if (pagination) {
  createPagination(pagination);
}

// =========== PHOTOS UPLOAD ===========
const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: document.querySelector(".avatar") ? 1 : 5,
  lastInput: document.querySelector("#photos-input")?.value,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    const { uploadLimit, preview, getContainer, hasLimit } = PhotosUpload;
    if (hasLimit(uploadLimit, event)) return event.preventDefault();
    PhotosUpload.lastInput = event.target.value;
    PhotosUpload.input = event.target;
    Array.from(fileList).forEach((file) => {
      PhotosUpload.files.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);
        const div = getContainer(image);
        preview.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(uploadLimit, event) {
    const { input, preview } = PhotosUpload;
    const { files: fileList } = event.target;
    const photosDiv = [];
    preview.childNodes.forEach((item) => {
      if (item.classList?.value == "photo") {
        photosDiv.push(item);
      }
    });
    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos!`);
      event.preventDefault();
      event.target.value = PhotosUpload.lastInput;
      return 1;
    }
    return 0;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();
    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");
    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image);
    div.appendChild(PhotosUpload.getRemoveBtn());
    return div;
  },
  getRemoveBtn() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);
    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input = PhotosUpload.getAllFiles();
    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;
    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        "input[name='removed_files']"
      );
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }
    photoDiv.remove();
  },
};

const Lightbox = {
  target: document.querySelector(".lightbox-target"),
  closeBtn: document.querySelector(".lightbox-close"),
  open() {
    Lightbox.target.style.top = 0;
    Lightbox.target.style.opacity = 1;
    Lightbox.closeBtn.style.top = 0;
  },
  close() {
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.opacity = 0;
    Lightbox.closeBtn.style.top = "-80px";
  },
};

const ImageGallery = {
  highlight: document.querySelector(".highlight"),
  imagesInGallery: document.querySelectorAll("#images-wrapper img"),
  setImage(event) {
    const wantedImage = event.target;
    ImageGallery.changeAttributes(ImageGallery.highlight, wantedImage);
    ImageGallery.changeAttributes(
      Lightbox.target.querySelector("img"),
      wantedImage
    );
    ImageGallery.imagesInGallery.forEach((image) => {
      image.classList.remove("active");
    });
    wantedImage.classList.add("active");
  },
  changeAttributes(target, wantedTarget) {
    target.src = wantedTarget.src;
    target.alt = wantedTarget.alt;
  },
};

// =========== VALIDATE ===========
const Validate = {
  errorBox: document.querySelector(".message-box"),
  apply(input, func) {
    Validate.clearErrors();
    const results = Validate[func](input.value);
    input.value = results.value;
    if (results.error) {
      Validate.displayError(input, results.error);
    }
  },
  clearErrors() {
    if (Validate.errorBox.classList.contains("show")) {
      Validate.errorBox.classList.remove("show");
    }
  },
  displayError(input, error) {
    Validate.errorBox.innerHTML = `${error}`;
    Validate.errorBox.classList.add("show");
    Validate.errorBox.classList.add("error-message");
    setTimeout(() => {
      Validate.errorBox.classList.remove("show");
      Validate.errorBox.classList.remove("error-message");
    }, 4000);
    input.focus();
  },
  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.match(mailFormat)) {
      error = "Email inválido!";
    }
    return {
      error,
      value,
    };
  },
  allFields(event) {
    const fields = document.querySelectorAll(
      ".input-group input, .input-group select, .input-group textarea"
    );
    for (const field of fields) {
      if (
        field.value.trim() == "" &&
        field.name != "removed_files" &&
        field.name != "avatar" &&
        field.name != "photos"
      ) {
        event.preventDefault();
        Validate.errorBox.innerHTML = `Por favor, preencha todos os campos!`;
        Validate.errorBox.classList.add("show");
        Validate.errorBox.classList.add("error-message");
        setTimeout(() => {
          Validate.errorBox.classList.remove("show");
          Validate.errorBox.classList.remove("error-message");
        }, 4000);
      }
    }
  },
};
