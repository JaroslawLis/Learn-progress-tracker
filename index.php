<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Learn Tracker</title>
    <script src="vendor/jquery/jquery-3.3.1.min.js"></script>
    <script src="vendor/jquery/jquery-ui.min.js"></script>

    <script src="vendor/alertify/alertify.min.js"></script>
    <script src="script.js"></script>
    <link rel="stylesheet" href="vendor/alertify/alertify.core.css" />

    <link rel="stylesheet" href="vendor/alertify/alertify.default.css"  id="toggleCSS" />

    <link rel="stylesheet" href="css\style.css">


</head>

<body>
<header>
    <h4>Learn Progress Tracker</h4>
     <nav>
      <!--   <ul>
        <li><a href="#" id="animation">Progresja</a></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul> -->
    <div>
        <button type="button" class="btn" id="animation">progresja</button>
    </div>
    <div>
        <button type="button" class="btn" id="all_courses">Wszystkie kursy</button>
    </div>
    <div>
        <button type="button" class="btn" id="courses_in_progress">Kursy w toku</button>
    </div>
    <div>
        <button type="button" class="btn" id=""></button>
    </div>
    </nav>
</header>
<div id="counter"></div>
 <main>
<div id="table_div">
</div>
<div id="add_elements">
    <div id="add_elements_form">
    <h4>Zadanie</h4>
    <h1 id='task_name_in_form'></h1>
<form  method="post" id="add_elements_form_native">
<input type="number" name="start_course" id="start_course" placeholder="Początkowy etap" min="0" max="3000">


                     <input type="number" name="end_course" id="end_course" placeholder="Końcowy etap"  min="0" max="3000">
<div class="buttons">
                    <input type="button" value="zapisz" id="write_elements">
<button id="cancel-writesubtaks_new">anuluj</button>
</div>

</form>
<div></div>

</div>



</main>

</body>

</html>