const buttons_back = $(".btn_back");

const onClickBtnClose = function() {
    console.log("on click btn close");

    infoPageView.close();
    // Also close info alert (by standart logic of API)
}

for (const btn_back of buttons_back) {
    btn_back.onclick = onClickBtnClose;
}