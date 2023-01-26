<!DOCTYPE html>
<html>
    <head>
        <title>User</title>
        <link href="/assets/styles/main.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/sidebar.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-pane.css" type="text/css" rel="stylesheet"/>
        <link href="/assets/styles/vinil-list.css" type="text/css" rel="stylesheet"/>
    </head>
    <body>
        <section class="content">
            + render ./views/sidebar/sidebar.tl +

            <main>
                <h1>User</h1>

                <section class="vinil-pane">
                    <section class="vinil-pane-header">
                        <h2 class="vinil-pane-title">User List</h2>
                        <a class="vinil-pane-button" href="/user/create">Add User</a>
                    </section>

                    <section class="vinil-pane-content">
                        <section class="vinil-list">
                            <section class="vinil-list-header">
                                <span>
                                    Name
                                </span>
                                <span>
                                    Age
                                </span>
                                <span>
                                    Hair Color
                                </span>
                            </section>
                            <section class="vinil-list-body">
                                + each users +
                                    <section class="vinil-list-row">
                                        <span>
                                            | name |
                                        </span>
                                        <span>
                                            | age |
                                        </span>
                                        <span>
                                            | hairColor |
                                        </span>
                                    </section>
                                + /each +
                            </section>
                        </section>
                    </section>
                </section>
            </main>
        </section>

        <script src="/assets/js/main.js"></script>
        <script src="/assets/js/sidebar.js"></script>
    </body>
</html>