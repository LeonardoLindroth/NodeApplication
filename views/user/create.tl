<!DOCTYPE html>
<html>
    <head>
        <title>User</title>
        <link href="/assets/styles/main.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/sidebar.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-pane.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-form.css" type="text/css" rel="stylesheet"/>
    </head>
    <body>
        <section class="content">
            + render ./views/sidebar/sidebar.tl +

            <main>
                <h1>Add User</h1>

                <section class="vinil-pane">
                    <section class="vinil-pane-header">
                        <h2 class="vinil-pane-title">User Form</h2>
                    </section>

                    <section class="vinil-pane-content">
                        <form class="vinil-form js-create-user-form" method="POST" data-url="/user/add" data-redirect="/user/list">
                            <section class="vinil-form-group">
                                <label class="vinil-form-label">Name</label>
                                <input name="name" class="vinil-form-input"/>
                            </section>

                            <section class="vinil-form-group">
                                <label class="vinil-form-label">Age</label>
                                <input name="age" class="vinil-form-input"/>
                            </section>

                            <section class="vinil-form-group">
                                <label class="vinil-form-label">Hair Color</label>
                                <select name="hairColor" class="vinil-form-select">
                                    <option>Yellow</option>
                                    <option>Black</option>
                                    <option>Brown</option>
                                    <option>White</option>
                                </select>
                            </section>

                            <button type="submit" class="vinil-form-button">Enviar</button>
                        </form>
                    </section>
                </section>
            </main>
        </section>

        <script src="/assets/js/main.js"></script>
        <script src="/assets/js/sidebar.js"></script>
        <script src="/assets/js/request.js"></script>
        <script src="/assets/js/user/create.js"></script>
    </body>
</html>