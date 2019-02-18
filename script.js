$(document).ready(function () {
    let all_of_tasks = false;
    showDataDiv(all_of_tasks);

    function main_table_click(e) {
        const myElement = e.target;
        if (myElement.className == 'subtask') {
            $('div#table_div').addClass('blur');

            add_elements_form(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate);
        } else if (myElement.className == 'edit_elements') {
            $('div#table_div').addClass('blur');
            console.log(e.target.dataset.taskid);
            edit_elements_form(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate)
        } else if (myElement.className == 'stats') {

            let $target = $(e.target).parent().parent().next().next();
            //console.log($target);
            $target.toggleClass('active');
            if ($target.hasClass('active')) {
                console.log('wtw');
                show_stats(e.target.dataset.taskid, e.target.dataset.taskname, e.target.dataset.taskbegindate, $target);
            }
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
                    alertify.success("Dodano etapy");
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
                    alertify.success("Oznaczono elementy");
                }
            })
            $('#start_course').val('');
            $('#end_course').val('');

        });

    };

    function show_stats(taskid, taskname, taskbegindate, $target) {
        //console.log(taskid);
        //let $target = $(etarget).parent().parent().next().next();
        //console.log($target);
        $.ajax({
            type: 'POST',
            url: 'stats_data.php',
            data: {
                idtask: taskid,

            },

            success: function (response) {
                console.log(response.done_stages, response.days_pass);
                $target.empty();
                let average = response.done_stages / response.days_pass;
                let average_by_7_days = response.done_for_7_days / 7;
                let average_by_30_days = response.done_for_30_days / 30;
                if (response.done_stages > 0) {
                    $target.append(`<div class="row_stats"><div class="main_average">średnia : </div><div>${average.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukonczysz za: </div><div>${Math.ceil(response.left_stages / average)} dni</div></div>`);
                } else {
                    $target.append('<p>brak statystyk</p>');
                }
                if (response.days_pass >= 7 && response.done_for_7_days > 0) {
                    $target.append(`<div class="row_stats"><div>średnia z ostatnich 7 dni: </div><div>${average_by_7_days.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(response.left_stages / average_by_7_days)} dni</div></div>`);
                }
                if (response.days_pass >= 30 && response.done_for_30_days > 0) {
                    $target.append(`<div class="row_stats"><div>średnia z ostatnich 30 dni: </div><div>${average_by_30_days.toFixed(2)}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(response.left_stages / average_by_30_days)} dni</div></div>`);
                }
            }
        });
    }

    function showDataDiv(all_of_tasks) {
        // $('#container').hide();
        $('#table_div').empty();

        $.ajax({
            type: 'GET',
            url: 'show_data.php',
            data: {
                all_of_tasks: all_of_tasks,

            },
            success: function (response) {

                $('#table_div').append('<div class="row_table"><div>nr</div><div>Zadanie</div><div>Data rozp.</div><div>Termin</div><div>Pr.</div><div></div><div></div><div></div></div>');

                $.each(response, function (index) {
                    let row_table = $("<div></div>").addClass("row_table");
                    let progress_bar_div = $("<div><div></div></div>").addClass("progress_bar").attr('data-taskid', response[index].idtask);

                    let stats_div = $("<div></div>").addClass("stats_data");
                    $('#table_div').append(row_table);
                    var number = response.indexOf(response[index]) + 1;
                    row_table.append(`<div>${number}</div><div class="task-in-table1">${response[index].task}</div><div class="date-in-table1">${response[index].begindate}</div><div class="deadline_date1">${response[index].deadline}</div><div class="priority1">${response[index].priority}</div><div><button class="stats" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Statystyki</button></div><div><button class="edit_elements" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Edycja</button></div><div><button class="subtask" data-taskid="${response[index].idtask}" data-taskname="${response[index].task}"  data-taskbegindate="${response[index].begindate}">Dodaj etapy</button></div>`);
                    $('#table_div').append(progress_bar_div);
                    $('#table_div').append(stats_div);

                });

                display_progress_bar(all_of_tasks);
            }

        });

    }

    function display_progress_bar(all_of_tasks) {
        let bars = document.querySelectorAll('.progress_bar');
        bars = [...bars];

        $.ajax({
            type: 'GET',
            url: 'get_average_data.php',
            data: {
                all_of_tasks: all_of_tasks,

            },
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
    $('nav').on('click', nav_click);

    function nav_click(e) {
        const myElement = e.target
        if (myElement.id === "animation") {
            animation_progress()
        } else if (myElement.id === "all_courses") {
            all_of_tasks = true;
            showDataDiv(all_of_tasks);
        } else if (myElement.id === "courses_in_progress") {
            all_of_tasks = false;
            showDataDiv(all_of_tasks);
        }


    }

    function animation_progress() {


        let bars = document.querySelectorAll('.progress_bar');
        bars = [...bars];

        bars.forEach(function (element, index) {
            // console.log();
            // console.dir(element, index);
            element.childNodes[0].style.width = 0 + '%';
            element.childNodes[0].textContent = 0 + '%';
        });


        $.ajax({
            type: 'get',
            url: 'get_all_stages.php',
            success: function (response) {
                console.log(response);
                show_animation_progress(response);


            }
        });

    }


    function show_animation_progress(data) {
        let bars = document.querySelectorAll('.progress_bar');
        bars = [...bars];
        let currentday = (new Date).getTime();
        const msInADay = 24 * 60 * 60 * 1000;
        let startday = currentday - 60 * msInADay;
        let counter = 0;
        $('#counter').show();
        let time = setInterval(function () {
            if (counter > 60) {
                clearInterval(time);
                $('#counter').hide();
            } else {

                document.querySelector('#counter').innerHTML = (new Date(startday)).toDateString();
                startday += msInADay;
                bars.forEach(function (element, index) {
                    let row_id = element.dataset.taskid;
                    //console.log(element, index);
                    //console.log(data[counter][index]);
                    let data_for_progress_bar = data[counter];
                    console.log(data_for_progress_bar);
                    data_for_progress_bar.forEach(function (item, index) {
                        if (item.idtask == row_id) {
                            console.log('ok');
                            let done_s = item.done_stages;
                            let all_s = item.all_stages;
                            let progress = (done_s / all_s * 100).toFixed(2);
                            element.childNodes[0].style.width = progress + '%';
                            element.childNodes[0].textContent = progress + '%';



                        }
                    })



                });
                counter++;
            }
        }, 500);


        function display_counter(counter) {

            document.querySelector('#counter').innerHTML = counter;

        }

        function render_progress_bar(data, row_id, element) {
            // console.log(data.idtask, row_id);
            // console.log(element);
            if (data.idtask != row_id) {
                return false;

            } else {

                console.log(data.idtask, row_id);
                let done_s = data.done_stages;
                let all_s = data.all_stages;
                let progress = (done_s / all_s * 100).toFixed(2);
                element.childNodes[0].style.width = progress + '%';
                element.childNodes[0].textContent = progress + '%';
            }
        }





    }
    // const main_table = document.querySelector('#table_div');
    // main_table.addEventListener('click', main_table_click);
    // if (data[counter][index]) {
    //     function render_progress_bar()
    //     let done_s = data[counter][index].done_stages;
    //     let all_s = data[counter][index].all_stages;
    //     let progress = (done_s / all_s * 100).toFixed(2);
    //     element.childNodes[0].style.width = progress + '%';
    //     element.childNodes[0].textContent = progress + '%';
    // }


})