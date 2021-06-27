// Search bar : ok
// Add user to "Follow" page : ok
// Remove user from "Follow" page: ok
// Pagination : ok


const BASE_URL = `https://lighthouse-user-api.herokuapp.com`
const INDEX_URL = BASE_URL + `/api/v1/users/`

const users = []
let filteredUsers = []
const users_per_page = 16

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const searchSubmitBtn = document.querySelector("#search-submit-btn")
const paginator = document.querySelector("#paginator")

function renderUserList(data) {
  let html = ``  
    data.forEach((user) => {
      html += `
      <div class="mb-2 mx-1" id="card-wrapper">
          <div class="card border-dark">
            <img src="${user.avatar}" class="card-img-top" alt="avatar" data-toggle="modal" data-target="#user-modal" data-id="${user.id}" id="card-user-avatar">
            <div class="card-body text-center">
              <h5 class="card-user-name">${user.name}<br>${user.surname}</h5>
              <button type="button" class="btn btn-outline-info btn-follow" data-id="${user.id}">Follow</button>
            </div> 
          </div>
      </div>
    `
    })
  dataPanel.innerHTML = html  
}

function showUserDetails(id) {
  const modalName = document.querySelector("#user-modal-name")
  const modalAge = document.querySelector("#user-modal-age")
  const modalBirthday = document.querySelector("#user-modal-birthday")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalRegion = document.querySelector("#user-modal-region")
  const modalImg = document.querySelector("#user-modal-avatar")

  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      // console.log(data);
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

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((error) => {
    console.log(error)
  });

// Search bar.
searchForm.addEventListener('submit', function onSearchFormClicked(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  })

  if (!filteredUsers.length) {
    return alert(`Sorry, we didn't find this person:, ${keyword}`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

//Add someone to "Follow" page.
//localStorage.setItem('key','value' ) //localStorage.getItem('key') //localStorage.removeItem('key')
function addToFollowPage(id) {
  const list = JSON.parse(localStorage.getItem('followPage')) || []
  const user = users.find((user) => user.id === id)
  
  if (list.some((user) => user.id === id)) {
    return alert("Already followed.")
  }
  list.push(user)
  localStorage.setItem('followPage', JSON.stringify(list))
  }

//Pagination
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * users_per_page
  return data.slice(startIndex, startIndex + users_per_page)
}

function renderPaginator(amount) {
  const totalPages = Math.ceil(amount / users_per_page)
  let rawHTML = ''
  for (let page = 1; page <= totalPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML 
}

//Add eventListener to dataPanel
dataPanel.addEventListener('click', function onAvatarClicked(event) {
  if (event.target.matches('#card-user-avatar')) {
    showUserDetails(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-follow')) {
    addToFollowPage(Number(event.target.dataset.id))
  }
})

//Add eventListener to paginator
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page)) 
})