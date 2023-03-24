 import { useState, useEffect } from 'react';

 const API_BASE = "http://localhost:3001";
  
function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      let response = await fetch(API_BASE + '/todos');
      let responseData = await response.json();

      setTodos(responseData);
    } catch (err) {
      console.log(err)
    }
  }

  const deleteTodo = async id => {
    try {
      let response = await fetch(API_BASE + '/todo/delete/' + id, { method: 'DELETE'});
      let responseData = await response.json();

      setTodos(todos => todos.filter(todo => todo._id !== responseData._id));
    } catch (err) {
      console.log(err)
    }
  }

  const addTodo = async () => {
    try {
      let response = await fetch(API_BASE + '/todo/new', {
         method: 'POST',
         headers: {
          "Content-Type": "application/json",
         },
         body: JSON.stringify({
          text: newTodo
         })
       });
      let responseData = await response.json();
      setTodos([...todos, responseData]);
      setPopupActive(false);
      setNewTodo(null);
      
    } catch (err) {
      console.log(err)
    }
  }

  const completeTodo = async id => {
    try {
      let response = await fetch(API_BASE + '/todo/complete/' + id);
      let responseData = await response.json();

      setTodos(todos => todos.map(todo => {
        if (todo._id === responseData ._id) {
          todo.complete = responseData .complete;
        }
        
        return todo; 
      }))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <h1>Welcome!</h1>
      <h4>Your tasks</h4>

      <div className="todos"> 
        {todos.map(todo => (
          <div 
            className={"todo " + (todo.complete && "is-complete" )} 
            key={todo._id}
            onClick={() => completeTodo(todo._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input 
              type="text" 
              className="add-todo-input" 
              onChange={e => setNewTodo(e.target.value)} 
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
