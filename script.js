const postProject = (newProject) => {
    fetch('https://642c65dc208dfe25472f319b.mockapi.io/projects', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProject),
}) .then((data) => {
    return data.json();
}) .catch((err) => {
    return err;
});
}




const button = document.getElementById('button');

button.addEventListener("click", () => {
    // event.preventDefault();
    const busyness = document.createElement('div');
    busyness.innerHTML = `<label>Diena</label>
            <input type="date" class="date">
            <label>Busy hours</label>
            <input type="number" min="0" max="24" class="busyHours">`;
    const formTop = document.querySelector('.form-top');
    formTop.append(busyness);
});




const submit = document.getElementById('submit');
let message;

submit.addEventListener('click', () => {    
    const projectName = document.getElementById('projectName').value;
    const projectHours = document.getElementById('projectHours').value;
    const deadline = document.getElementById('deadline').value;
    
    const dateInputs = document.querySelectorAll('.date');
    const busyHoursInputs = document.querySelectorAll('.busyHours');
    const busynessData = [];

    if (message) {
        message.remove();
    };
    
    message = document.createElement('div');
    message.style.color = "red";
    const form = document.querySelector('.form');
    form.append(message);

    if (!projectName || !projectHours || !deadline || hasEmptyInputs(dateInputs) || hasEmptyInputs(busyHoursInputs)) {
        message.innerHTML = 'Please fill all fields!!!!';
        return;
    };


    for (let i = 0; i < dateInputs.length; i++) {
        const dateInput = dateInputs[i];
        const date = dateInput.value;
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = busyHoursInput.value;

        if(busyHours < 0 || busyHours > 24) {
            message.innerHTML = 'Bad hours';
            return;
        } 
            
        const workHours = 24 - 10 - busyHours;
        busynessData.push({date, busyHours, workHours});        
    };

    const newProject = {
        projectName: projectName,
        projectHours: projectHours,
        deadline: deadline,
        busynessData: busynessData,
    };
    
    postProject(newProject);
    
    message.style.color = "green";
    message.innerHTML = 'saved successfully';

    console.log(newProject);
    
});

function hasEmptyInputs(inputs) {
    return Array.from(inputs).some((input) => input.value === '');
}
