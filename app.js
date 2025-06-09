// Дані тепер завантажуються з db.json
const app = document.getElementById('app');

// --------- Render Home Screen ---------
async function renderHome() {
  app.innerText = '';
  const container = document.createElement('div');
  container.className = 'container';
  // Logo
  const logo = document.createElement('div');
  logo.className = 'logo';
  logo.textContent = 'VEND PRO';
  container.appendChild(logo);
  // Subtitle
  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Технічна база знань: інфо-довідник тривог';
  container.appendChild(subtitle);
  
  try {
    const response = await fetch('/machines');
    if (!response.ok) throw new Error('Network response was not ok');
    const machines = await response.json();
    
    machines.forEach(machine => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = machine.name;
      btn.addEventListener('click', () => {
        location.hash = machine.id;
      });
      container.appendChild(btn);
    });

  } catch (error) {
    console.error("Could not fetch machines:", error);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Не вдалося завантажити список автоматів.';
    errorMsg.style.color = 'red';
    container.appendChild(errorMsg);
  }


  const adminBtn = document.createElement('button');
  adminBtn.className = 'btn';
  adminBtn.textContent = 'Адмін Панель';
  adminBtn.style.background = 'linear-gradient(to right, #4A5568, #718096)';
  adminBtn.addEventListener('click', () => {
      location.hash = '#admin';
  });
  container.appendChild(adminBtn);

  app.appendChild(container);
}

// --------- Render Machine Page ---------
function renderMachine(machineId) {
  app.innerText = '';
  // Watermark
  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.textContent = 'VEND PRO';
  app.appendChild(watermark);
  // Container
  const container = document.createElement('div');
  container.className = 'container machine-content';
  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.textContent = '← НАЗАД';
  backBtn.addEventListener('click', () => {
    location.hash = '';
  });
  container.appendChild(backBtn);
  // Explanation Text
  const infoText = document.createElement('p');
  infoText.textContent = 'Введіть номер тривоги';
  infoText.style.marginTop = '20px'; // Додано відступ зверху
  container.appendChild(infoText);
  // Input Field
  const input = document.createElement('input');
  input.type = 'text'; // Змінено на text для кодів типу "E01"
  input.placeholder = 'Номер тривоги…';
  input.autofocus = true;
  input.style.width = '100%'; // Встановлено ширину
  input.style.maxWidth = '400px'; // Встановлено максимальну ширину
  container.appendChild(input);
  // Enter Button
  const enterBtn = document.createElement('button');
  enterBtn.className = 'btn enter-btn';
  enterBtn.textContent = 'ВВЕСТИ';
  enterBtn.addEventListener('click', async () => {
    const code = input.value.trim();
    if (!code) return;
    try {
      const response = await fetch(`/machines/${machineId}`);
      if (!response.ok) {
        alert('Автомат не знайдено.');
        return;
      }
      const machineData = await response.json();
      const entry = machineData.errors.find(e => e.id === code);

      if (!entry) {
          alert('Помилка з таким кодом не знайдена.');
          return;
      }
      renderErrorPage(machineId, code, entry);
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Не вдалося завантажити дані про помилку.');
    }
  });
  container.appendChild(enterBtn);
  app.appendChild(container);
}

// --------- Render Error Display ---------
function renderErrorPage(machineId, code, entry) {
  if (!entry) {
    alert('Дані про помилку порожні.');
    return;
  }
  app.innerText = '';
  // Watermark
  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.textContent = 'VEND PRO';
  app.appendChild(watermark);
  // Container
  const container = document.createElement('div');
  container.className = 'container';
  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.textContent = '← НАЗАД';
  backBtn.addEventListener('click', () => {
    renderMachine(machineId);
  });
  container.appendChild(backBtn);
  // Error Container
  const errCont = document.createElement('div');
  errCont.className = 'error-container';
  // Code
  const errCode = document.createElement('div');
  errCode.className = 'error-code';
  errCode.textContent = `#${code}`;
  errCont.appendChild(errCode);
  // Ukrainian Message
  const errUa = document.createElement('div');
  errUa.className = 'error-msg';
  errUa.textContent = `${entry.ua} (UA)`;
  errCont.appendChild(errUa);
  // Accordion Container
  const acc = document.createElement('div');
  acc.className = 'accordion';

  // Panel: Послідовність усунення
  const panel1 = createPanel('Опис помилки та причина виникнення', entry.fix);
  acc.appendChild(panel1);
  // Panel: Детальні кроки
  const panel2 = createPanel('Діагностика та кроки по усуненню помилки чи несправностей', entry.steps);
  acc.appendChild(panel2);

  errCont.appendChild(acc);
  container.appendChild(errCont);
  app.appendChild(container);
}

// --------- Create Accordion Panel ---------
function createPanel(title, text) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  // Header
  const header = document.createElement('div');
  header.className = 'panel-header';
  const titleSpan = document.createElement('span');
  titleSpan.textContent = title;
  header.appendChild(titleSpan);
  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'toggle-icon';
  toggleIcon.textContent = '▼';
  header.appendChild(toggleIcon);
  panel.appendChild(header);
  // Content
  const content = document.createElement('div');
  content.className = 'panel-content';
  const p = document.createElement('pre');
  p.textContent = text;
  content.appendChild(p);
  // Copy Section
  const copySection = document.createElement('div');
  copySection.className = 'copy-section';
  const copyIcon = document.createElement('span');
  copyIcon.className = 'copy-icon';
  copyIcon.textContent = '📋';
  copyIcon.title = 'Скопіювати';
  copyIcon.addEventListener('click', () => {
    navigator.clipboard.writeText(text);
  });
  copySection.appendChild(copyIcon);
  // Collapse Button
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'collapse-btn';
  collapseBtn.textContent = 'Згорнути';
  collapseBtn.addEventListener('click', () => {
    content.style.display = 'none';
    toggleIcon.style.transform = 'rotate(0deg)';
  });   
  copySection.appendChild(collapseBtn);
  content.appendChild(copySection);
  panel.appendChild(content);

  // Header click toggles content
  header.addEventListener('click', () => {
    if (content.style.display === 'block') {
      content.style.display = 'none';
      toggleIcon.style.transform = 'rotate(0deg)';
    } else {
      content.style.display = 'block';
      toggleIcon.style.transform = 'rotate(180deg)';
    }
  });

  return panel;
}

// --------- Admin Panel ---------
async function renderAdminPanel() {
    app.innerText = '';
    const container = document.createElement('div');
    container.className = 'container';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '← НАЗАД';
    backBtn.addEventListener('click', () => {
        location.hash = '';
    });
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.textContent = 'Панель адміністрування';
    title.style.color = '#c47500';
    title.style.marginTop = '40px';
    container.appendChild(title);

    const machineSelector = document.createElement('select');
    machineSelector.style.margin = '20px 0';
    machineSelector.style.padding = '10px';
    machineSelector.style.width = '100%';
    machineSelector.style.maxWidth = '400px';
    
    const errorList = document.createElement('div');
    errorList.id = 'error-list';
    errorList.style.width = '100%';
    
    const newErrorBtn = document.createElement('button');
    newErrorBtn.className = 'btn';
    newErrorBtn.textContent = 'Додати нову помилку';
    newErrorBtn.addEventListener('click', () => {
        if (machineSelector.value) {
            renderEditForm(machineSelector.value);
        } else {
            alert("Спочатку додайте автомат!");
        }
    });
    
    const newMachineBtn = document.createElement('button');
    newMachineBtn.className = 'btn';
    newMachineBtn.style.background = 'linear-gradient(to right, #02b935, #00ff4c)';
    newMachineBtn.textContent = 'Додати новий автомат';
    newMachineBtn.addEventListener('click', async () => {
        const name = prompt("Введіть назву нового автомату (наприклад, Coffee Machine):");
        if (!name || !name.trim()) return;
        const id = prompt("Введіть унікальний ID для нового автомату (латиницею, без пробілів, наприклад, 'coffee'):");
        if (!id || !id.trim() || /\s/.test(id)) {
            alert("ID не може бути порожнім або містити пробіли.");
            return;
        }

        try {
            const newMachine = { id: id.toLowerCase(), name: name.trim(), errors: [] };
            const response = await fetch('/machines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMachine),
            });
            if (!response.ok) throw new Error('Не вдалося додати автомат');
            renderAdminPanel(); // Refresh panel
        } catch (e) {
            console.error(e);
            alert('Помилка при додаванні автомату.');
        }
    });

    const deleteMachineBtn = document.createElement('button');
    deleteMachineBtn.className = 'btn';
    deleteMachineBtn.style.background = 'linear-gradient(to right, #c53030, #e53e3e)';
    deleteMachineBtn.textContent = 'Видалити обраний автомат';
    deleteMachineBtn.addEventListener('click', async () => {
        const machineId = machineSelector.value;
        if (!machineId) {
            alert('Не обрано автомат для видалення.');
            return;
        }
        const machineName = machineSelector.options[machineSelector.selectedIndex].text;
        if (confirm(`Ви впевнені, що хочете видалити автомат "${machineName}"? Ця дія невідворотна.`)) {
            try {
                const res = await fetch(`/machines/${machineId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Помилка видалення');
                renderAdminPanel();
            } catch (err) {
                alert(`Не вдалося видалити автомат. ${err.message}`);
            }
        }
    });

    const loadErrors = async (machineId) => {
        try {
            const response = await fetch(`/machines/${machineId}`);
            const machineData = await response.json();
            const errors = machineData.errors || [];
            errorList.innerHTML = '';
            errors.sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true})).forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.style.background = '#222';
                errorDiv.style.border = '1px solid #333';
                errorDiv.style.borderRadius = '5px';
                errorDiv.style.padding = '15px';
                errorDiv.style.margin = '10px 0';
                errorDiv.style.display = 'flex';
                errorDiv.style.justifyContent = 'space-between';
                errorDiv.style.alignItems = 'center';

                const errorText = document.createElement('span');
                errorText.textContent = `#${error.id}: ${error.ua}`;
                errorDiv.appendChild(errorText);

                const buttonsDiv = document.createElement('div');

                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️';
                editBtn.style.marginRight = '10px';
                editBtn.addEventListener('click', () => {
                    renderEditForm(machineId, error);
                });
                buttonsDiv.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️';
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Ви впевнені, що хочете видалити цю помилку?')) {
                        try {
                          const machineRes = await fetch(`/machines/${machineId}`);
                          const machineToUpdate = await machineRes.json();
                          machineToUpdate.errors = machineToUpdate.errors.filter(e => e.id !== error.id);
                          
                          const updateRes = await fetch(`/machines/${machineId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(machineToUpdate)
                          });
                          if (!updateRes.ok) throw new Error('Failed to delete error');
                          loadErrors(machineId);
                        } catch (e) {
                          console.error(e);
                          alert('Не вдалося видалити помилку.');
                        }
                    }
                });
                buttonsDiv.appendChild(deleteBtn);

                errorDiv.appendChild(buttonsDiv);
                errorList.appendChild(errorDiv);
            });
        } catch (e) {
            console.error(e);
            errorList.innerHTML = '<p style="color: red;">Не вдалося завантажити список помилок.</p>';
        }
    };
    
    try {
        const response = await fetch('/machines');
        const machines = await response.json();
        if (machines.length > 0) {
            machines.forEach(machine => {
                const option = document.createElement('option');
                option.value = machine.id;
                option.textContent = machine.name;
                machineSelector.appendChild(option);
            });
            container.appendChild(machineSelector);
            container.appendChild(errorList);
            container.appendChild(newErrorBtn);
            container.appendChild(deleteMachineBtn);
            
            machineSelector.addEventListener('change', (e) => loadErrors(e.target.value));
            loadErrors(machineSelector.value);
        } else {
             const noMachinesMsg = document.createElement('p');
             noMachinesMsg.textContent = "Ще не додано жодного автомату.";
             container.appendChild(noMachinesMsg);
        }
    } catch(e) {
        console.error("Could not fetch machines for admin panel:", e);
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Не вдалося завантажити список автоматів.';
        errorMsg.style.color = 'red';
        container.appendChild(errorMsg);
    }
    
    container.appendChild(newMachineBtn);
    app.appendChild(container);
}

function renderEditForm(machineId, error = null) {
    app.innerText = '';
    const isNew = error === null;
    const container = document.createElement('div');
    container.className = 'container';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '← НАЗАД';
    backBtn.addEventListener('click', () => {
        renderAdminPanel();
    });
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.textContent = isNew ? `Додати помилку для ${machineId}` : `Редагувати помилку #${error.id}`;
    title.style.color = '#c47500';
    title.style.marginTop = '40px';
    container.appendChild(title);

    const form = document.createElement('form');
    form.style.width = '100%';
    form.style.maxWidth = '600px';

    const createInput = (name, label, type = 'text', value = '') => {
        const p = document.createElement('p');
        p.textContent = label;
        p.style.textAlign = 'left';
        p.style.marginTop = '10px';
        const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
        input.name = name;
        input.id = name;
        input.value = value;
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.background = '#222';
        input.style.color = '#fff';
        input.style.border = '1px solid #555';
        input.style.borderRadius = '4px';
        if (type === 'textarea') {
            input.rows = 5;
        }
        form.appendChild(p);
        form.appendChild(input);
        return input;
    };

    const idInput = createInput('id', 'Код помилки (ID)', 'text', isNew ? '' : error.id);
    if (!isNew) {
        idInput.readOnly = true;
        idInput.style.background = '#111';
    }
    createInput('ua', 'Повідомлення (UA)', 'text', isNew ? '' : error.ua);
    createInput('fix', 'Опис/Причина', 'textarea', isNew ? '' : error.fix);
    createInput('steps', 'Кроки для усунення', 'textarea', isNew ? '' : error.steps);

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Зберегти';
    saveBtn.type = 'submit';
    form.appendChild(saveBtn);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.id) {
            alert('ID не може бути порожнім.');
            return;
        }
        
        try {
            const machineRes = await fetch(`/machines/${machineId}`);
            if (!machineRes.ok) throw new Error('Автомат не знайдено');
            const machineData = await machineRes.json();

            if (isNew) {
                if(machineData.errors.some(err => err.id === data.id)) {
                    alert('Помилка з таким ID вже існує для цього автомату.');
                    return;
                }
                machineData.errors.push(data);
            } else {
                const errorIndex = machineData.errors.findIndex(err => err.id === error.id);
                if (errorIndex === -1) throw new Error('Помилка для редагування не знайдена');
                machineData.errors[errorIndex] = data;
            }

            const res = await fetch(`/machines/${machineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(machineData)
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || 'Помилка збереження');
            }
            renderAdminPanel();
        } catch (err) {
            console.error('Save error:', err);
            alert(`Не вдалося зберегти дані. ${err.message}`);
        }
    });

    container.appendChild(form);
    app.appendChild(container);
}

function promptForAdminPassword() {
    const password = prompt("Введіть пароль для доступу:");
    if (password === "Berswsicebenito12") {
        sessionStorage.setItem('isAdmin', 'true');
        renderAdminPanel();
    } else {
        alert("Неправильний пароль!");
        location.hash = '';
    }
}

// --------- Router ---------
async function router() {
  const hash = location.hash.replace('#', '').toLowerCase();
  
  if (!hash) {
      renderHome();
      return;
  }
  
  if (hash === 'admin') {
      if (sessionStorage.getItem('isAdmin') === 'true') {
          renderAdminPanel();
      } else {
          promptForAdminPassword();
      }
      return;
  }
  
  try {
      const res = await fetch(`/machines`);
      if (!res.ok) throw new Error('Could not fetch machines list');
      const machines = await res.json();
      if (machines.some(m => m.id === hash)) {
          renderMachine(hash);
      } else {
          renderHome();
      }
  } catch (e) {
      console.error(e);
      renderHome();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --------- Fade Transition Helper ---------
// Ця функція більше не потрібна
/*
function fadeTransition(callback) {
  app.classList.add('fade-out');
  const onFadeOutEnd = () => {
    app.classList.remove('fade-out');
    app.removeEventListener('animationend', onFadeOutEnd);
    callback();
    // Trigger fade-in
    app.classList.add('fade-in');
    const onFadeInEnd = () => {
      app.classList.remove('fade-in');
      app.removeEventListener('animationend', onFadeInEnd);
    };
    app.addEventListener('animationend', onFadeInEnd);
  };
  app.addEventListener('animationend', onFadeOutEnd);
}
*/
document.addEventListener('DOMContentLoaded', () => {
  const fixLineBreaks = () => {
    document.querySelectorAll('.accordion-body').forEach(el => {
      el.style.whiteSpace = 'pre-line';
      el.style.textAlign = 'left';
    });
  };

  fixLineBreaks();
  document.body.addEventListener('click', () => setTimeout(fixLineBreaks, 0));
});
