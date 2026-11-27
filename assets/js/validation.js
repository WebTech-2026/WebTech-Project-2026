const validationRules = new WeakMap();

function addRule(field, ruleFn) {
  if (!field) return;
  if (!validationRules.has(field)) validationRules.set(field, []);
  validationRules.get(field).push(ruleFn);
}

function isTrimmedTextField(field) {
  return field.tagName === 'TEXTAREA' || (field.tagName === 'INPUT' && field.type === 'text');
}


function blankTextMessage(field) {
  if (isTrimmedTextField(field) && field.required &&
      field.value !== '' && field.value.trim() === '') {
    return 'This field cannot be empty or contain only spaces.';
  }
  return '';
}

function checkField(field) {
  let message = blankTextMessage(field);
  if (message === '') {
    const rules = validationRules.get(field) || [];
    for (const rule of rules) {
      message = rule(field);
      if (message !== '') break;
    }
  }
  field.setCustomValidity(message);
  return message === '';
}

function initValidation(form) {
  const recheck = function (event) {
    if (event.target.setCustomValidity) checkField(event.target);
  };
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);
}

function validateForm(form) {
  form.querySelectorAll('input, textarea, select').forEach(checkField);
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}


function addPasswordMatchRule(passwordField, confirmField) {
  addRule(confirmField, function (field) {
    if (field.value === '') return '';            
    return field.value !== passwordField.value ? 'Passwords do not match.' : '';
  });
  passwordField.addEventListener('input', function () { checkField(confirmField); });
  passwordField.addEventListener('change', function () { checkField(confirmField); });
}

function addUniqueRule(field, table, key, message) {
  addRule(field, function (f) {
    const value = f.value.trim().toLowerCase();
    if (value === '') return '';
    const exists = getAll(table).some(function (record) {
      return String(record[key] ?? '').trim().toLowerCase() === value;
    });
    return exists ? message : '';
  });
}

function initSignupValidation(form) {
  initValidation(form);
  addUniqueRule(form.elements.username, 'users', 'username', 'This username is already taken.');
  addUniqueRule(form.elements.email, 'users', 'email', 'This email is already registered.');
  addPasswordMatchRule(form.elements.password, form.elements.confirmPassword);
}

function getFormValues(form) {
  const values = {};
  form.querySelectorAll('input, textarea, select').forEach(function (field) {
    if (!field.name || field.disabled) return;
    if (field.type === 'checkbox') return;
    if (field.type === 'radio' && !field.checked) return;
    values[field.name] = field.type === 'password' ? field.value : field.value.trim();
  });
  return values;
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.classList.remove('success', 'error');
  element.classList.add('message', type);
  element.hidden = false;
}

function clearMessage(element) {
  element.textContent = '';
  element.classList.remove('success', 'error');
  element.hidden = true;
}


function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function matchesSearch(text, query) {
  return normalizeText(text).includes(normalizeText(query));
}