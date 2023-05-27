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

    // Calculate totalDays based on the current date and deadline
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const totalDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    let totalBusyHours = 0;

    // Calculate total busy hours
    for (let i = 0; i < busyHoursInputs.length; i++) {
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);
        totalBusyHours += busyHours;
    }

    const additionalBusyHours = totalDays * 10;
    totalBusyHours += additionalBusyHours;

    const remainingWorkHours = (totalDays * 24) - totalBusyHours;


    // if (totalWorkHours < projectHours) {
    //     message.innerHTML = 'Total work hours exceed project hours';
    //     return;
    // };


    const workHoursPerDay = projectHours / totalDays;


    // Generate the busynessData array with work hours per day
    for (let i = 0; i < dateInputs.length; i++) {
        const dateInput = dateInputs[i];
        const date = dateInput.value;
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);

        if(busyHours < 0 || busyHours > 24) {
            message.innerHTML = 'Bad hours';
            return;
        }
        
        const workHours = workHoursPerDay + (i < remainingWorkHours ? 1 : 0);
        busynessData.push({date, busyHours, workHours});
    }
    
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



function generateDates() {
    // Tęstinis kodas, kuriame jau yra įvestos pradinės datos ir užimtos valandos

    // Gaukite pirmąją įvestą datą ir užimtų valandų skaičių
    const startDateInput = document.getElementById('startDate');
    const startDate = new Date(startDateInput.value);
    const busyHoursInput = document.getElementById('busyHours');
    const busyHours = Number(busyHoursInput.value);

    // Nustatykite projekto trukmę
    const deadlineInput = document.getElementById('deadline');
    const deadline = new Date(deadlineInput.value);
    const totalDays = Math.ceil((deadline - startDate) / (1000 * 60 * 60 * 24));

    // Sukurkite masyvą, kuriame saugosite duomenis apie datą ir valandas
    const busynessData = [];

    // Generuokite ir užpildykite likusias datas su valandomis
    for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Pridėkite 1 dieną prie pradinės datos
    const currentDateString = currentDate.toISOString().split('T')[0]; // Konvertuokite datą į tinkamą formatą (be laiko)
    const workHours = 24 - busyHours; // Skaičiuokite laisvas valandas (24 valandos per dieną - užimtos valandos)
    
    busynessData.push({ date: currentDateString, busyHours, workHours });
    }

    // Atvaizduokite sugeneruotus duomenis arba panaudokite juos kitai veiksmų
    console.log(busynessData);

}

