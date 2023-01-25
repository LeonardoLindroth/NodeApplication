document.querySelector(".vinil-form-button").addEventListener("click", (e) => {
    e.preventDefault();

    let formData = new FormData(document.querySelector(".vinil-form"));

    const body = new URLSearchParams(formData);

    fetch("/user", {
        method: "POST",
        body: body
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.success) {
            alert(data.message);

            setTimeout(() => {
                window.location.href = "/user/list.tl";
            }, 1000);
        }
    });
})