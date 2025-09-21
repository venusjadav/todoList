import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");
    const [selected, setSlected] = useState(new Set());

    const fetchTodos = async () => {
        const res = await axios.get("http://localhost:5000/api/todos");
        setTodos(res.data);
    };

    const addTodos = async () => {
        if (text.trim() === "") {
            alert("Please enter a task before adding");
            return;
        }
        const res = await axios.post("http://localhost:5000/api/todos", {
            text,
        });
        setText("");
        setTodos([...todos, res.data]);
    };

    const toggleSelect = (id) => {
        const updated = new Set(selected);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSlected(updated);
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
        setTodos(todos.filter((todo) => todo._id !== id));
        const updated = new Set(selected);
        setSlected(updated);
    };

    const deleteSelected = async () => {
        for (let id of selected) {
            await axios.delete(`http://localhost:5000/api/todos/${id}`);
        }
        setTodos(todos.filter((todo) => !selected.has(todo._id)));
        setSlected(new Set());
    };

    const deleteAll = async () => {
        await axios.delete("http://localhost:5000/api/todos");
        setTodos([]);
        setSlected(new Set());
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="continer">
            <h1>Todo Apps</h1>
            <div className="section">
                <div className="block">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Please enter a Task"
                    />
                    <button onClick={addTodos}>Add</button>
                    <button
                        onClick={deleteSelected}
                        disabled={selected.size === 0}
                    >
                        Delete Selected
                    </button>
                    <button onClick={deleteAll} disabled={todos.length === 0}>
                        Delete All
                    </button>
                </div>
                <div className="texts">
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo._id}>
                                <input
                                    type="checkbox"
                                    checked={selected.has(todo._id)}
                                    onChange={() => toggleSelect(todo._id)}
                                />
                                {todo.text}{" "}
                                <button onClick={(e) => deleteTodo(todo._id)}>
                                    Delete
                                </button>{" "}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
