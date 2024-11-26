// script.js
document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    const entryList = document.getElementById('entry-list');
    const resetButton = document.getElementById('reset');
    const totalIncome = document.getElementById('total-income');
    const totalExpenses = document.getElementById('total-expenses');
    const netBalance = document.getElementById('net-balance');
    const filters = document.getElementsByName('filter');
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    const calculateTotals = () => {
      let income = 0;
      let expenses = 0;
      entries.forEach(entry => {
        if (entry.type === 'income') income += entry.amount;
        else expenses += entry.amount;
      });
      totalIncome.textContent = income.toFixed(2);
      totalExpenses.textContent = expenses.toFixed(2);
      netBalance.textContent = (income - expenses).toFixed(2);
    };
  
    const saveToLocalStorage = () => {
      localStorage.setItem('entries', JSON.stringify(entries));
    };
  
    const renderEntries = (filter = 'all') => {
      entryList.innerHTML = '';
      const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);
      filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${entry.description} - $${entry.amount.toFixed(2)}</span>
          <button class="edit" data-index="${index}">Edit</button>
          <button class="delete" data-index="${index}">Delete</button>
        `;
        entryList.appendChild(li);
      });
    };
  
    const addEntry = (entry) => {
      entries.push(entry);
      saveToLocalStorage();
      renderEntries();
      calculateTotals();
    };
  
    const updateEntry = (index, updatedEntry) => {
      entries[index] = updatedEntry;
      saveToLocalStorage();
      renderEntries();
      calculateTotals();
    };
  
    const deleteEntry = (index) => {
      entries.splice(index, 1);
      saveToLocalStorage();
      renderEntries();
      calculateTotals();
    };
  
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value.trim();
      const amount = parseFloat(document.getElementById('amount').value.trim());
      const type = document.querySelector('input[name="type"]:checked').value;
      const index = entryForm.dataset.editIndex;
  
      const newEntry = { description, amount, type };
  
      if (index) {
        updateEntry(index, newEntry);
        delete entryForm.dataset.editIndex;
      } else {
        addEntry(newEntry);
      }
  
      entryForm.reset();
    });
  
    entryList.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains('delete')) {
        deleteEntry(index);
      } else if (e.target.classList.contains('edit')) {
        const entry = entries[index];
        document.getElementById('description').value = entry.description;
        document.getElementById('amount').value = entry.amount;
        document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
        entryForm.dataset.editIndex = index;
      }
    });
  
    filters.forEach(filter => {
      filter.addEventListener('change', () => renderEntries(filter.value));
    });
  
    resetButton.addEventListener('click', () => entryForm.reset());
  
    // Initialize
    renderEntries();
    calculateTotals();
  });
  