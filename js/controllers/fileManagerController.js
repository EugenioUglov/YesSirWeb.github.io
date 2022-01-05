

class FileManagerController {
  constructor() {
    this.setListeners();
  }

  downloadActionBlocks() {
    const content =
      JSON.stringify(infoBlockModel.getAll());

    const date_obj = new Date();
    const date_text = date_obj.today() + '  ' + date_obj.timeNow();

    // Set variable for name of the saving file with date and time. 
    const file_name = 'Action-Blocks ' + date_text;
    const extension = '.json';

    fileManager.saveFile(content, file_name, extension);
  }

  setListeners() {
    const btn_upload_commands = document.getElementById('btn_upload_commands');

    // On cLick button Save file.
    $('#btn_download_actionBlocks')[0].addEventListener('click', () => {
      this.downloadActionBlocks();
    });

    // On cLick button Upload file.
    btn_upload_commands.addEventListener('change', (event) => {
      fileManager.uploadFile(onFileLoaded);
    
      function onFileLoaded(content_of_file) {
          if (content_of_file) {
              // Get infoObjects from the file.
              // infoBlockModel.new_infoObjects_to_add = JSON.parse(content_of_file);
              actionBlockController.save(JSON.parse(content_of_file));
              let title_dialog_upload_InfoBloks_from_file = 'Get a commands from the file';
              // dialogUploadCommands.show(title_dialog_upload_InfoBloks_from_file);
          }
          else {
              alert('ERROR! Data from the file has not been loaded');
          }
      }
    
      // Give possibility to load the same file again.
      btn_upload_commands.value = '';
    });
  }

}




