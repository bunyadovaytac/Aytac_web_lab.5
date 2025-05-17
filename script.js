// Orijinal və redaktə edilmiş məlumatları saxlamaq üçün
let originalData = {};
let profileData = {};

// JSON faylından məlumatları yüklə
async function loadProfile() {
    try {
        const response = await fetch('data.json');
        profileData = await response.json();
        originalData = JSON.parse(JSON.stringify(profileData)); // Dərin surət
        renderProfile();
    } catch (error) {
        console.error('Məlumat yüklənmədi:', error);
    }
}

// Profil məlumatlarını DOM-a əlavə et
function renderProfile() {
    const nameElement = document.getElementById('profile-name');
    nameElement.textContent = profileData.profile.name;

    const container = document.getElementById('profile-container');
    container.innerHTML = '';

    // Ad redaktə sahəsi
    const nameDiv = document.createElement('div');
    nameDiv.className = 'field';
    nameDiv.innerHTML = `<strong>Ad:</strong> <span>${profileData.profile.name}</span>
        <button class="edit-btn" onclick="editField('name')">Redaktə et</button>`;
    container.appendChild(nameDiv);

    // Təhsil
    const educationDiv = document.createElement('div');
    educationDiv.innerHTML = '<h2>Təhsil</h2>';
    profileData.profile.education.forEach((edu, index) => {
        const eduField = document.createElement('div');
        eduField.className = 'field';
        eduField.innerHTML = `
            <p><strong>Dərəcə:</strong> <span>${edu.degree}</span></p>
            <p><strong>Universitet:</strong> <span>${edu.university}</span></p>
            <p><strong>İl:</strong> <span>${edu.year}</span></p>
            <button class="edit-btn" onclick="editEducation(${index})">Redaktə et</button>`;
        educationDiv.appendChild(eduField);
    });
    container.appendChild(educationDiv);

    // İş
    const workDiv = document.createElement('div');
    workDiv.innerHTML = '<h2>İş Təcrübəsi</h2>';
    profileData.profile.work.forEach((job, index) => {
        const jobField = document.createElement('div');
        jobField.className = 'field';
        jobField.innerHTML = `
            <p><strong>Vəzifə:</strong> <span>${job.position}</span></p>
            <p><strong>Şirkət:</strong> <span>${job.company}</span></p>
            <p><strong>Müddət:</strong> <span>${job.duration}</span></p>
            <button class="edit-btn" onclick="editWork(${index})">Redaktə et</button>`;
        workDiv.appendChild(jobField);
    });
    container.appendChild(workDiv);

    // Bacarıqlar
    const skillsDiv = document.createElement('div');
    skillsDiv.innerHTML = '<h2>Bacarıqlar</h2>';
    profileData.profile.skills.forEach((skill, index) => {
        const skillField = document.createElement('div');
        skillField.className = 'field';
        skillField.innerHTML = `<span>${skill}</span>
            <button class="edit-btn" onclick="editSkill(${index})">Redaktə et</button>`;
        skillsDiv.appendChild(skillField);
    });
    container.appendChild(skillsDiv);
}

// Ad redaktə funksiyası
function editField(field) {
    const container = document.getElementById('profile-container');
    const fieldDiv = container.querySelector('.field'); // İlk sahə (ad)
    fieldDiv.innerHTML = `
        <strong>Ad:</strong>
        <input type="text" id="edit-${field}" value="${profileData.profile[field]}">
        <button class="save-btn" onclick="saveField('${field}')">Saxla</button>`;
}

// Təhsil redaktə funksiyası
function editEducation(index) {
    const edu = profileData.profile.education[index];
    const eduDiv = document.querySelectorAll('.field')[1 + index]; // Təhsil sahəsi
    eduDiv.innerHTML = `
        <p><strong>Dərəcə:</strong> <input type="text" id="edit-degree-${index}" value="${edu.degree}"></p>
        <p><strong>Universitet:</strong> <input type="text" id="edit-university-${index}" value="${edu.university}"></p>
        <p><strong>İl:</strong> <input type="text" id="edit-year-${index}" value="${edu.year}"></p>
        <button class="save-btn" onclick="saveEducation(${index})">Saxla</button>`;
}

// İş redaktə funksiyası
function editWork(index) {
    const job = profileData.profile.work[index];
    const jobDiv = document.querySelectorAll('.field')[1 + profileData.profile.education.length + index]; // İş sahəsi
    jobDiv.innerHTML = `
        <p><strong>Vəzifə:</strong> <input type="text" id="edit-position-${index}" value="${job.position}"></p>
        <p><strong>Şirkət:</strong> <input type="text" id="edit-company-${index}" value="${job.company}"></p>
        <p><strong>Müddət:</strong> <input type="text" id="edit-duration-${index}" value="${job.duration}"></p>
        <button class="save-btn" onclick="saveWork(${index})">Saxla</button>`;
}

// Bacarıq redaktə funksiyası
function editSkill(index) {
    const skill = profileData.profile.skills[index];
    const skillDiv = document.querySelectorAll('.field')[1 + profileData.profile.education.length + profileData.profile.work.length + index]; // Bacarıq sahəsi
    skillDiv.innerHTML = `
        <input type="text" id="edit-skill-${index}" value="${skill}">
        <button class="save-btn" onclick="saveSkill(${index})">Saxla</button>`;
}

// Ad saxlama funksiyası
function saveField(field) {
    profileData.profile[field] = document.getElementById(`edit-${field}`).value;
    saveToLocalStorage();
    renderProfile();
}

// Təhsil saxlama funksiyası
function saveEducation(index) {
    profileData.profile.education[index] = {
        degree: document.getElementById(`edit-degree-${index}`).value,
        university: document.getElementById(`edit-university-${index}`).value,
        year: document.getElementById(`edit-year-${index}`).value
    };
    saveToLocalStorage();
    renderProfile();
}

// İş saxlama funksiyası
function saveWork(index) {
    profileData.profile.work[index] = {
        position: document.getElementById(`edit-position-${index}`).value,
        company: document.getElementById(`edit-company-${index}`).value,
        duration: document.getElementById(`edit-duration-${index}`).value
    };
    saveToLocalStorage();
    renderProfile();
}

// Bacarıq saxlama funksiyası
function saveSkill(index) {
    profileData.profile.skills[index] = document.getElementById(`edit-skill-${index}`).value;
    saveToLocalStorage();
    renderProfile();
}

// localStorage-a saxlama
function saveToLocalStorage() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

// Sıfırlama funksiyası
function resetProfile() {
    profileData = JSON.parse(JSON.stringify(originalData));
    localStorage.setItem('profileData', JSON.stringify(profileData));
    renderProfile();
}

// Səhifə yüklənərkən işə sal
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('profileData')) {
        profileData = JSON.parse(localStorage.getItem('profileData'));
        originalData = JSON.parse(JSON.stringify(profileData));
        renderProfile();
    } else {
        loadProfile();
    }
    document.getElementById('reset-btn').addEventListener('click', resetProfile);
});
