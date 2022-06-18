const form = document.querySelector("form");
const addBtn = document.querySelector(".add");
const boxes = document.querySelector(".cards");
const fileUpload = document.getElementById("file-upload");

// https://api.cloudinary.com/v1_1/dzmoypakc/

const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dzmoypakc/upload";
const cloudinaryUploadPreset = "squadChat";

window.onload = async function () {
  await loadTemplate();
};

async function loadTemplate() {
  let items = await fetchData();
  let html = "";
  for (let i = 0; i < items.length; i++) {
    const htmlItem = generateTemplate(items[i]);
    html += htmlItem;
  }
  boxes.innerHTML = html;
}

const data = {
  title: "",
  description: "",
  price: 0,
  copies: 0,
  image: "",
};

const editData = {
  id: 0,
  title: "",
  description: "",
  price: 0,
  copies: 0,
  image: "",
};

function handleChange(val) {
  let key = val.getAttribute("name");
  let value = val.value;
  data[key] = value;
}

function handleEdit(val) {
  let key = val.getAttribute("name");
  let value = val.value;
  editData[key] = value;
}

fileUpload.addEventListener("change", (event) => {
  let file = event.target.files[0];
  console.log("file : ", file);
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryUploadPreset);
  axios({
    url: cloudinaryUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: formData,
  })
    .then((res) => {
      console.log(res);
      data.image = res.data.secure_url;
    })
    .catch((error) => {
      console.error(error);
    });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await addItem(data);
  await loadTemplate();
  form.reset();
  hideForm();
});

async function fetchData() {
  let response = await fetch("http://localhost/galerry/api/read.php/");
  let items = await response.json();
  return items.body;
}

async function addItem(data) {
  console.log(data);
  if (
    !data.title ||
    !data.description ||
    !data.price ||
    !data.copies ||
    !data.image
  ) {
    alert("Please fill all input !");
    return;
  }
  await fetch("http://localhost/galerry/api/create.php/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function deleteItem(item) {
  let id = item.getAttribute("id");
  let data = { id };
  await fetch("http://localhost/galerry/api/delete.php/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await loadTemplate();
}

function showEditForm(item) {
  let card = item.closest(".card");
  card.classList.add("hide");
  let id = item.getAttribute("id");
  editData.id = parseInt(id);

  let form = document.querySelector(`.form${id}`);
  form.classList.remove("hide");
  let data = form.children[0].children;

  for (let i = 1; i < data.length; i += 2) {
    let key = data[i].getAttribute("name");
    let value = data[i].value;
    if (key === "price" || key === "copies") {
      editData[key] = parseInt(value);
    } else {
      editData[key] = value;
    }
  }
  let key = data[8].getAttribute("name");
  let value = data[8].getAttribute("data");
  editData[key] = value;
}

async function editItem(event) {
  event.preventDefault();
  console.log(JSON.stringify(editData));
  await fetch("http://localhost/galerry/api/update.php/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editData),
  });
  await loadTemplate();
}

function editImageUpload(event) {
  let file = event.target.files[0];
  console.log("file : ", file);
  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryUploadPreset);
  axios({
    url: cloudinaryUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: formData,
  })
    .then((res) => {
      console.log(res);
      editData.image = res.data.secure_url;
    })
    .catch((error) => {
      console.error(error);
    });
}

// generate template function

function generateTemplate(data) {
  const { title, description, price, copies, image, id } = data;

  return `
<div class="card">
  <div class="card__info-hover">
    <img
      class="card__like"
      src="https://img.icons8.com/bubbles/50/undefined/edit.png"
      id="${id}"
      onclick="showEditForm(this)"
    />
    <div class="card__clock-info">
      <img
        src="https://img.icons8.com/external-anggara-filled-outline-anggara-putra/32/undefined/external-delete-user-interface-anggara-filled-outline-anggara-putra.png"
        class="card__like"
        id="${id}"
        onclick="deleteItem(this)"
      />
    </div>
  </div>
  <img
    src="${image}"
    class="img"
  />

  <div class="card__info">
    <h3 class="card__title">${title}</h3>
    <span class="card__category">${description}</span>
    <div class="inline">
      <span class="card__by">price : $${price}</span>
      <span class="card__by pad">Copies : ${copies}</span>
    </div>
  </div>
</div>
<div class="cardForm hide form${id}">
  
      <form class="edit-form" onsubmit="return editItem(event)" >
        <label>Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Your title.."
          value="${title}"
          onchange="handleEdit(this)"
          required
        />

        <label>Description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Your description.."
          value="${description}"
          onchange="handleEdit(this)"
          required
        />

        <label>price</label>
        <input
          type="number"
          id="price"
          name="price"
          value="${price}"
          onchange="handleEdit(this)"
          required
        />

        <label>copies</label>
        <input
          type="number"
          id="copies"
          name="copies"
          value="${copies}"
          onchange="handleEdit(this)"
          required
        />
        <input type="file" name="image" data="${image}" onchange="return editImageUpload(event)" />
        <button type="submit">Submit</button>
      </form>
    </div>
    `;
}
