// Search bar : ok
// Add user to "Follow" page : ok
// Remove user from "Follow" page: ok
// Pagination : ok

const BASE_URL = `https://lighthouse-user-api.herokuapp.com`
const INDEX_URL = BASE_URL + `/api/v1/users/`

const users = JSON.parse(localStorage.getItem('followPage')) || []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const searchSubmitBtn = document.querySelector("#search-submit-btn")

function renderUserList(data) {
  let html = ``

  data.forEach((user) => {
    html += `
      <div class="mb-2 mx-1" id="card-wrapper">
          <div class="card border-dark">
            <img src="${user.avatar}" class="card-img-top" alt="avatar" data-toggle="modal" data-target="#user-modal" data-id="${user.id}" id="card-user-avatar">
            <div class="card-body text-center sub">
              <h5 class="card-user-name">${user.name}<br>${user.surname}</h5>
              <button type="button" class="btn btn-outline-info btn-unfollow" data-id="${user.id}">Unfollow</button>
            </div>
          </div>
      </div>
    `
  })
  dataPanel.innerHTML = html
}

// User profile in modal
function showUserDetails(id) {
  const modalName = document.querySelector("#user-modal-name")
  const modalAge = document.querySelector("#user-modal-age")
  const modalBirthday = document.querySelector("#user-modal-birthday")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalRegion = document.querySelector("#user-modal-region")
  const modalImg = document.querySelector("#user-modal-avatar")
  
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      modalName.innerHTML = data.name + ` ` + data.surname;
      modalAge.innerText = ` age: ` + data.age
      modalBirthday.innerText = ` birthday: ` + data.birthday;
      modalEmail.innerText = ` email: ` + data.email;
      modalRegion.innerText = ` region: ` + data.region;
      modalImg.innerHTML = `
        <img src="${data.avatar}" alt="user-avatar">
      `
    })
    .catch((error) => {
      console.log(error)
    });
}

// Unfollow
function unfollow(id) {
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('followPage', JSON.stringify(users))
  renderUserList(users)
}

// Search bar
searchForm.addEventListener('submit', function onSearchFormClicked(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUsers = []

  filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  })

  if (!filteredUsers.length) {
    return alert(`Sorry, we didn't find this person:, ${keyword}`)
  }
  renderUserList(filteredUsers)
})


//Add eventListener to dataPanel
dataPanel.addEventListener('click', function onUnfollowClicked(event) {
  if (event.target.matches('#card-user-avatar')) {
    showUserDetails(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-unfollow')) {
    unfollow(Number(event.target.dataset.id))
  }
})

renderUserList(users)