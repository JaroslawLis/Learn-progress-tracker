$(document).ready(function () {
    let all_of_tasks = false;
    showDataDiv(all_of_tasks);

    function main_table_click(e) {
        const myElement = e.target;
        if (myElement.className == "subtask") {
            $("div#table_div").addClass("blur");

            add_elements_form(
                e.target.dataset.taskid,
                e.target.dataset.taskname,
                e.target.dataset.taskbegindate
            );
        } else if (myElement.className == "edit_elements") {
            $("div#table_div").addClass("blur");

            edit_elements_form(
                e.target.dataset.taskid,
                e.target.dataset.taskname,
                e.target.dataset.taskbegindate
            );
        } else if (myElement.className == "stats") {
            let $target = $(e.target)
                .parent()
                .parent()
                .next()
                .next();
            //console.log($target);
            $target.toggleClass("active");
            if ($target.hasClass("active")) {
                show_stats(
                    e.target.dataset.taskid,
                    e.target.dataset.taskname,
                    e.target.dataset.taskbegindate,
                    $target
                );
            }
        }
    }

    function add_elements_form(taskid, taskname, taskbegindate) {
        taskbegindate =
            taskbegindate.substr(6, 4) +
            "-" +
            taskbegindate.substr(3, 2) +
            "-" +
            taskbegindate.substr(0, 2);
        $("#add_elements").show(300);
        $("#add_elements h4").text("Dodawanie etapów");
        $("#task_name_in_form").text(taskname);

        $("#cancel-writesubtaks_new").on("click", function (e) {
            e.preventDefault();
            //  $('.input_data_in_form').remove();
            $("div#table_div").removeClass("blur");
            $("#add_elements").hide(400);
        });
        writeElements(taskid, taskname, taskbegindate);
    }

    function edit_elements_form(taskid, taskname, taskbegindate) {
        taskbegindate =
            taskbegindate.substr(6, 4) +
            "-" +
            taskbegindate.substr(3, 2) +
            "-" +
            taskbegindate.substr(0, 2);
        $("#add_elements").show(300);
        $("#add_elements h4").text("Edycja etapów");
        $("#task_name_in_form").text(taskname);
        $("#cancel-writesubtaks_new").on("click", function (e) {
            e.preventDefault();
            $("div#table_div").removeClass("blur");
            $(".input_data_in_form").remove();
            $("#add_elements").hide(400);
            $("#start_course").val("");
            $("#end_course").val("");
        });
        $("#add_elements_form_native").prepend(
            '<input type ="date" name="date_finish_element" class="input_data_in_form" placeholder="data zakonczenia" required>'
        );
        editElements(taskid);
    }

    function writeElements(taskid, taskname, taskbegindate) {
        $("#write_elements").on("click", function (e) {
            e.preventDefault();
            var x = $("#start_course").val();
            var y = $("#end_course").val();

            $("form#add_elements_form_native").submit(function (e) {
                e.preventDefault();
            });

            $.ajax({
                type: "POST",
                url: "add_elements.php",
                data: {
                    idtask: taskid,
                    taskname: taskname,
                    taskbegindate: taskbegindate,
                    start_course: x,
                    end_course: y
                },

                success: function (response) {
                    // console.dir(response);
                    $("#add_elements").hide(300);
                    $("div#table_div").removeClass("blur");
                    alertify.success("Dodano etapy");
                    showDataDiv(all_of_tasks);
                }
            });

            $("#start_course").val("");
            $("#end_course").val("");
            //console.log('end of fuction :)');
        });
    }

    function editElements(taskid) {
        $("#write_elements").on("click", function (e) {
            e.preventDefault();

            let initial_element = $("#start_course").val();
            let final_element = $("#end_course").val();
            let finish_date = $(
                "#add_elements_form_native > input.input_data_in_form"
            ).val();
            $("form#add_elements_form_native").submit(function (e) {
                e.preventDefault();
            });

            $.ajax({
                type: "POST",
                url: "edit_elements.php",
                data: {
                    idtask: taskid,
                    initial_element: initial_element,
                    final_element: final_element,
                    finish_date: finish_date
                },
                success: function (response) {

                    $(".input_data_in_form").remove();
                    $("#add_elements").hide(300);
                    $("div#table_div").removeClass("blur");
                    display_progress_bar(all_of_tasks);
                    alertify.success("Oznaczono elementy");
                }
            });
            $("#start_course").val("");
            $("#end_course").val("");
        });
    }



    function show_stats(taskid, taskname, taskbegindate, $target) {

        $.ajax({
            type: "POST",
            url: "stats_data.php",
            data: {
                idtask: taskid
            },

            success: function (response) {
                $target.empty();
                let average = response.done_stages / response.days_pass;
                let average_by_7_days = response.done_for_7_days / 7;
                let average_by_30_days = response.done_for_30_days / 30;
                if (response.done_stages > 0) {
                    $target.append(
                        `<div class="row_stats"><div class="main_average">średnia : </div><div>${average.toFixed(
              2
            )}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukonczysz za: </div><div>${Math.ceil(
              response.left_stages / average
            )} dni</div></div>`
                    );
                } else {
                    $target.append("<p>brak statystyk</p>");
                }
                if (response.days_pass >= 7 && response.done_for_7_days > 0) {
                    $target.append(
                        `<div class="row_stats"><div>średnia z ostatnich 7 dni: </div><div>${average_by_7_days.toFixed(
              2
            )}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(
              response.left_stages / average_by_7_days
            )} dni</div></div>`
                    );
                }
                if (response.days_pass >= 30 && response.done_for_30_days > 0) {
                    $target.append(
                        `<div class="row_stats"><div>średnia z ostatnich 30 dni: </div><div>${average_by_30_days.toFixed(
              2
            )}</div></div><div class="row_stats"><div>Przy tej średniej kurs ukończysz za: </div><div>${Math.ceil(
              response.left_stages / average_by_30_days
            )} dni</div></div>`
                    );
                }
            }
        });
    }

    function showPeriodStats() {
        let obj = new Stats;
        obj.get_data_from_base();
    }





    function showDataDiv(all_of_tasks) {
        // $('#container').hide();
        $("#table_div").empty();

        $.ajax({
            type: "GET",
            url: "show_data.php",
            data: {
                all_of_tasks: all_of_tasks
            },
            success: function (response) {
                $("#table_div").append(
                    '<div class="row_table"><div>nr</div><div>Zadanie</div><div>Data rozp.</div><div>Termin</div><div>Pr.</div><div></div><div></div><div></div></div>'
                );

                $.each(response, function (index) {
                    let row_table = $("<div></div>").addClass("row_table");
                    let progress_bar_div = $("<div><div></div></div>")
                        .addClass("progress_bar")
                        .attr("data-taskid", response[index].idtask);

                    let stats_div = $("<div></div>").addClass("stats_data");
                    $("#table_div").append(row_table);
                    var number = response.indexOf(response[index]) + 1;
                    row_table.append(
                        `<div>${number}</div><div class="task-in-table1">${
              response[index].task
            }</div><div class="date-in-table1">${
              response[index].begindate
            }</div><div class="deadline_date1">${
              response[index].deadline
            }</div><div class="priority1">${
              response[index].priority
            }</div><div><button class="stats" data-taskid="${
              response[index].idtask
            }" data-taskname="${response[index].task}"  data-taskbegindate="${
              response[index].begindate
            }">Statystyki</button></div><div><button class="edit_elements" data-taskid="${
              response[index].idtask
            }" data-taskname="${response[index].task}"  data-taskbegindate="${
              response[index].begindate
            }">Edycja</button></div><div><button class="subtask" data-taskid="${
              response[index].idtask
            }" data-taskname="${response[index].task}"  data-taskbegindate="${
              response[index].begindate
            }">Dodaj etapy</button></div>`
                    );
                    $("#table_div").append(progress_bar_div);
                    $("#table_div").append(stats_div);
                });

                display_progress_bar(all_of_tasks);
            }
        });
    }

    function display_progress_bar(all_of_tasks) {
        let bars = document.querySelectorAll(".progress_bar");
        bars = [...bars];

        $.ajax({
            type: "GET",
            url: "get_average_data.php",
            data: {
                all_of_tasks: all_of_tasks
            },
            success: function (response) {
                // console.log(response);
                // debugger
                bars.forEach(function (element, index) {
                    element.childNodes[0].style.width = response[index].progress + "%";
                    element.childNodes[0].textContent = response[index].progress + "%";
                });
            }
        });
    }

    // listeners

    $("#table_div").on("click", main_table_click);
    $("nav").on("click", nav_click);

    function nav_click(e) {
        const myElement = e.target;
        if (myElement.id === "animation") {
            animation_progress();
        } else if (myElement.id === "all_courses") {
            all_of_tasks = true;
            showDataDiv(all_of_tasks);
        } else if (myElement.id === "courses_in_progress") {
            all_of_tasks = false;
            showDataDiv(all_of_tasks);
        } else if (myElement.id === "stats") {
            showPeriodStats(all_of_tasks);
        }
    }

    function animation_progress() {
        let bars = document.querySelectorAll(".progress_bar");
        bars = [...bars];
        // reset the progress bars on the screen
        bars.forEach(function (element, index) {
            element.childNodes[0].style.width = 0 + "%";
            element.childNodes[0].textContent = 0 + "%";
        });

        $.ajax({
            type: "get",
            url: "get_all_stages.php",
            data: {
                all_of_tasks: all_of_tasks
            },
            success: function (response) {
                show_animation_progress(response);
            }
        });
    }

    function show_animation_progress(data) {
        let duration_days = data.days;

        let bars = document.querySelectorAll(".progress_bar");
        bars = [...bars];
        let currentday = new Date().getTime();
        const msInADay = 24 * 60 * 60 * 1000;
        let startday = currentday - duration_days * msInADay;
        let counter = 0;
        $("#counter").show();
        let time = setInterval(function () {
            if (counter > duration_days) {
                clearInterval(time);
                $("#counter").hide();
            } else {
                // document.querySelector('#counter').innerHTML = (new Date(startday)).toDateString();
                document.querySelector("#counter").innerHTML = dispaly_date(
                    new Date(startday)
                );
                startday += msInADay;
                bars.forEach(function (element, index) {
                    let row_id = element.dataset.taskid;
                    //console.log(element, index);
                    //console.log(data[counter][index]);
                    let data_for_progress_bar = data[counter];

                    data_for_progress_bar.forEach(function (item, index) {
                        if (item.idtask == row_id) {
                            let done_s = item.done_stages;
                            let all_s = item.all_stages;
                            let progress = ((done_s / all_s) * 100).toFixed(2);
                            element.childNodes[0].style.width = progress + "%";
                            element.childNodes[0].textContent = progress + "%";
                        }
                    });
                });
                counter++;
            }
        }, 500);

        function display_counter(counter) {
            document.querySelector("#counter").innerHTML = counter;
        }

        function render_progress_bar(data, row_id, element) {
            // console.log(data.idtask, row_id);
            // console.log(element);
            if (data.idtask != row_id) {
                return false;
            } else {
                // console.log(data.idtask, row_id);
                let done_s = data.done_stages;
                let all_s = data.all_stages;
                let progress = ((done_s / all_s) * 100).toFixed(2);
                element.childNodes[0].style.width = progress + "%";
                element.childNodes[0].textContent = progress + "%";
            }
        }
    }

    function dispaly_date(date) {
        let day = leadingZero(date.getDate());
        let month = leadingZero(date.getMonth() + 1);
        let year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function leadingZero(i) {
        return i < 10 ? "0" + i : i;
    }

    class Stats {
        constructor() {
            this.data = [];
            this.loading()
        }

        state = {}
        loading = () => {

        }
        render = () => {
            $('#table_div').empty();
            let data = [...this.data];
            let local_this = this;
            $("#table_div").append('<div class="stat_table"></div>');

            $(".stat_table").append(
                '<div class="stat_table_row"><div>Numer</div><div>Zadanie</div><div>Bieżąca przerwa<button id="asc">rosnąco</button></div></div>'
            );

            $('#asc').on('click', local_this.sort);
            $.each(data, function (index) {

                let row_table = $("<div></div>").addClass("stat_table_row");

                $(".stat_table").append(row_table);
                var number = data.indexOf(data[index]) + 1;
                row_table.append(
                    `<div>${number}</div><div ">${data[index].task}</div><div>${
                  data[index].period_of_days
                }</div></div>`
                );
            });




        }

        set_state = (new_state) => this.state = new_state;
        get_data_from_base = () => {
            let local_this = this;
            $.ajax({
                type: "POST",
                url: "stats.php",


                success: function (response) {
                    local_this.data = response;
                    local_this.render();
                }
            });

        }


        compareNumbers = (a, b) => {
            return a - b
        }
        sort = () => {
            let array = this.data;

            array.sort(function (a, b) {

                return parseFloat(a.period_of_days) - parseFloat(b.period_of_days);
            })
            this.data = array;
            this.render();

        }





    }





});