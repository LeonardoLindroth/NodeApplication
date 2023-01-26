const request = (formReference) => {
    const formData = new FormData(formReference);
    const url = formReference.dataset.url;
    const method = formReference.method;
    const redirect = formReference.dataset.redirect;

    const body = new URLSearchParams(formData);

    fetch(url, {
        method: method,
        body: body
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.success) {
            alert(data.message);

            setTimeout(() => {
                window.location.href = redirect;
            }, 1000);
        }
    });
}