import {useState} from "react";
import '../styles/Login.css';
import {Box} from "@mui/material";

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            sessionStorage.setItem('logged_in', true);
            window.location.href = '/site/songs';
        } else {
            setMessage(data.message);
        }
    };



    return (
    <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    }}>
        <div className={'container'}>
            <form id="login-form" onSubmit={handleSubmit}>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Login</button>
            </form>

            <p>{message}</p>
        </div>
    </Box>
    )
}

export default Login;