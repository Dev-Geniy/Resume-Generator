// Переключение темы
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = toggleButton.querySelector('.icon');

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
icon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

// Обработчик переключения
toggleButton.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    icon.textContent = newTheme === 'light' ? '☀️' : '🌙';
});

// Логика генератора резюме
const form = document.getElementById('resume-form');
const downloadButtons = document.getElementById('download-buttons');
const { jsPDF } = window.jspdf;

// Добавление шрифта Roboto для поддержки кириллицы (взято из base64-данных шрифта)
const robotoFont = `
/* Здесь должен быть base64-код шрифта Roboto Regular. 
   Для простоты я опущу полный код, но вы можете взять его из официального репозитория jsPDF 
   или сгенерировать через https://rawgit.com/ или FontSquirrel Matcherator. 
   Примерный формат: */
data:font/truetype;base64,AAEAAAARAQAABAAwR1RFRgT...
`;

// Регистрация шрифта в VFS (это нужно сделать один раз)
const addFontToVFS = () => {
    // Примерный вызов (замените base64 на реальный шрифт)
    // doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
    // doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
};

// В реальном коде добавьте шрифт Roboto через CDN или локально, как указано ниже

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Получение данных из формы
    const name = document.getElementById('name').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const github = document.getElementById('github').value;
    const summary = document.getElementById('summary').value;
    const experience = document.getElementById('experience').value.split('\n').filter(line => line.trim());
    const education = document.getElementById('education').value.split('\n').filter(line => line.trim());
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());

    // Генерация HTML резюме
    const resumeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #f4f4f4; color: #333; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; display: flex; flex-wrap: wrap; }
        .sidebar { flex: 1; min-width: 250px; background: #007bff; color: white; padding: 20px; border-radius: 8px 0 0 8px; animation: slideInLeft 0.5s; }
        .main { flex: 2; min-width: 300px; background: white; padding: 20px; border-radius: 0 8px 8px 0; animation: slideInRight 0.5s; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        h2 { font-size: 1.5rem; margin-bottom: 15px; color: #007bff; }
        .contact { margin: 15px 0; }
        .contact a { color: white; text-decoration: none; }
        .contact a:hover { text-decoration: underline; }
        .summary { background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 4px; }
        .experience, .education { margin-bottom: 20px; }
        .job, .edu { background: #f9f9f9; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #007bff; color: white; padding: 5px 10px; border-radius: 4px; }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (max-width: 768px) {
            .container { flex-direction: column; }
            .sidebar, .main { border-radius: 8px; margin-bottom: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <h1>${name}</h1>
            <p>${title}</p>
            <div class="contact">
                <p>Email: <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p>Phone: ${phone}</p>` : ''}
                ${github ? `<p>GitHub: <a href="${github}" target="_blank">${github}</a></p>` : ''}
            </div>
            <div class="summary">
                <h2>About Me</h2>
                <p>${summary}</p>
            </div>
        </div>
        <div class="main">
            <div class="experience">
                <h2>Experience</h2>
                ${experience.map(exp => {
                    const [jobTitle, company, dates, achievements] = exp.split('|').map(s => s.trim());
                    return `
                        <div class="job">
                            <h3>${jobTitle} - ${company}</h3>
                            <p>${dates}</p>
                            <p>${achievements || ''}</p>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="education">
                <h2>Education</h2>
                ${education.map(edu => {
                    const [degree, institution, dates] = edu.split('|').map(s => s.trim());
                    return `
                        <div class="edu">
                            <h3>${degree}</h3>
                            <p>${institution} - ${dates}</p>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="skills">
                <h2>Skills</h2>
                ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Инструкция для GitHub Pages
    const instructions = `
How to Publish Your Resume on GitHub Pages (No Command Line Needed):

1. Create a GitHub Account:
   - Go to github.com and sign up if you don’t have an account.

2. Create a New Repository:
   - Click the "+" icon in the top-right corner and select "New repository".
   - Name it "your-username.github.io" (replace "your-username" with your GitHub username).
   - Make it public and click "Create repository".

3. Upload Your Resume:
   - In the repository, click "Add file" > "Upload files".
   - Drag and drop the "resume.html" file you downloaded.
   - Click "Commit changes".

4. Enable GitHub Pages:
   - Go to "Settings" in your repository.
   - Scroll to the "Pages" section.
   - Under "Source", select "main" branch and "/ (root)" folder, then click "Save".

5. Access Your Resume:
   - Wait a minute, then visit: https://your-username.github.io
   - Your resume is live!

Enjoy your modern resume online!
    `;

    // Показать кнопки скачивания
    downloadButtons.style.display = 'flex';

    // Скачивание HTML
    document.getElementById('download-html').onclick = () => {
        const blob = new Blob([resumeHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Скачивание инструкции
    document.getElementById('download-instructions').onclick = () => {
        const blob = new Blob([instructions], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'github-pages-instructions.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Скачивание PDF с поддержкой кириллицы
    document.getElementById('download-pdf').onclick = () => {
        const doc = new jsPDF();

        // Используем шрифт с поддержкой кириллицы (например, Roboto)
        // Для простоты я использую встроенный шрифт Times, но вы можете добавить Roboto
        doc.setFont("times"); // Встроенный шрифт с поддержкой кириллицы
        // Если добавить Roboto:
        // doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
        // doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        // doc.setFont('Roboto');

        let y = 10;

        doc.setFontSize(22);
        doc.text(name, 10, y);
        y += 10;
        doc.setFontSize(16);
        doc.text(title, 10, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Email: ${email}`, 10, y);
        y += 6;
        if (phone) doc.text(`Phone: ${phone}`, 10, y), y += 6;
        if (github) doc.text(`GitHub: ${github}`, 10, y), y += 10;

        doc.setFontSize(16);
        doc.text('About Me', 10, y);
        y += 6;
        doc.setFontSize(12);
        doc.text(summary, 10, y, { maxWidth: 180 });
        y += doc.splitTextToSize(summary, 180).length * 5 + 10;

        doc.setFontSize(16);
        doc.text('Experience', 10, y);
        y += 6;
        experience.forEach(exp => {
            const [jobTitle, company, dates, achievements] = exp.split('|').map(s => s.trim());
            doc.setFontSize(12);
            doc.text(`${jobTitle} - ${company}`, 10, y);
            y += 6;
            doc.text(dates, 10, y);
            y += 6;
            if (achievements) doc.text(achievements, 10, y, { maxWidth: 180 }), y += doc.splitTextToSize(achievements, 180).length * 5;
            y += 4;
        });

        doc.setFontSize(16);
        doc.text('Education', 10, y);
        y += 6;
        education.forEach(edu => {
            const [degree, institution, dates] = edu.split('|').map(s => s.trim());
            doc.setFontSize(12);
            doc.text(degree, 10, y);
            y += 6;
            doc.text(`${institution} - ${dates}`, 10, y);
            y += 10;
        });

        doc.setFontSize(16);
        doc.text('Skills', 10, y);
        y += 6;
        doc.setFontSize(12);
        doc.text(skills.join(', '), 10, y, { maxWidth: 180 });

        doc.save('resume.pdf');
    };
});

// Копирование Bitcoin-адреса
const copyBtcButton = document.querySelector('.btc-address .copy-btn');
copyBtcButton.addEventListener('click', () => {
    const btcCode = document.getElementById('btc-code').textContent;
    navigator.clipboard.writeText(btcCode).then(() => {
        copyBtcButton.textContent = 'Copied!';
        setTimeout(() => {
            copyBtcButton.textContent = 'Copy';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
