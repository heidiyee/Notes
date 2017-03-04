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
        $('#title').val("");
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
        var noteId = getNoteId(this);
        note.remove();
        localStorage.removeItem(noteId);
    });
};

//adds note if add button is clicked
var colorClicked = function() {
    $('#list').on('click', '.color', function(e) {
        var color = this.id;
        var listItem = $(this).parent().parent().parent();
        var noteId = listItem[0].id;
        var editPanel = $(this).parent().parent();
        listItem.removeClass();
        listItem.addClass(color);
    });
};

var editNote = function() {
    $('#list').on('click', '.edit', function(e) {
        var noteId = getNoteId(this);
        var editPanel = $(this).next();
        setNoteInputs(noteId, editPanel);
        editPanel.addClass('show');
    });
};

var saveNote = function() {
    $('#list').on('click', '.save', function(e) {
        var editPanel = $(this).parent();
        var noteId = getNoteId(editPanel);
        var title = editPanel.children('.note-edit-title').val();
        var noteText = editPanel.children('.note-edit-text').val();
        var color = "";
        if (editPanel.find("input[name='color']:checked").length > 0) {
            color = editPanel.find("input[name='color']:checked")[0].id;
        };
        saveAfterEdit(noteId, title, noteText, color);
        editPanel.parent().find('.note-title').html(title);
        editPanel.removeClass('show');
    });
};

var cancelEditNote = function() {
    $('#list').on('click', '.cancel', function(e) {
        var editPanel = $(this).parent();
        var noteId = getNoteId(editPanel);
        setNoteInputs(noteId, editPanel);
        editPanel.removeClass('show');
    });
};

function getNoteId(note) {
    var note = $(note).parent();
    var noteId = note[0].id;
    return noteId;
}

//add note to localstorage for the first time
function addNoteToLocalStorage(title, noteCount, text = null){
    checkForLocalStorage();
    var notes = new Array;
    notes.push(title);
    notes.push(text);
    localStorage.setItem('note' + noteCount , JSON.stringify(notes));
    appendToList(notes, 'note' + noteCount);
}

function saveAfterEdit(noteId, title, noteText, color = null) {
    var note = new Array;
    var noteInfo = localStorage.getItem(localStorage.key(noteId));
    var note = JSON.parse(noteInfo);
    note[0] = title;
    note[1] = noteText;
    note[2] = color;
    localStorage.setItem(noteId, JSON.stringify(note));
}

function setNoteInputs(noteId, editPanel) {
    var noteArray = new Array;
    var noteInfo = localStorage.getItem(noteId);
    noteArray = JSON.parse(noteInfo);
    editPanel.children('.note-edit-title').val(noteArray[0]);
    editPanel.children('.note-edit-text').val(noteArray[1]);
}

function displayNotes() {
    var noteCount = localStorage.length-1;
    var notesArray = new Array;
    for (i=0; i<noteCount; i++) {
        var notesInfo = localStorage.getItem(localStorage.key(i));
        notesArray = JSON.parse(notesInfo);
        appendToList(notesArray, localStorage.key(i));
    }
}

//appends note to list
function appendToList(notesArray, noteCount) {
    $('#list').append('<li id="'+ noteCount +'" class="'+ notesArray[2] + '"><p class="note-title">' + notesArray[0] + '</p><div class="button delete">Delete</div><div class="button edit">Edit</div><div class="edit-notes"><input class="note-edit-title" type="text" name="editTitle" value=""><textarea name="name" rows="7" class="note-edit-text"></textarea><div class="colors"><input class="color" type="radio" name="color" value="pink" id="pink"><input class="color" type="radio" name="color" value="seafoam" id="seafoam"><input class="color" type="radio" name="color" value="light-green" id="light-green"></div><div class="button cancel">Cancel</div><div class="button save">Save</div></li>');
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
$(document).ready(colorClicked);
