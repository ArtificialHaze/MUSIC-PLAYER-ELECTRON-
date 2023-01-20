const { dialog } = require("electron");
const jsAudio = require("jsmediatags");
const { remote } = require("electron/remote");

let mainWindow = remote.getCurrentWindow();
let audio = null;

const fileElementBtn = document.getElementById("file");
const titleElement = document.querySelector("title");
const descElement = document.querySelector("desc");

fileElementBtn.onclick = async () => {
  let file = await dialog.showOpenDialog(mainWindow, {
    filters: [
      {
        name: "Music files",
        extensions: ["mp3", "wav"],
      },
    ],
  });

  audio = new Audio(file.filePaths[0]);
  audio.play();

  jsAudio.read(file.filePaths[0], {
    onSuccess: (tag) => {
      let image = tag.tags.picture;
      if (image) {
        let base65String = "";
        for (let i = 0; i < image.data.length; i++) {
          base65String += String.fromCharCode(image.data[i]);
        }
        let base64 =
          "data:" + image.format + ";base64," + window.btoa(base65String);
        document.getElementById("image").setAttribute("src", base64);
      }
      titleElement.innerText = tag.tags.title;
      descElement.innerText = `
      <div class="container">
      <p>Artist:
      <b> ${tag.tags.artist}</b>
      </p>
      </br>
      <p>Genre:
      <b> ${tag.tags.genre}</b>
      </p>
      </br>
      <p>Album:
      <b> ${tag.tags.album}</b>
      </p>
      </div>
      `;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  console.log(file);
};
