 
class AnimalTable {
    constructor(containerId, data, config) {
      this.containerId = containerId;
      this.data = data;
      this.config = config;
      this.renderTable();
    }
    renderTable() {
        const container = document.getElementById(this.containerId);
        const tableClass = this.config.nameStyle.includes('table-2') ? 'table-2' : 
                           this.config.nameStyle.includes('table-3') ? 'table-3' : '';
                           
        container.innerHTML = `
          <table class="table table-bordered ${tableClass}">
            <thead>
              <tr>
                ${Object.keys(this.data[0]).map((key) =>
                  this.config.sortable.includes(key)
                    ? `<th onclick="tables['${this.containerId}'].sortTable('${key}')">${key.toUpperCase()} 🔼</th>`
                    : `<th>${key.toUpperCase()}</th>`
                ).join('')}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.map((item) => `
                <tr>
                  ${Object.keys(item).map((key) => `
                    <td class="${key === 'name' ? 'name' : ''}">
                      ${key === 'image' ? `
                        <div class="hover-img">
                          <img src="${item[key]}" alt="${item.name}" width="50">
                          <div class="animal-name">${item.name}</div>
                        </div>
                      ` : item[key]}
                    </td>
                  `).join('')}
                  <td>
                    <button class="btn btn-sm btn-warning" onclick="tables['${this.containerId}'].editAnimal('${item.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="tables['${this.containerId}'].deleteAnimal('${item.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
           
        `;
      }
      
  
      addAnimal() {
        const nameInput = document.getElementById(`name${this.containerId.slice(-1)}`);
        const locationInput = document.getElementById(`location${this.containerId.slice(-1)}`);
        const sizeInput = document.getElementById(`size${this.containerId.slice(-1)}`);
        const imageInput = document.getElementById(`image${this.containerId.slice(-1)}`);
      
        const name = nameInput.value.trim();
        const location = locationInput.value.trim();
        const size = parseFloat(sizeInput.value);
        const image = imageInput.value.trim();
      
        if (this.validate({ name, location, size, image })) {
          const newAnimal = {
            id: animal.id+1,
            name,
            location,
            size,
            image,
          };
          this.data.push(newAnimal);
          this.renderTable();
          nameInput.value = "";
          locationInput.value = "";
          sizeInput.value = "";
          imageInput.value = "";
        }
      }
      
  
    deleteAnimal(id) {
      this.data = this.data.filter((animal) => animal.id !== id);
      this.renderTable();
    }
    cancelEdit() {
        this.renderTable();  
      }
      
  
    editAnimal(id) {
        const rowIndex = this.data.findIndex((animal) => animal.id === id);
        if (rowIndex === -1) return;
      
        const animal = this.data[rowIndex];
        const tableBody = document.querySelector(`#${this.containerId} tbody`);
        const row = tableBody.rows[rowIndex];
      
 
        row.innerHTML = `
        <td><input type="text" class="form-control" id="editName${id}" value="${animal.id}" required></td>
        <input type="text" class="form-control" id="editName${id}" value="${animal.speceies}" required></td>
          <td><input type="text" class="form-control" id="editName${id}" value="${animal.name}" required></td>
          <td><input type="text" class="form-control" id="editLocation${id}" value="${animal.location}" required></td>
          <td><input type="number" class="form-control" id="editSize${id}" value="${animal.size}" min="1" required></td>
          <td>
            <input type="text" class="form-control" id="editImage${id}" value="${animal.image}">
            <small class="text-muted">Leave blank to keep the existing image</small>
          </td>
          <td>
            <button class="btn btn-sm btn-success" onclick="tables['${this.containerId}'].saveEdit('${id}')">Save</button>
            <button class="btn btn-sm btn-secondary" onclick="tables['${this.containerId}'].cancelEdit()">Cancel</button>
          </td>
        `;
      }
      
  
    sortTable(key) {
      this.data.sort((a, b) => (a[key] > b[key] ? 1 : -1));
      this.renderTable();
    }
  
    validate(newAnimal, excludeId = null) {
      if (!newAnimal.name || !newAnimal.location || isNaN(newAnimal.size) || newAnimal.size <= 0) {
        alert("Invalid input. Please enter valid data.");
        return false;
      }
  
      if (this.data.some((animal) => animal.name === newAnimal.name && animal.id !== excludeId)) {
        alert("Duplicate animal name is not allowed.");
        return false;
      }
  
      return true;
    }
  }
  
 
const tables = {};

 
async function fetchData() {
  try {
    const response = await fetch('./animal.json'); 
    if (!response.ok) {
      throw new Error('Failed to load JSON file');
    }

    const animals = await response.json();

 
    const { bigCats, dogs, bigFish } = animals;

 
    tables['table1'] = new AnimalTable('table1', bigCats, { sortable: ['name', 'location', 'size'], nameStyle: '' });
    tables['table2'] = new AnimalTable('table2', dogs, { sortable: ['name', 'location'], nameStyle: 'font-weight-bold' });
    tables['table3'] = new AnimalTable('table3', bigFish, { sortable: ['size'], nameStyle: 'font-weight-bold font-italic text-primary' });

    console.log('Tables initialized:', tables);
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
}

 
fetchData();

  