var noteCount = 0;

var addNotesClicked = function() {
    $('.add').click(function(e) {
        var title = $('#title').value;
        if (typeof title === 'undefined') {
            title = "title" + noteCount;
        }
        addNoteToLocalStorage(title);
    });
};

function checkForLocalStorage(){
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
        return false;
    }
}

function addNoteToLocalStorage(title){
    checkForLocalStorage();
    localStorage.setItem("note"+noteCount, title);
}

$(document).ready(addNotesClicked);
