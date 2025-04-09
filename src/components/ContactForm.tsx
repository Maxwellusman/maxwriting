import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            
            if (response.ok) {
                // Reset form on successful submission
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    message: "",
                });
                
                // Show success toast
                toast.success(result.message || "Email sent successfully!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                // Show error toast
                toast.error(result.message || "Failed to send email. Please try again.", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="isolate bg-white">
            {/* Toast container for notifications */}
            <ToastContainer />
            
            <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange sm:col-span-2"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange sm:col-span-2"
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-gray-900 focus:ring-2 focus:ring-primary-orange focus:border-primary-orange sm:col-span-2 resize-none"
                        rows={4}
                        required
                    ></textarea>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary-orange px-3.5 py-2.5 text-white font-semibold shadow hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-orange"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Let's Talk"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;