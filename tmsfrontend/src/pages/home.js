import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

function Home() {
    const isLoggedIn = !!sessionStorage.getItem("authToken");
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }

        const fetchTasks = async () => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (token) {
                    const response = await axios.get("/tasks", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });

                    setTasks(response.data);
                }
            } catch (error) {
                console.error("Fetch tasks failed:", error.response?.data || error.message);
            }
        };

        fetchTasks();
    }, [isLoggedIn, navigate]);

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (token) {
                await axios.post(
                    "/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
            }

            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("user_id");

            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("authToken");
            if (token) {
                await axios.delete(`/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
            }

            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
        } catch (error) {
            console.error("Delete task failed:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Navbar
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Add Task
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={handleLogout}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Tasks Table */}
            <div className="container">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <th scope="row">{task.id}</th>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{task.status}</td>
                                    <td>{task.due_date}</td>
                                    <td>
                                        <button className="btn btn-primary mx-2">Edit</button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={(e) => handleDelete(e, task.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No tasks found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Home;
