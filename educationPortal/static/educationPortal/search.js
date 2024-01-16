document.getElementById('class_subject_field').addEventListener('focus', function() {
    fetchSubjects();
});

document.getElementById('class_subject_field').addEventListener('input', function() {
    let inputValue = this.value;
    closeAllLists();
    if (!inputValue) {
        return false;
    }

    // Fetch subjects from the backend
    fetch('/index/api/get_subjects/')
        .then(response => response.json())
        .then(subjects => {
            const autoCompleteList = document.getElementById('autocomplete-list');
            console.log('helloooo')
            subjects.forEach(function(subject) {
                if (subject.sub_name.toUpperCase().includes(inputValue.toUpperCase())) {
                    const suggestion = document.createElement('div');
                    suggestion.innerHTML = "<strong>" + subject.sub_name.substr(0, inputValue.length) + "</strong>" + subject.sub_name.substr(inputValue.length);
                    suggestion.addEventListener('click', function() {
                        document.getElementById('class_subject_field').value = subject.sub_name;
                        closeAllLists();
                    });
                    autoCompleteList.appendChild(suggestion);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching subjects:', error);
        });
});

document.addEventListener('click', function(event) {
    closeAllLists(event.target);
});

function closeAllLists(element) {
    const autoCompleteList = document.getElementById('autocomplete-list');
    while (autoCompleteList.firstChild) {
        autoCompleteList.removeChild(autoCompleteList.firstChild);
    }
}

function fetchSubjects() {
    // Fetch subjects from the backend
    fetch('/index/api/get_subjects/')
        .then(response => response.json())
        .then(subjects => {
            console.log("autocomplete")
            const autoCompleteList = document.getElementById('autocomplete-list');
            subjects.forEach(function(subject) {
                console.log('Processing subject:', subject);
                const suggestion = document.createElement('div');
                suggestion.innerHTML = subject.sub_name;
                suggestion.addEventListener('click', function() {
                    document.getElementById('class_subject_field').value = subject.sub_name;
                    closeAllLists();
                });
                autoCompleteList.appendChild(suggestion);
            });
        })
        .catch(error => {
            console.error('Error fetching subjects:', error);
        });
}

