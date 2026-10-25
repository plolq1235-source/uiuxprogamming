const serviceName = "독서 소모임 가을";
let isSubscribed = false;
let submitCount = 0;


function makeSubscribedMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
    
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");

const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent = 
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = 
        makeSubscribedMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}    

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바뀌기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    const maxLength = nicknameInput.maxLength;
    const currentLength =  Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed 
        ? "참가 신청을 시작할 수 있습니다."
        : "동의 후 참가 신청을 시작할 수 있습니다.";
    
    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}


agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel  = document.querySelector("#"+targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow= document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress__item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["0", "1", "2","3","4", "5","6","7","8","9", "10"];

const genrePrev = document.querySelector("#genre-prev");
const genreNext = document.querySelector("#genre-next");
const summaryGenre = document.querySelector("#summary-genre");

const formData = {
    title:"", duration: "5", qna:false, qnaCount: "2", genre: "소설"
};

function showStep(index) {
    flowSteps.forEach((step, i) => {step.hidden = i !== index;});
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingCorfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.showModal();
});
recordingCancel.addEventListener("click", () => {
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);
recordingCorfirm.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior: "smooth"});
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if(!value){
        titleError.textContent = "책 제목을 입력해주세요"; 
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if(!validateTitle()) return ;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "권" ;
});
qnaOption.addEventListener("change", () => {
    qnaOptions.hidden =! qnaOption.checked ;

});

optionPrev.addEventListener("click", () => { showStep(0)});
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked ;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count.value;
    showStep(2);
});

genrePrev.addEventListener("click", () => { showStep(1)});
genreNext.addEventListener("click", () => {
    const selectedGenre = document.querySelector('input[name="genre"]:checked');
    formData.genre = selectedGenre.value;
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "권";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "선택 " : "미선택";
    summaryGenre.textContent = formData.genre;
    showStep(3);
});

summaryPrev.addEventListener("click", () => showStep(2));
finishButton.addEventListener("click", () => showStep(4));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    formData.genre = "소설";
    titleInput.value = "";
    titleError.textContent = "" ;
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5권";
    qnaOption.checked = false ;
    qnaOptions.hidden = true ;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true ;
    document.querySelector('input[name="genre"][value="소설"]').checked = true ;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    summaryGenre.textContent = "";
    showStep(0);
});