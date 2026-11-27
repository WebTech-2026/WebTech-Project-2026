const STORAGE_PREFIX = 'readspace_';

function tableKey(table) {
  return STORAGE_PREFIX + table;
}

function counterKey(table) {
  return STORAGE_PREFIX + table + '_nextId';
}

function getAll(table) {
  try {
    const data = JSON.parse(localStorage.getItem(tableKey(table)));
    if (!Array.isArray(data)) return [];
    return data.filter(function (record) { return record && typeof record === 'object'; });
  } catch (error) {
    return [];
  }
}

function saveAll(table, records) {
  localStorage.setItem(tableKey(table), JSON.stringify(records));
}


function takeNextId(table, records) {
  const highestId = records.reduce(function (max, record) {
    return Math.max(max, Number(record.id) || 0);
  }, 0);
  let counter = parseInt(localStorage.getItem(counterKey(table)), 10);
  if (!(counter > 0)) counter = 1;
  const id = Math.max(counter, highestId + 1);
  localStorage.setItem(counterKey(table), String(id + 1));
  return id;
}

function getById(table, id) {
  const found = getAll(table).find(function (record) {
    return Number(record.id) === Number(id);
  });
  return found || null;
}

function insert(table, record) {
  const records = getAll(table);
  const newRecord = Object.assign({}, record, { id: takeNextId(table, records) });
  records.push(newRecord);
  saveAll(table, records);
  return newRecord;
}

function update(table, id, changes) {
  const records = getAll(table);
  const index = records.findIndex(function (record) {
    return Number(record.id) === Number(id);
  });
  if (index === -1) return null;
  records[index] = Object.assign({}, records[index], changes, { id: records[index].id });
  saveAll(table, records);
  return records[index];
}

function remove(table, id) {
  const records = getAll(table);
  const remaining = records.filter(function (record) {
    return Number(record.id) !== Number(id);
  });
  if (remaining.length === records.length) return false;
  saveAll(table, remaining);
  return true;
}

function find(table, predicate) {
  return getAll(table).filter(predicate);
}