document.querySelector(".vinil-form-button").addEventListener("click", (e) => {
    e.preventDefault();

    request(document.querySelector(".js-create-user-form"));
});