const aboutLink = document.querySelector('.about');
const aboutSection = document.getElementById('about-section');

aboutLink.addEventListener('click', () => {
    aboutSection.scrollIntoView({ 
        block: 'start',
        behavior: 'smooth',
    });
})


const heroButton = document.querySelector('.hero-button');
const form = document.getElementById('form');

heroButton.addEventListener('click', () => {
    form.scrollIntoView({ 
        block: 'start',
        behavior: 'smooth',
    });
})


const tryLink = document.querySelector('.try');

tryLink.addEventListener('click', () => {
    form.scrollIntoView({ 
        block: 'start',
        behavior: 'smooth',
    });
})




const displayItems = (projectItem) => {
    const projectsContainerWrapper = document.querySelector('.projectsContainer-wrapper');
    const projectContainer = document.createElement('div');
    projectContainer.setAttribute('class', 'projectContainer');
    projectsContainerWrapper.append(projectContainer);

    const projectSection = document.createElement('div');
    projectSection.setAttribute('class', 'projectSection');
    projectContainer.append(projectSection);

    const name  = projectItem.projectName;
    const deadline = projectItem.deadline;

    const projectInfoWrapper = document.createElement('div');
    projectInfoWrapper.setAttribute('class', 'projectInfoWrapper');
    projectSection.append(projectInfoWrapper);

    const projectInfo = document.createElement('div');
    projectInfo.setAttribute('class', 'projectInfo');
    projectInfo.innerHTML = `Here is a working plan for your project ${name}, your deadline is ${deadline}:`
    projectInfoWrapper.append(projectInfo);

    const deleteProject = document.createElement('img');
    deleteProject.setAttribute('class', 'deleteIcon');
    deleteProject.setAttribute('src', './img/trash-icon.png');
    projectInfoWrapper.append(deleteProject);

    // const itemId = localStorage.getItem('id');

    deleteProject.addEventListener('click', () => {
        localStorage.setItem('id', projectItem.id);
        const itemId = localStorage.getItem('id');
        
        fetch (`https://642c65dc208dfe25472f319b.mockapi.io/projects/${itemId}`, {
        method: 'DELETE'}).then(res => {
            projectContainer.remove();
    
        }).catch(err => {
            console.log('Failed to delete resources', err)
        });
    })

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

        const projectsContainerWrapper = document.querySelector('.projectsContainer-wrapper');
        projectsContainerWrapper.innerHTML = ''; 

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




const addButton = document.getElementById('add-button');

addButton.addEventListener("click", () => {
    // event.preventDefault();
    const formBottomSection = document.createElement('div');
    formBottomSection.setAttribute('class', 'form-bottom-section');
    formBottomSection.innerHTML = `<div>
                                        <label for="date">Date:</label>
                                        <input type="date" name="date" class="date">
                                    </div>
                                    <div>
                                        <label for="busy-hours">Busy hours:</label>
                                        <input type="number" name="busy-hours" min="0" max="24" class="busyHours">
                                    </div>
                                    <button class="removeDate button">
                                        <img class="removeDateButton-image" src="./img/remove.png">
                                    </button`;
    const formBottom = document.querySelector('.form-bottom');
    formBottom.append(formBottomSection);

    const removeDateButton = formBottomSection.querySelector('.removeDate');
    removeDateButton.addEventListener('click', () => {
        const formBottomSection = removeDateButton.closest('.form-bottom-section');
        formBottomSection.remove();
    });
});




const createButton = document.getElementById('create-button');
let message;

createButton.addEventListener('click', async () => {    
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
    const form = document.querySelector('.form');
    form.append(message);

    // projectHours whole number validation
    const projectHoursInput = document.getElementById('projectHours');
    const value = projectHoursInput.value;
    const isValid = Number.isInteger(Number(value));

    if (!isValid) {
    return message.innerHTML= 'Please enter a whole number.';
    }

    // projectHours number validation
    if(projectHours < 1) {
      return message.innerHTML = "Project hours cannot be less than 1";
    }
    if(projectHours > 300) {
        return message.innerHTML = "Project hours cannot be more than 300";
    }

    //All fields validation
    if (!projectName || !projectHours || !deadline || hasEmptyInputs(dateInputs) || hasEmptyInputs(busyHoursInputs)) {
        return message.innerHTML = 'Fill out all fields!!!!';
    };

    //dates validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const totalDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (deadlineDate < today) {
        return message.innerHTML = 'The deadline cannot be a past date';
    }

    const date = document.querySelector('.date');
    const selectedDate = new Date(date.value);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        return message.innerHTML = 'The date cannot be a past date';
    }

    if (deadlineDate.getTime() === today.getTime()) {
        return message.innerHTML = 'The deadline cannot be today';
    }

   
    //busyHours calculation
    let totalBusyHours = 0;

    for (let i = 0; i < busyHoursInputs.length; i++) {
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);
        const isValid = Number.isInteger(Number(busyHours));
    
        if (!isValid) {
        return message.innerHTML= 'Please enter a whole number.';
        };

        totalBusyHours += busyHours;
    }

    const additionalBusyHours = totalDays * 10;
    totalBusyHours += additionalBusyHours;

    const remainingWorkHours = (totalDays * 24) - totalBusyHours;


    if (remainingWorkHours < projectHours) {
        return message.innerHTML = 'Added availability is after the project deadline';
    };

    const workHoursPerDay = projectHours / totalDays;
    const selectedDates = new Set();

    for (let i = 0; i < dateInputs.length; i++) {
        const dateInput = dateInputs[i];
        const date = dateInput.value;
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);

        
        if(busyHours < 0) {
            return message.innerHTML = "Busy hours cannot be less than 0";
        }
  
        if(busyHours > 10) {
            return message.innerHTML = "Busy hours cannot be more than 10";
        }

        if (selectedDates.has(date)) {
            return message.innerHTML = "Duplicate date entry";
        }

        selectedDates.add(date); 
        
        let workHours = Math.floor(workHoursPerDay);
        if (i < remainingWorkHours % totalDays) {
            workHours += 1;
        }

        busynessData.push({date, busyHours, workHours});
    }
    
    const newProject = {
        projectName: projectName,
        projectHours: projectHours,
        deadline: deadline,
        busynessData: busynessData,
    };
    
    postProject(newProject);
    
});

function hasEmptyInputs(inputs) {
    return Array.from(inputs).some((input) => input.value === '');
}



// function generateDates() {
//     // Tęstinis kodas, kuriame jau yra įvestos pradinės datos ir užimtos valandos

//     // Gaukite pirmąją įvestą datą ir užimtų valandų skaičių
//     const startDateInput = document.getElementById('startDate');
//     const startDate = new Date(startDateInput.value);
//     const busyHoursInput = document.getElementById('busyHours');
//     const busyHours = Number(busyHoursInput.value);

//     // Nustatykite projekto trukmę
//     const deadlineInput = document.getElementById('deadline');
//     const deadline = new Date(deadlineInput.value);
//     const totalDays = Math.ceil((deadline - startDate) / (1000 * 60 * 60 * 24));

//     // Sukurkite masyvą, kuriame saugosite duomenis apie datą ir valandas
//     const busynessData = [];

//     // Generuokite ir užpildykite likusias datas su valandomis
//     for (let i = 0; i < totalDays; i++) {
//     const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Pridėkite 1 dieną prie pradinės datos
//     const currentDateString = currentDate.toISOString().split('T')[0]; // Konvertuokite datą į tinkamą formatą (be laiko)
//     const workHours = 24 - busyHours; // Skaičiuokite laisvas valandas (24 valandos per dieną - užimtos valandos)
    
//     busynessData.push({ date: currentDateString, busyHours, workHours });
//     }

//     // Atvaizduokite sugeneruotus duomenis arba panaudokite juos kitai veiksmų
//     console.log(busynessData);

// }

