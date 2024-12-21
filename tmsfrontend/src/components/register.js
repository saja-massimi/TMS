import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axiosInstance';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "role") {
            setFormData({ ...formData, is_pending_teacher: parseInt(value, 10) });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setErrors({ ...errors, [name]: '' });
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .required('Confirm Password is required'),
    });

    const validate = (formData) => {
        try {
            validationSchema.validateSync(formData);
            return {};
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
            return validationErrors;
        }
    };

    const showToast = (type, message) => {
        toast[type](message, {
            position: "top-right",
            autoClose: type === 'success' ? 3000 : 5000,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axiosInstance.post('/register', formData);
            showToast('success', "Registered Successfully!");
            sessionStorage.setItem('authToken', response.data.token || '');
            sessionStorage.setItem('user_id', response.data.user?.id || '');
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            const serverErrors = error.response?.data?.errors || {};
            const errorMessages = Object.values(serverErrors).flat().join(' ');
            setErrors(serverErrors);
            showToast('error', errorMessages);
        }
    };

    return <div className="container border shadow p-3 mx-auto">
        <ToastContainer></ToastContainer>
        <div
            className="tab-pane"
            id="pills-register"
            role="tabpanel"
            aria-labelledby="tab-register"
        >
            <form onSubmit={handleSubmit}>

                <div className="text-center mb-3">
                    <h3>Sign up</h3>

                </div>
                {/* Name input */}
                <div data-mdb-input-init="" className="form-outline mb-4">
                    <input type="text"
                        id="registerName"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.name}
                        name='name'
                    />
                    <label className="form-label" htmlFor="registerName">
                        Name
                    </label>
                    {errors.name && (
                        <p className="text-danger small">{errors.name}</p>
                    )}
                </div>

                {/* Email input */}
                <div data-mdb-input-init="" className="form-outline mb-4">
                    <input type="email" id="registerEmail" className="form-control"
                        onChange={handleChange}
                        value={formData.email}
                        name='email'
                    />
                    <label className="form-label" htmlFor="registerEmail">
                        Email
                    </label>
                    {errors.email && (
                        <p className="text-danger small">{errors.email}</p>
                    )}
                </div>
                {/* Password input */}
                <div data-mdb-input-init="" className="form-outline mb-4">
                    <input type="password" id="registerPassword" className="form-control"
                        onChange={handleChange}
                        value={formData.password}
                        name='password' />
                    <label className="form-label" htmlFor="registerPassword">
                        Password
                    </label>
                    {errors.password && (
                        <p className="text-danger small">{errors.password}</p>
                    )}
                </div>
                {/* Repeat Password input */}
                <div data-mdb-input-init="" className="form-outline mb-4">
                    <input
                        type="password"
                        id="registerRepeatPassword"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.password_confirmation}
                        name='password_confirmation'
                    />
                    <label className="form-label" htmlFor="registerRepeatPassword">
                        Repeat password
                    </label>

                    {errors.password_confirmation && (
                        <p className="text-danger small">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    data-mdb-button-init=""
                    data-mdb-ripple-init=""
                    className="btn btn-primary btn-block mb-3"
                >
                    Sign in
                </button>
            </form>
        </div>


    </div>;

}

export default Register;