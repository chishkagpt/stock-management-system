// 初始化数据库
function initializeDatabase() {
  if (!localStorage.getItem('inventory')) {
      localStorage.setItem('inventory', JSON.stringify([]));
  }
}

// 渲染库存列表
function renderInventory() {
  const inventory = JSON.parse(localStorage.getItem('inventory'));
  const tableBody = document.querySelector("#inventoryTable tbody");
  tableBody.innerHTML = ""; // 清空表格

  inventory.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.location}</td>
          <td>
              <button class="deleteButton" data-index="${index}">删除</button>
          </td>
      `;
      tableBody.appendChild(row);
  });

  // 添加删除事件
  document.querySelectorAll(".deleteButton").forEach(button => {
      button.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          deleteItem(index);
      });
  });
}

// 添加商品
function addItem() {
  const name = document.getElementById("itemName").value;
  const quantity = document.getElementById("itemQuantity").value;
  const location = document.getElementById("itemLocation").value;

  if (!name || !quantity || !location) {
      alert("请填写完整信息！");
      return;
  }

  const inventory = JSON.parse(localStorage.getItem('inventory'));
  inventory.push({ name, quantity, location });
  localStorage.setItem('inventory', JSON.stringify(inventory));
  renderInventory();

  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemLocation").value = "";
}

// 删除商品
function deleteItem(index) {
  const inventory = JSON.parse(localStorage.getItem('inventory'));
  inventory.splice(index, 1);
  localStorage.setItem('inventory', JSON.stringify(inventory));
  renderInventory();
}

// 导出数据
function exportData() {
  const data = localStorage.getItem('inventory');
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'inventory-backup.json';
  link.click();
}

// 导入数据
function importData(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function () {
          localStorage.setItem('inventory', reader.result);
          alert("数据已导入！");
          renderInventory();
      };
      reader.readAsText(file);
  }
}

// 清空数据
function clearData() {
  if (confirm("确定要清空所有数据吗？")) {
      localStorage.removeItem('inventory');
      initializeDatabase();
      renderInventory();
  }
}

// 初始化
document.getElementById("addItemButton").addEventListener("click", addItem);
document.getElementById("exportData").addEventListener("click", exportData);
document.getElementById("importData").addEventListener("change", importData);
document.getElementById("clearData").addEventListener("click", clearData);

initializeDatabase();
renderInventory();
