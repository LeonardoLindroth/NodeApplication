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
                        <a class="vinil-pane-button">Edit</a>
                    </section>

                    <section class="vinil-pane-content">
                        <section class="vinil-show">
                            <form class="vinil-form js-user-update-form" method="POST" data-url="/user/update" data-redirect="/user/list">
                                + insert users +
                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Name</label>
                                        <input name="name" value="| name |" class="vinil-form-input" disabled/>
                                    </section>

                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Age</label>
                                        <input name="age" value="| age |" class="vinil-form-input" disabled/>
                                    </section>

                                    <section class="vinil-form-group">
                                        <label class="vinil-form-label">Hair Color</label>
                                        <select name="hairColor" value="| hairColor |" class="vinil-form-select" disabled>
                                            <option>Yellow</option>
                                            <option>Black</option>
                                            <option>Brown</option>
                                            <option>White</option>
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