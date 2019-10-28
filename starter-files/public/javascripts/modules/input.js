let pollForm = document.querySelector('.poll-form');
let button = document.querySelector('.poll-button');


function addElemenet(parent, element, elementID, html) {
    let p = document.querySelector(parent);
    let e = document.createElement(element);
    e.setAttribute('id', elementID);
    e.innerHTML = html;
    p.appendChild(e);

    console.log(html);

}

//event delegationt to allow dynamic elements created after page load to be removed
function removeElement(event) {
    if (event.target.className === 'remove') {
        event.target.parentElement.remove()
    }

}


let numberID = 0;

function addInput() {
    if (window.location.pathname !== '/poll' &&
    window.location.pathname !== '/poll/' ) {
        return;
    }

    numberID++;
    console.log(numberID);

    let adder = function() {
        let html = '<div class="contain"><input type="text" name="options" /> <a href=# class="remove"> remove </a> </div>';

        addElemenet('.form', 'p', 'input-' + numberID, html);
    }

    pollForm.addEventListener('click',
        removeElement, false
    )


    button.addEventListener('click',
        adder,
        false
    )



}


export default addInput;


/**
 * FIXME:
 *  
 *  make ID for dynamic input elements different
 */