const url = "http://localhost:3000/api/tareas";

async function getTasks() {
  try {
    const response = await fetch(url);
    const tasks = await response.json();
    const list = document.getElementById("tasks");
    list.innerHTML = "";
    tasks.forEach((task) => {
      const item = document.createElement("li");
      item.textContent = `${task.descripcion} ${
        task.completada ? "(Complete)" : ""
      }`;

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.onclick = () => markAsCompleted(task.id);

      item.appendChild(completeBtn);
      list.appendChild(item);
    });
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
}

async function addTask() {
  const descripcion = document.getElementById("newTask").value;
  if (!descripcion) return alert("Write a description");
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion }),
    });
    document.getElementById("newTask").value = "";
    getTasks(); 
  } catch (error) {
    console.error("Error adding new task:", error);
  }
}

async function markAsCompleted(id) {
  try {
    await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completada: true }),
    });
    getTasks(); 
  } catch (error) {
    console.error("Error marking task as completed:", error);
  }
}

getTasks();
