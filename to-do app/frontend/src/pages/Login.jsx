import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useAuth();
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const ok = await login(username, password);
        if (ok) nav("/");
    };

    return (
        <div style={{maxWidth: 360, margin: '80px auto'}}>
            <h2>Sign in</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button disabled={loading} onClick={submit}>Login</button>
                {error && <p style={{color: 'crimson'}}>{error}</p>}
            </form>
        </div>
    );
}