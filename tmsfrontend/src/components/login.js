import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
function Login() {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await validationSchema.validate(formData);
            setErrors({});

            const response = await axiosInstance.post('/login', formData);

            console.log(response);

            if (response.data.token || response.data.user) {
                toast.success('Login successful!', { position: "top-right", autoClose: 2000 });
                sessionStorage.setItem('authToken', response.data.token || '');
                sessionStorage.setItem('user_id', response.data.user?.id || '');
                setTimeout(() => {
                    navigate('/home');
                }, 3000);
            }
        } catch (validationError) {
            if (validationError.name === 'ValidationError') {
                const validationErrors = validationError.inner.reduce((acc, error) => {
                    acc[error.path] = error.message;
                    return acc;
                }, {});
                setErrors(validationErrors);
            } else {
                const serverErrors = validationError.response?.data?.errors || {};
                setErrors(serverErrors);
                toast.error(
                    validationError.response?.data?.message || 'Something went wrong!',
                    { position: "top-right", autoClose: 5000 }
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container border shadow p-3 mx-auto">
            <ToastContainer />
            <div
                className="tab-pane fade show active"
                id="pills-login"
                role="tabpanel"
                aria-labelledby="tab-login"
            >
                <form onSubmit={handleSubmit}>
                    <div className="text-center mb-3">
                        <h3>Sign in</h3>


                    </div>

                    <div data-mdb-input-init="" className="form-outline mb-4">
                        <input type="email" id="email" className="form-control" 
                        name='email'
                        onChange={handleChange}
                        value={formData.email}
                        />
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        {errors.email && <p className="text-danger small">{errors.email}</p>}

                    </div>
             
                    <div data-mdb-input-init="" className="form-outline mb-4">
                        <input type="password" id="loginPassword" className="form-control"
                        name='password'
                        onChange={handleChange}
                        value={formData.password}
                        />
                        <label className="form-label" htmlFor="loginPassword">
                            Password
                        </label>
                        {errors.password && <p className="text-danger small">{errors.password}</p>}
                    </div>


                    {/* Submit button */}
                    <button
                        type="submit"
                        data-mdb-button-init=""
                        data-mdb-ripple-init=""
                        className="btn btn-primary btn-block mb-4"
                    >
                        Sign in
                    </button>
                    {/* Register buttons */}
                    <div className="text-center">
                        <p>
                            Not a member? <a href="#!">Register</a>
                        </p>
                    </div>
                </form>
            </div>

        </div>
    );

}

export default Login;