function SidebarController() {
    this.reference = document.querySelector(".sidebar");
    const _this = this;

    this.init = () => {
        bindActions();
    };

    const bindActions = () => {
        const sidebarItems = _this.reference.querySelectorAll(".sidebar-item");

        sidebarItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                window.location = window.location.origin + item.dataset.url;
            });
        });
    };

    _this.init();
}

const sidebarController = new SidebarController();