import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('authToken');
            const response = await axios.get('/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (statusFilter) {
            return task.status === statusFilter;
        }
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <>
            <Navbar />

            <div className="container border shadow p-3 mx-auto mt-4">
                <ToastContainer />
                <h1 className="text-center">Task List</h1>
                <div className="d-flex justify-content-between mb-3">
                    <select
                        className="form-control w-25"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                    >
                        <option value="">Filter by Status</option>
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Sort by Due Date */}
                    <select
                        className="form-control w-25"
                        onChange={(e) => setSortOrder(e.target.value)}
                        value={sortOrder}
                    >
                        <option value="asc">Sort by Due Date (Ascending)</option>
                        <option value="desc">Sort by Due Date (Descending)</option>
                    </select>
                </div>

                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="4">No tasks found</td>
                                </tr>
                            ) : (
                                sortedTasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.status}</td>
                                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default TaskList;
