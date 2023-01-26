document.addEventListener("DOMContentLoaded", (e) => {
    document.querySelectorAll(".vinil-list-row").forEach((rowElement) => {
        rowElement.addEventListener("click", (ev) => {
            window.location.href = rowElement.dataset.url;
        });
    });
});