$(document).ready(function () {

    showDataDiv();

    function main_table_click(e) {
        const myElement = e.target;
        if (myElement.className == 'subtask') {
            $('div#table_div').addClass('blur');

            add_elements_form(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate);
        } else if (myElement.className == 'edit_elements') {
            $('div#table_div').addClass('blur');
            edit_elements_form(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate)
        } else if (myElement.className == 'stats') {
            show_stats(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate, e.target);
        }



    }

    function add_elements_form(taskid, taskname, taskbegindate) {
        taskbegindate = taskbegindate.substr(6, 4) + '-' + taskbegindate.substr(3, 2) + '-' + taskbegindate.substr(0, 2);
        $('#add_elements').show(300);
        $('#add_elements h4').text('Dodawanie etapów');
        $('#task_name_in_form').text(taskname);

        $('#cancel-writesubtaks_new').on('click', function (e) {
            e.preventDefault();
            //  $('.input_data_in_form').remove();
            $('div#table_div').removeClass('blur');
            $('#add_elements').hide(400);
        });
        writeElements(taskid, taskname, taskbegindate);
    }

    function edit_elements_form(taskid, taskname, taskbegindate) {
        taskbegindate = taskbegindate.substr(6, 4) + '-' + taskbegindate.substr(3, 2) + '-' + taskbegindate.substr(0, 2);
        $('#add_elements').show(300);
        $('#add_elements h4').text('Edycja etapów');
        $('#task_name_in_form').text(taskname);
        $('#cancel-writesubtaks_new').on('click', function (e) {
            e.preventDefault();
            $('div#table_div').removeClass('blur');
            $('.input_data_in_form').remove();
            $('#add_elements').hide(400);
            $('#start_course').val('');
            $('#end_course').val('');
        });
        $('#add_elements_form_native').prepend('<input type ="date" name="date_finish_element" class="input_data_in_form" placeholder="data zakonczenia" required>');
        editElements(taskid);


    }


    function writeElements(taskid, taskname, taskbegindate) {

        $('#write_elements').on('click', function (e) {
            e.preventDefault();
            var x = $('#start_course').val();
            var y = $('#end_course').val();


            $('form#add_elements_form_native').submit(function (e) {
                e.preventDefault();
            });
            // console.log(x, y);

            $.ajax({
                type: "POST",
                url: "add_elements.php",
                data: {
                    idtask: taskid,
                    taskname: taskname,
                    taskbegindate: taskbegindate,
                    start_course: x,
                    end_course: y,
                },

                success: function (response) {
                    // console.dir(response);
                    $('#add_elements').hide(300);
                    $('div#table_div').removeClass('blur');
                    showDataDiv();
                }
            });

            $('#start_course').val('');
            $('#end_course').val('');
            //console.log('end of fuction :)');

        });






    }


    function editElements(taskid) {

        $('#write_elements').on('click', function (e) {

            e.preventDefault();

            let initial_element = $('#start_course').val();
            let final_element = $('#end_course').val();
            let finish_date = $('#add_elements_form_native > input.input_data_in_form').val();
            $('form#add_elements_form_native').submit(function (e) {
                e.preventDefault();

            })


            $.ajax({
                type: "POST",
                url: "edit_elements.php",
                data: {
                    idtask: taskid,
                    initial_element: initial_element,
                    final_element: final_element,
                    finish_date: finish_date,
                },
                success: function (response) {
                    // console.dir(response);
                    $('.input_data_in_form').remove();
                    $('#add_elements').hide(300);
                    $('div#table_div').removeClass('blur');
                    display_progress_bar()
                }
            })
            $('#start_course').val('');
            $('#end_course').val('');

        });

    };

    function show_stats(taskid, taskname, taskbegindate, etarget) {
        console.log(taskid);
        let $target = $(etarget).parent().parent().next().next();
        //console.log($target);
        $.ajax({
            type: 'POST',
            url: 'stats_data.php',
            data: {
                idtask: taskid,

            },

            success: function (response) {
                console.log(response.done_stages);
                $target.empty();
                let average = response.done_stages / response.days_pass;
                let average_by_7_days = response.done_for_7_days / 7;
                let average_by_30_days = response.done_for_30_days / 30;
                if (response.done_stages > 0) {
                    $target.append(`<div class="row_stats"><div>średnia : </div><div>${average.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukonczysz za: </div><div>${Math.ceil(response.left_stages / average)} dni</div></div>`);
                } else {
                    $target.append('<p>brak statystyk</p>');
                }
                if (response.days_pass >= 7) {
                    $target.append(`<div class="row_stats"><div>średnia z ostatnich 7 dni: </div><div>${average_by_7_days.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(response.left_stages / average_by_7_days)} dni</div></div>`);
                }
                if (response.days_pass >= 30) {
                    $target.append(`<div class="row_stats"><div>średnia z ostatnich 30 dni: </div><div>${average_by_30_days.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(response.left_stages / average_by_30_days)} dni</div></div>`);
                }
            }
        });
    }

    function showDataDiv() {
        // $('#container').hide();
        $('#table_div').empty();

        $.ajax({
            type: 'GET',
            url: 'show_data.php',
            success: function (response) {

                $('#table_div').append('<div class="row_table"><div>nr</div><div>Zadanie</div><div>Data rozp.</div><div>Termin</div><div>Pr.</div><div></div><div></div><div></div></div>');

                $.each(response, function (index) {
                    let row_table = $("<div></div>").addClass("row_table");
                    let progress_bar_div = $("<div><div></div></div>").addClass("progress_bar");
                    let stats_div = $("<div></div>").addClass("stats");
                    $('#table_div').append(row_table);
                    var number = response.indexOf(response[index]) + 1;
                    row_table.append(`<div>${number}</div><div class="task-in-table1">${response[index].task}</div><div class="date-in-table1">${response[index].begindate}</div><div class="deadline_date1">${response[index].deadline}</div><div class="priority1">${response[index].priority}</div><div><button class="stats" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Statystyki</button></div><div><button class="edit_elements" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Edycja</button></div><div><button class="subtask" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Dodaj etapy</button></div>`);
                    $('#table_div').append(progress_bar_div);
                    $('#table_div').append(stats_div);

                });

                display_progress_bar();
            }

        });

    }

    function display_progress_bar() {
        let bars = document.querySelectorAll('.progress_bar');
        bars = [...bars];

        $.ajax({
            type: 'GET',
            url: 'get_average_data.php',
            success: function (response) {
                //console.log(response, bars);
                bars.forEach(function (element, index) {
                    // console.log();
                    // console.dir(element, index);
                    element.childNodes[0].style.width = response[index].progress + '%';
                    element.childNodes[0].textContent = response[index].progress + '%';
                });

            }
        });




        // console.log(bars[0]);


    }

    // listeners

    $('#table_div').on('click', main_table_click);

    // const main_table = document.querySelector('#table_div');
    // main_table.addEventListener('click', main_table_click);



})