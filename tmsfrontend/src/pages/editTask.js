import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

function EditTask() {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();


    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            status: "",
            dueDate: new Date(),
            userId: sessionStorage.getItem("user_id"),
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(255, "Title must be 255 characters or less")
                .required("Title is required"),
            description: Yup.string().optional(),
            status: Yup.string()
                .oneOf(["pending", "in progress", "completed"], "Invalid status")
                .required("Status is required"),
            dueDate: Yup.date().required("Due date is required"),
        }),
        onSubmit: async (values) => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (token) {
                    await axios.put(
                        `/tasks/${id}`,
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            withCredentials: true,
                        }
                    );
                }
                toast.success("Task updated successfully!");
            } catch (error) {
                console.error("Error updating task:", error.response?.data || error.message);
                toast.error("Failed to update task. Please try again.");
            }
        },
    });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (token) {
                    const response = await axios.get(`/tasks/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    });
                    formik.setValues({
                        title: response.data.title || "",
                        description: response.data.description || "",
                        status: response.data.status || "",
                        dueDate: response.data.dueDate || "",
                        userId: sessionStorage.getItem("user_id"),
                    });
                }
            } catch (error) {
                console.error("Error fetching task details:", error.response?.data || error.message);
                toast.error("Failed to load task details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <ToastContainer />
            <h1 className="text-center">Edit Task</h1>
            <div className="container border shadow p-3 mx-auto">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""}`}
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="invalid-feedback">{formik.errors.title}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="invalid-feedback">{formik.errors.description}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">
                            Status
                        </label>
                        <select
                            className={`form-control ${formik.touched.status && formik.errors.status ? "is-invalid" : ""}`}
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" disabled>
                                Select Status
                            </option>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                            <div className="invalid-feedback">{formik.errors.status}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="dueDate" className="form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            className={`form-control ${formik.touched.dueDate && formik.errors.dueDate ? "is-invalid" : ""}`}
                            id="dueDate"
                            name="dueDate"
                            value={formik.values.dueDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.dueDate && formik.errors.dueDate && (
                            <div className="invalid-feedback">{formik.errors.dueDate}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default EditTask;
