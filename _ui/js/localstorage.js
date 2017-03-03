//checks for localstorage before using localstorage
function checkForLocalStorage(){
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
        return false;
    }
}

//adds note if add button is clicked
var addNotesClicked = function() {
    $('#add').click(function(e) {
        var title = $('#title').val();
        var noteCount = getNoteCount();
        if (title == '') {
            title = "title " + noteCount;
        }
        addNoteToLocalStorage(title, noteCount);
        localStorage.setItem('noteCount', noteCount +1);
    });
};

//clears localstorage and list of all items
var clearAllNotes = function() {
    $('#clear').click(function(e) {
        checkForLocalStorage();
        localStorage.clear();
        $('#list').empty();
    });
};

//deletes note when delete button is clicked
var deleteNote = function() {
    $('#list').on('click', '.delete', function(e) {
        var note = $(this).parent();
        var noteId = note[0].id;
        $(this).parent().remove();
        localStorage.removeItem(noteId);
    });
};

var editNote = function() {
    $('#list').on('click', '.edit', function(e) {
        var editPanel = $(this).next();
        editPanel.addClass('show');
    });
};

var saveNote = function() {
    $('#list').on('click', '.save', function(e) {
        var editPanel = $(this).parent();
        console.log(editPanel);
        editPanel.removeClass('show');
    });
};

var cancelEditNote = function() {
    $('#list').on('click', '.cancel', function(e) {
        var editPanel = $(this).parent();
        console.log(editPanel);
        editPanel.removeClass('show');
    });
};

//add note to localstorage as well as list
function addNoteToLocalStorage(title, noteCount, text = null){
    checkForLocalStorage();
    var notes = new Array;
    notes.push(title);
    notes.push(text);
    localStorage.setItem('note' + noteCount , JSON.stringify(notes));
    appendToList(notes, noteCount);
}

function displayNotes() {
    var noteCount = localStorage.length-1;
    var notesArray = new Array;
    for (i=0; i<noteCount; i++) {
        var notesInfo = localStorage.getItem(localStorage.key(i));
        notesArray = JSON.parse(notesInfo);
        appendToList(notesArray, i);
    }
}

//appends note to list
function appendToList(notesArray, noteCount) {
    $('#list').append('<li id="note'+ noteCount +'" class="note-entry"><p>' + notesArray[0] + '</p><div class="button delete">Delete</div><div class="button edit">Edit</div><div class="edit-notes"><input type="text" name="editTitle" value=""><textarea name="name" rows="7" class="note-text"></textarea><div class="button cancel">Cancel</div><div class="button save">Save</div></div></li>');
}

//keeps track of notecount for ids
function getNoteCount() {
    if (localStorage.getItem('noteCount')) {
        return parseInt(localStorage.getItem('noteCount'));
    } else {
        localStorage.setItem('noteCount', 0);
        return 0;
    }
}

$(document).ready(function() {
    displayNotes();
});

$(document).ready(addNotesClicked);
$(document).ready(clearAllNotes);
$(document).ready(deleteNote);
$(document).ready(saveNote);
$(document).ready(editNote);
$(document).ready(cancelEditNote);
