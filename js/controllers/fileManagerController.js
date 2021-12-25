const btn_download_commands = $("#download_commands")[0];
const btn_upload_commands = document.getElementById("btn_upload_commands");

// On cLick button Save file 
btn_download_commands.addEventListener('click', () => {
    let dataToSave =
      JSON.stringify(infoBlockModel.getAll());
    fileManager.saveFile(dataToSave);
});

btn_upload_commands.addEventListener('change', (event) => {
  fileManager.loadFile(onFileLoaded);

  function onFileLoaded(text_from_file) {
      if (text_from_file) {
          // Get infoObjects from the file 
          infoBlockModel.new_infoObjects_to_add = JSON.parse(text_from_file);
          let title_dialog_upload_InfoBloks_from_file = "Get a commands from the file";
          dialogUploadCommands.show(title_dialog_upload_InfoBloks_from_file);
      }
      else {
          alert("ERROR! Data from file has not been loaded");
      }
  }

  // Give possibility to load the same file again.
  btn_upload_commands.value = "";
});