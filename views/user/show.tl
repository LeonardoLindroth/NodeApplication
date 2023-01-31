<!DOCTYPE html>
<html>
    <head>
        <title>User</title>
        <link href="/assets/styles/main.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/sidebar.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-pane.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-show.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-form.css" type="text/css" rel="stylesheet"/>
    </head>
    <body>
        <section class="content">
            + render ./views/sidebar/sidebar.tl +

            <main>
                <h1>User</h1>

                <section class="vinil-pane">
                    <section class="vinil-pane-header">
                        <h2 class="vinil-pane-title">User Show</h2>
                        <a class="vinil-pane-button js-edit-user-button">Edit</a>
                        <a class="vinil-pane-button vinil-pane-button-danger js-delete-user-button">Delete</a>
                    </section>

                    <section class="vinil-pane-content">
                        <section class="vinil-show">
                            <form class="vinil-form js-delete-user-form" style="display: none" method="POST" data-url="/user/delete" data-redirect="/user/list">
                                + insert user +
                                    <input name="id" value="| user.id |" type="hidden" class="vinil-form-input"/>
                                + /insert +
                            </form>

                            <form class="vinil-form js-user-update-form" method="POST" data-url="/user/update" data-redirect="/user/list">
                                + insert user +
                                    <input name="id" value="| user.id |" type="hidden" class="vinil-form-input"/>

                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Name</label>
                                        <input name="name" value="| user.name |" class="vinil-form-input" disabled/>
                                    </section>

                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Age</label>
                                        <input name="age" value="| user.age |" class="vinil-form-input" disabled/>
                                    </section>

                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Hair Color</label>
                                        <select name="hairColor" class="vinil-form-select" disabled>
                                            <option | user.hairColor == "Yellow" ? "selected" : "" |>Yellow</option>
                                            <option | user.hairColor == "Black" ? "selected" : "" |>Black</option>
                                            <option | user.hairColor == "Brown" ? "selected" : "" |>Brown</option>
                                            <option | user.hairColor == "White" ? "selected" : "" |>White</option>
                                        </select>
                                    </section>
                                + /insert +

                                <button type="submit" class="vinil-form-button" disabled>Enviar</button>
                            </form>
                        </section>
                    </section>
                </section>
            </main>
        </section>

        <script src="/assets/js/main.js"></script>
        <script src="/assets/js/sidebar.js"></script>
        <script src="/assets/js/request.js"></script>
        <script src="/assets/js/user/show.js"></script>
    </body>
</html>