const list = document.querySelector("#posts-list");
const search = document.querySelector(".search-input");
const filter = document.querySelector(".category-filter");
const addBtn = document.querySelector(".create-post-btn");
const modal = document.querySelector(".post-modal");
const closeBtn = document.querySelector(".cancel-post");
const postTitle = document.querySelector(".post-title");
const postCategory = document.querySelector(".post-category");
const postText = document.querySelector(".post-description");
const publishBtn = document.querySelector(".publish-post");
const readModal = document.querySelector(".read-modal");
const readClose = document.querySelector(".read-close");
const readCategory = document.querySelector(".read-category")
const readDate = document.querySelector(".read-date");
const readText = document.querySelector(".read-text")
const readTitle = document.querySelector(".read-title");

addBtn.addEventListener("click", function () {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editId = null;


publishBtn.addEventListener("click", function(){

    const title = postTitle.value.trim();
    const category = postCategory.value;
    const text = postText.value.trim();

    if(title === "" || text === ""){
        alert("Please enter title and description");
        return;
    }

    if(editId !== null){

        const post = posts.find(function(post){
            return post.id === editId;
        });

        post.title = title;
        post.category = category;
        post.text = text;

        editId = null;

    } else {

        const post = {
            id: Date.now(),
            title: title,
            category: category,
            text: text
        };

        posts.push(post);
    }

    localStorage.setItem("posts", JSON.stringify(posts));

    showPosts();

    modal.style.display = "none";

    postTitle.value = "";
    postText.value = "";
    postCategory.value = "javascript";
});

function showPosts(data = posts) {
  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = `
        <div class="posts-empty">
            No posts found.
        </div>
    `;
    return;
}
  data.forEach(function (post) {
    const card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = ` 
    <div class = "post-meta">
    <span>${post.category}</span>
     <span class="dot"></span>
                <span>${new Date(post.id).toLocaleDateString()}</span>
            </div>

            <h3>${post.title}</h3>

            <p>${post.text}</p>
            <div class="post-actions">

    <button class="edit-post" onclick="editPost(${post.id})">
        Edit
    </button>

    <button class="delete-post" onclick="deletePost(${post.id})">
        Delete
    </button>

</div>

            <a href="#" class="post-link" onclick="readPost(${post.id})">
    Read Post
    <span class="arrow">→</span>
</a>`;
    list.appendChild(card);
  });
}

showPosts();
function readPost(id) {

    const post = posts.find(function (post) {
        return post.id === id;
    });

    if (!post) {
        return;
    }

    readCategory.textContent = post.category;
    readTitle.textContent = post.title;
    readDate.textContent = new Date(post.id).toLocaleDateString();
    readText.textContent = post.text;

    readModal.style.display = "flex";
}

function deletePost(id) {
  posts = posts.filter(function (post) {
    return post.id !== id;
  });
  localStorage.setItem("posts", JSON.stringify(posts));
  showPosts();
}

function editPost(id) {
  const post = posts.find(function (post) {
    return post.id === id;
  });
  editId = id;
  postTitle.value = post.title;
  postCategory.value = post.category;
  postText.value = post.text;
  modal.style.display = "flex";
  publishBtn.textContent = "Update Post";
}

function filterPosts(){
  const word = search.value.toLowerCase().trim();
  const selected = filter.value;
 const data = posts.filter(function(post){

    const matchWord = post.title.toLowerCase().includes(word);

    const matchCategory =
        selected === "all" || post.category === selected;

    return matchWord && matchCategory;
});
  showPosts(data)
}
search.addEventListener("input", filterPosts);
filter.addEventListener("change",filterPosts);
readClose.addEventListener("click", function(){
  readModal.style.display = "none"
})

readModal.addEventListener("click", function(e){
  if(e.target === readModal){
    readModal.style.display = "none"
  }
})

document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    readModal.style.display = "none"
  }
})