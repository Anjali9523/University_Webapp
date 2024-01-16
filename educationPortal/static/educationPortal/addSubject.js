document.addEventListener('DOMContentLoaded', function () {
  const subjectDropdown = document.getElementById('subjectDropdown');
  const addSubjectButton = document.getElementById('addSubjectButton');
  const addedSubjectsContainer = document.getElementById('addedSubjects');
  const placeholderOption = subjectDropdown.options[0];

  
  function fetchSubjectNames() {
    fetch(`/addSubject/`)
      .then(response => response.json())
      .then(data => {
        const subjects = data.subject;

        subjectDropdown.innerHTML = '';

        subjects.forEach(subject => {
          const option = document.createElement('option');
          option.value = subject;
          option.text = subject;
          subjectDropdown.add(option);
        });
      })
      .catch(er => console.log(er));
  }

  fetchSubjectNames();

  addSubjectButton.addEventListener('click', function () {
    const selectedSubject = subjectDropdown.value;
    console.log('Selected Subject:', selectedSubject);

    if (selectedSubject) {
        if (!addedSubjectsContainer.querySelector(`[data-subject-name="${selectedSubject}"]`)) {
            placeholderOption.text = selectedSubject;

            fetch(`/check_subject_existence/?subject_name=${encodeURIComponent(selectedSubject)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    console.log("Subject exists");
                    alert('Subject already exists in the enrolled subjects!');
                } else {
                    const subjectDiv = document.createElement('div');
                    subjectDiv.classList.add('selected-subject');
                    subjectDiv.dataset.subjectName = selectedSubject;

                    const subjectName = document.createElement('span');
                    subjectName.textContent = selectedSubject;

                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.type = 'button';

                    removeButton.style.backgroundColor = '#ff6347'; // Tomato color
                    removeButton.style.marginLeft = '10px';
                    removeButton.style.color = 'white';
                    removeButton.style.padding = '5px 10px';
                    removeButton.style.border = 'none';
                    removeButton.style.borderRadius = '4px';
                    removeButton.style.cursor = 'pointer';

                    removeButton.addEventListener('click', function () {
                        console.log("Subject removed");
                        subjectDiv.remove();
                    });

                    subjectDiv.appendChild(subjectName);
                    subjectDiv.appendChild(removeButton);
                    addedSubjectsContainer.appendChild(subjectDiv);
                }
            })
            .catch(error => {
                console.error('Error checking subject existence:', error);
            });
        }
    }
});



  document.getElementById('addSubjectForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const confirmed = confirm("Are you sure you want to proceed?");

    if (confirmed) {
      console.log('Submit button clicked');
      const selectedSubjectIds = [];
      const addedSubjects = addedSubjectsContainer.querySelectorAll('.selected-subject');
      console.log('Added Subjects:', addedSubjects);
      for (const subjectDiv of addedSubjects) {
        const subjectId = subjectDiv.dataset.subjectName;
        selectedSubjectIds.push(subjectId);
      }
      // Fetch the user's ID 
      const userId = document.body.dataset.userId; 
      console.log("User ID:", userId);

      fetch('/submit_subjects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          subject_ids: selectedSubjectIds,
          user_id: userId
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          addedSubjectsContainer.innerHTML = '';
          alert('Subjects added successfully!');
        } else {
          // Handle errors
          console.error('Error submitting subjects:', data.error);
        }
      })
      .catch(error => console.error('Network error:', error));
    } else {
      console.log('User cancelled submission');
    }
  });
  
  document.getElementById('removeSubjectForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const subjectId = document.getElementById('subjectToRemove').value;

    // Display a confirmation dialog
    const confirmed = confirm(`Are you sure you want to remove the subject with ID ${subjectId}?`);

    if (confirmed) {
        fetch('/remove_subject/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
            },
            body: 'subject_id=' + encodeURIComponent(subjectId),
        })
        .then(response => {
            if (response.ok) {
                alert('Subject removed successfully!');
            } else {
                // Handle error cases
                alert('Error removing subject!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log('User cancelled removal');
    }
  });
  function getCookie(name) {
      let cookieValue = null;
          if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
              }
            }
          }
          return cookieValue;
  }
});