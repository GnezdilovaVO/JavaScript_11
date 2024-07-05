"use strict";
document.addEventListener("DOMContentLoaded", Main);

// all elements
const photoConteinerEl = document.querySelector("#photo-container");
const likeEl = document.querySelector(".like");
console.log(likeEl);
const dislikeEl = document.querySelector(".dislike");
console.log(dislikeEl);
const countLike = document.querySelector(".count_like");
console.log(countLike);

//localStorage
const photoStorageKey = "photo";
const photos = JSON.parse(localStorage.getItem(photoStorageKey));
const photoWithLike = [];

let counter = 0;
let isLike = false;

async function fetchRandomPhoto() {
  const responce = await fetch(`https://api.unsplash.com/photos/random`, {
    headers: {
      Authorization: "Client-ID ...",
    },
  });
  if (!responce.ok) {
    throw new Error(`Error: ${responce.status}`);
  }
  return await responce.json();
}

async function Main() {
  createLikeImg(photos);
  let photoString = "";
  const data = await fetchRandomPhoto();
  const idPhoto = data.id;
  const urlPhoto = data.urls.regular;
  photoString += createImg(data);
  photoConteinerEl.innerHTML = photoString;
  if (localStorage.getItem(photoStorageKey)) {
    JSON.parse(localStorage.getItem(photoStorageKey)).forEach((element) => {
      if (element.id === idPhoto) {
        countLike.innerHTML = element.likes;
        likeEl.disabled = true;
      } else {
        console.log("New photo");
      }
    });
  }
  likeEl.addEventListener("click", () => {
    counter++;
    isLike = true;
    countLike.innerHTML = counter;
    if (localStorage.getItem(photoStorageKey)) {
      const newPhoto = {
        id: idPhoto,
        like: isLike,
        count: counter,
        urlPhoto: urlPhoto,
      };
      photoWithLike.push(newPhoto);
      let allEl = photos;
      allEl.forEach((element) => {
        photoWithLike.push(element);
      });
      localStorage.setItem(photoStorageKey, JSON.stringify(photoWithLike));
    } else {
      const allEl = [];
      allEl.push({ id: idPhoto, like: isLike, count: counter });
      localStorage.setItem(photoStorageKey, JSON.stringify(allEl));
    }
    likeEl.disabled = true;
    dislikeEl.disabled = false;
    dislikeEl.style.display = "block";
    createLikeImg(photoWithLike);
  });
  dislikeEl.addEventListener("click", () => {
    counter--;
    countLike.innerHTML = counter;
    likeEl.disabled = false;
    dislikeEl.disabled = true;
    let allEl = photos;
    allEl.forEach((element, index) => {
      if (element.id === idPhoto) {
        allEl.splice(index, 1);
      }
    });
    localStorage.setItem(photoStorageKey, JSON.stringify(allEl));
    createLikeImg(allEl);
  });
}

function createImg(objPhoto) {
  return `<div class="photo">
        <img class="img" src="${objPhoto.urls.regular}" alt="" />
        <h3>${objPhoto.user.first_name}</h3>
      </div>`;
}
function createLikeImg(photos) {
  const likePhotosEls = document.querySelector("#photo-container_liked");
  photos.forEach((photo) => {
    likePhotosEls.insertAdjacentHTML(
      "beforeend",
      `<div class="photo">
      <img class="img" src="${photo.urlPhoto}" alt="" />
      </div>`
    );
  });
}
