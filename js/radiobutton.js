const radiobutton = {};

radiobutton.disable = function(radioButtonContainer) {
    let labelRadioButton = radioButtonContainer.children("label");
    labelRadioButton[0].style.cursor = "default";
  
    labelRadioButton.children("input")[0].disabled = true;
    radioButtonContainer[0].style.cursor = "default";
    radioButtonContainer[0].style.boxShadow = null;
  
    // Set color gray for text
    labelRadioButton.children(".text")[0].style.color = "#60606273";
    // Set color gray for radio icons
    labelRadioButton.children(".rdo")[0].style.backgroundImage = "linear-gradient(#474749, #606062)";
    labelRadioButton.children(".rdo")[0].style.display = null;
    $('.rdo:after').css('display', 'none');
}