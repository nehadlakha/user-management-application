const state = {
  userList: [],
};

// DOM - document object
const userContents = document.querySelector(".user__contents");
const userModal = document.querySelector(".user__modal__body");

const htmluserContent = ({ id, userN, mail, phone }) => `
  <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm user__card'>
      <div class='card-header d-flex gap-2 justify-content-end user__card__header'>
        <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="edituser.apply(this, arguments)">
          <i class='fas fa-pencil-alt' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteuser.apply(this, arguments)">
          <i class='fas fa-trash-alt' name=${id}></i>
        </button>
      </div>
      <div class='card-body'>
        <h4 class='user__card__title'>${userN}</h4>
        <p class='description trim-3-lines text-muted' data-gram_editor='false'>
          ${mail}
        </p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${phone}</span>
        </div>
      </div>
      <div class='card-footer'>
        <button 
        type='button' 
        class='btn btn-outline-primary float-right' 
        data-bs-toggle='modal'
        data-bs-target='#showuser'
        id=${id}
        onclick='openuser.apply(this, arguments)'
        >
          Open user
        </button>
      </div>
    </div>
  </div>
`;

const htmlModalContent = ({ id, userN, mail }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
    <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
    <h2 class='my-3'>${userN}</h2>
    <p class='lead'>
      ${mail}
    </p>
    </div>
  `;
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "users",
    JSON.stringify({
      users: state.userList,
    })
  );
};

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.users);

  if (localStorageCopy) state.userList = localStorageCopy.users;

  state.userList.map((cardDate) => {
    userContents.insertAdjacentHTML("beforeend", htmluserContent(cardDate));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    userN: document.getElementById("userName").value,
    mail: document.getElementById("email").value,
    phone: document.getElementById("phoneNo").value,
  };

  if (input.userN === "" || input.mail === "" || input.phone === "") {
    return alert("Please fill all the fields");
  }

  userContents.insertAdjacentHTML(
    "beforeend",
    htmluserContent({
      ...input,
      id,
    })
  );

  state.userList.push({ ...input, id });
  updateLocalStorage();
};

const openuser = (e) => {
  if (!e) e = window.event;

  const getuser = state.userList.find(({ id }) => id === e.target.id);
  userModal.innerHTML = htmlModalContent(getuser);
};

const deleteuser = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeuser = state.userList.filter(({ id }) => id !== targetID);
  state.userList = removeuser;

  updateLocalStorage();
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }

  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const edituser = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let userName;
  let email;
  let phoneNo;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  userName = parentNode.childNodes[2].childNodes[2];
  email = parentNode.childNodes[2].childNodes[4];
  phoneNo = parentNode.childNodes[2].childNodes[6].childNodes[0];
  submitButton = parentNode.childNodes[4].childNodes[0];

  userName.setAttribute("contenteditable", "true");
  email.setAttribute("contenteditable", "true");
  phoneNo.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode.childNodes);

  const userName = parentNode.childNodes[3].childNodes[3];
  const email = parentNode.childNodes[3].childNodes[5];
  const phoneNo = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    userName: userName.innerHTML,
    email: email.innerHTML,
    phoneNo: phoneNo.innerHTML,
  };

  let stateCopy = state.userList;

  stateCopy = stateCopy.map((user) =>
    user.id === targetID
      ? {
        id: user.id,
        name: updateData.userName,
        mail: updateData.email,
        phone: updateData.phoneNo,
      }
      : user
  );

  state.userList = stateCopy;
  updateLocalStorage();

  userName.setAttribute("contenteditable", "false");
  email.setAttribute("contenteditable", "false");
  phoneNo.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openuser.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showuser");
  submitButton.innerHTML = "Open user";
};

const searchuser = (e) => {
  if (!e) e = window.event;

  while (userContents.firstChild) {
    userContents.removeChild(userContents.firstChild);
  }

  const resultData = state.userList.filter(({ name }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  });

  console.log(resultData);

  resultData.map((cardData) => {
    userContents.insertAdjacentHTML("beforeend", htmluserContent(cardData));
  });
};
