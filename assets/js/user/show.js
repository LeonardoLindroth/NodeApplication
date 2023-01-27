document.querySelector(".js-edit-user-button").addEventListener("click", (e) => {
    const formElement = document.querySelector(".js-user-update-form");
    formElement.querySelectorAll("input, select, button").forEach((element) => {
        element.disabled = false;
    });
});

document.querySelector(".vinil-form-button").addEventListener("click", (e) => {
    e.preventDefault();

    request(document.querySelector(".js-user-update-form"));
});

document.querySelector(".js-delete-user-button").addEventListener("click", (e) => {
    e.preventDefault();

    request(document.querySelector(".js-delete-user-form"));
});