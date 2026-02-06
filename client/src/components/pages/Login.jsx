import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "../styles/login.css";

export default function Login({ onLogin }) {
    console.log("Rendering Login component");
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        
        if(isSignUp) {
            if(password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }

        setLoading(true);
        try {
            let userCredential;
            if(isSignUp) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
            const idToken = await user.getIdToken();

            onLogin({ uid: user.uid, email: user.email, token: idToken });
        } catch (err) {
            setError("Invalid email or password.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>ContentFlow AI</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    {isSignUp && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (isSignUp ? "Signing up..." : "Logging in...") : (isSignUp ? "Sign Up" : "Login")}
                    </button>
                </form>
                <div className="toggle-mode">
                    <p>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button type="button" onClick={toggleMode} className="toggle-btn">
                            {isSignUp ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}