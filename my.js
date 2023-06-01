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
    return message.innerHTML= 'Please enter a whole number';
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

    // if (selectedDate > deadlineDate) {
    //     return message.innerHTML = 'The date cannot be today';
    // }

    if (deadlineDate.getTime() === today.getTime()) {
        return message.innerHTML = 'The deadline cannot be today';
    }

   
    //busyHours calculation
    let totalBusyHours = 0;

    for (let i = 0; i < busyHoursInputs.length; i++) {
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);
        const isValid = Number.isInteger(busyHours);
    
        if (!isValid) {
        return message.innerHTML= 'Please enter a whole number';
        };

        if(busyHours < 0) {
            return message.innerHTML = "Busy hours cannot be less than 0";
        }
  
        if(busyHours > 10) {
            return message.innerHTML = "Busy hours cannot be more than 10";
        }

        totalBusyHours += busyHours;
    }

    const additionalBusyHours = totalDays * 10;
    totalBusyHours += additionalBusyHours;

    const remainingWorkHours = (totalDays * 24) - totalBusyHours;


    if (remainingWorkHours < projectHours) {
        return message.innerHTML = 'Added availability is after the project deadline';
    };

    const workHoursPerDay = Math.floor(projectHours / totalDays);
    const remainingWorkHoursPerDay = projectHours % totalDays;
    
    const selectedDates = new Set();

    const enteredDates = [];

    for (let i = 0; i < dateInputs.length; i++) {
        const dateInput = dateInputs[i];
        const date = dateInput.value;
        const busyHoursInput = busyHoursInputs[i];
        const busyHours = Number(busyHoursInput.value);

        if (selectedDates.has(date)) {
            return message.innerHTML = "Duplicate date entry";
        }

        selectedDates.add(date); 
        
        let workHours = workHoursPerDay;
        if (i < remainingWorkHoursPerDay) {
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