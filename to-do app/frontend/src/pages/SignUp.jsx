import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post("/api/auth/register/", {
                username,
                password,
            });

            // Store tokens
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            // Redirect to tasks
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
                        Create Account
                    </h2>
                    
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="input input-bordered w-full focus:input-primary"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full focus:input-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button 
                                type="submit" 
                                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="text-center">
                        <p className="text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}