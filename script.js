const displayItems = (projectItem) => {
    const projectsContainer = document.querySelector('.projectsContainer');
    const projectSection = document.createElement('div');
    projectSection.setAttribute('class', 'projectSection');
    projectsContainer.append(projectSection);

    const name  = projectItem.projectName;

    const deadline = projectItem.deadline;


    const projectInfo = document.createElement('div');
    projectInfo.setAttribute('class', 'projectInfo');
    projectInfo.innerHTML = `There are a working plan for your project ${name}, your deadline is ${deadline}:`
    projectSection.append(projectInfo);

    const titles = document.createElement('div');
    titles.setAttribute('class', 'titles');
    projectSection.append(titles);

    const dateTitle = document.createElement('span');
    dateTitle.innerHTML = 'Date';
    titles.append(dateTitle);

    const hoursTitle = document.createElement('span');
    hoursTitle.innerHTML = 'Hours';
    titles.append(hoursTitle);


    const busynessData = projectItem.busynessData;
    busynessData.forEach(entry => {
        const planItem = document.createElement('div');
        planItem.setAttribute('class', 'planItem');
        projectSection.append(planItem);

        const date = document.createElement('span');
        date.innerHTML = entry.date;
        planItem.append(date);
    
        // const busyHours = document.createElement('span');
        // busyHours.innerHTML = entry.busyHours;
        // projectSection.append(busyHours);
    
        const workHours = document.createElement('span');
        workHours.innerHTML = entry.workHours;
        planItem.append(workHours);
    });
}


const displayProjects = async () => {
    try {
        const response = await fetch('https://642c65dc208dfe25472f319b.mockapi.io/projects');
        const data = await response.json();

        data.sort((a, b) => {
            return Date(a.date) - Date(a.date);
        });

        const projectsContainer = document.querySelector('.projectsContainer');
        projectsContainer.innerHTML = ''; 

        data.forEach(projectItem => {
            return displayItems(projectItem);
        })
    } catch (err) {
        console.log(err);
    }
};




const postProject = async (newProject) => {
    try {
        const response = await fetch('https://642c65dc208dfe25472f319b.mockapi.io/projects', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        });

        if (!response.ok) {
        throw new Error('Failed to post project');
        }
   
        displayProjects();

    } catch (err) {
    console.log(err);
    }
};




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

submit.addEventListener('click', async () => {    
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
    message.setAttribute('class', 'message');
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
