
const number_of_bombs = 16;

function choose_rand_numbers() {

    const arr = [];
  
    if (number_of_bombs <= 0 || number_of_bombs >= 100) {
        return "Número de bombas inválido inválido";
    }
    
    while (arr.length < number_of_bombs) {
        const randNumber = Math.floor(Math.random() * 100) + 1;
        
        if (!arr.includes(randNumber)) {
            arr.push(randNumber);
        }
    }
    
    return arr;
}

function number_to_tuple(num) {

    if (num == 100) return [10,10];

    let fst = parseInt(num/10) + 1;

    let snd = num%10 + 1;

    return [fst,snd];
}

function choose_rand_matrix_positions() {

    let rand_numers = choose_rand_numbers();

    let res = [];

    for (let i = 0; i < rand_numers.length; i++) {

        res.push(number_to_tuple(rand_numers[i]));
    }

    return res;
}

function matrix_position_to_class(tuple) {

    return "square_" + tuple[0] + "_" + tuple[1]; 
}

function choose_rand_class_positions() {

    let rand_matrix_positions = choose_rand_matrix_positions();

    let res = [];

    for (let i = 0; i < rand_matrix_positions.length; i++) {

        res.push(matrix_position_to_class(rand_matrix_positions[i]));
    }

    return res;
}

function put_one_bomb(class_position) {

    let elem = document.getElementById(class_position);

    elem.classList.add("hasBomb");
}

function put_bombs() {

    let rand_class_positions = choose_rand_class_positions();

    for (let i = 0; i < rand_class_positions.length; i++) {

        put_one_bomb(rand_class_positions[i]);
    }
}

var numberOfFlags = number_of_bombs

function changeFlagNumber(num) {

    let elem = document.getElementById("flagsLeft");

    elem.innerText = num;
}

function incrementFlagNumber() {

    if (numberOfFlags == number_of_bombs) {
        
        alert("Máximo de flags alcançado");

        return false;

    }

    changeFlagNumber(++numberOfFlags);

    return true;
}

function decrementFlagNumber() {

    if (numberOfFlags == 0) {
        
        alert("Mínimo de flags alcançado");

        return false;

    }

    changeFlagNumber(--numberOfFlags);

    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    put_bombs();
    changeFlagNumber(number_of_bombs);
});

let shovel = true;

function change_shovel_flag() {

    shovel = !shovel;

    let elem = document.getElementById("shovel_flag");

    elem.innerText = shovel ? "Shovel" : "Flag";
}

function draw_flag(elem) {

    elem.innerHTML = "<i class='fa-solid fa-flag'></i>";
}

function put_flag(elem) {

    if (decrementFlagNumber()) draw_flag(elem);
} 

function clear_flag(elem) {

    elem.innerHTML= "&#8203;";
}

function remove_flag(elem) {

    if (incrementFlagNumber()) clear_flag(elem);
}

function has_flag(elem) {

    return elem.innerText == "";
}

function put_remove_flag(elem) {

    if (has_flag(elem)) remove_flag(elem);

    else put_flag(elem);
}

function hasBomb(elem) {

    return elem.classList.contains("hasBomb");
}

function draw_bomb(elem, in_red) {

    elem.innerHTML = "<i " + (in_red ? "style='color:red'" : "") +  " class='fa-solid fa-bomb'></i>";
}

function is_visible(elem) {

    return elem.classList.contains("visible");
}

function draw_all_bombs() {

    let elem = null;

    for (let i = 1; i <= 10; i++) {

        for (let j = 1; j <= 10; j++) {

            elem = document.getElementById("square_"+i+"_"+j);

            if (hasBomb(elem) && !is_visible(elem)) {

                elem.classList.remove("hidden");
                elem.classList.add("visible");

                draw_bomb(elem, false);
            }
        }
    }
}

function remove_all_flags() {

    let flag_num_aux = numberOfFlags;

    let elem = null;

    for (let i = 1; i <= 10; i++) {

        for (let j = 1; j <= 10; j++) {

            elem = document.getElementById("square_"+i+"_"+j);

            if (!is_visible(elem) && has_flag(elem)) {

                remove_flag(elem);
            }
        }
    }

    changeFlagNumber(flag_num_aux);
}

let GameOver = false;

function square_id_to_tuple(square_id) {

    let res = square_id.substring(7).split("_");

    res[0] = parseInt(res[0]);
    res[1] = parseInt(res[1]);

    return res;
}
 
function number_of_adj_bombs(elem) {

    let elem_coords = square_id_to_tuple(elem.id);

    let min_line = elem_coords[0] == 1 ? 1 : elem_coords[0]-1;
    let max_line = elem_coords[0] == 10 ? 10 : elem_coords[0]+1;
    let min_col = elem_coords[1] == 1 ? 1 : elem_coords[1]-1
    let max_col = elem_coords[1] == 10 ? 10 : elem_coords[1]+1;

    let counter = 0;

    for (let i = min_line; i <= max_line; i++) {

        for (let j = min_col; j <= max_col; j++) {

            if (hasBomb(document.getElementById("square_"+i+"_"+j))) {

                counter++;
            }
        }
    }

    return counter;
}

function write_number_of_adj_bombs(elem, number) {

    let color = ['blue','brown','purple','green','black','red','purple','yellow'][number-1];

    elem.innerHTML = "<p class='adj_bombs' style='color:"+color+"'>"+number+"</p>";
}

function has_won() {

    let visible_squares = 0;

    for (let i = 1; i <= 10; i++) {

        for (let j = 1; j <= 10; j++) {

            if (is_visible(document.getElementById("square_"+i+"_"+j))) {

                visible_squares++;
            }
        }
    }

    return visible_squares == 100 - number_of_bombs;
}

function dig(elem) {

    if (has_flag(elem)) {

        remove_flag(elem);
        return;
    }

    elem.classList.remove("hidden");
    elem.classList.add("visible");

    if (hasBomb(elem)) {

        GameOver = true;

        draw_bomb(elem, true);

        remove_all_flags();

        draw_all_bombs();
    }

    else {

        let adj_bombs = number_of_adj_bombs(elem);

        if (adj_bombs == 0) {

            let elem_coords = square_id_to_tuple(elem.id);

            let min_line = elem_coords[0] == 1 ? 1 : elem_coords[0]-1;
            let max_line = elem_coords[0] == 10 ? 10 : elem_coords[0]+1;
            let min_col = elem_coords[1] == 1 ? 1 : elem_coords[1]-1
            let max_col = elem_coords[1] == 10 ? 10 : elem_coords[1]+1;

            let elem_recursive = null;

            for (let i = min_line; i <= max_line; i++) {

                for (let j = min_col; j <= max_col; j++) {
        
                    elem_recursive = document.getElementById("square_"+i+"_"+j);

                    if (!is_visible(elem_recursive)) {

                        dig(elem_recursive);
                    }
                }
            }
        }

        else {

           write_number_of_adj_bombs(elem,adj_bombs);
        }

        if (has_won()) {

            let top_message = document.getElementById("top_message");

            top_message.innerText = "WIN";
        }
    }
}

function play(elem) {

    if (GameOver) return;
    if (is_visible(elem)) return;

    if (shovel) dig(elem);
    else put_remove_flag(elem);
}