import { useContext, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

export default function Authentication() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [formState, setFormState] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleRegister, handleLogin } = useContext(AuthContext);

    const switchMode = (mode) => {
        setFormState(mode);
        setSearchParams(mode === 'register' ? { mode: 'register' } : {});
        setError('');
        setMessage('');
    };

    const handleAuth = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true);

        try {
            if (formState === 'login') {
                await handleLogin(username, password);
            } else {
                const result = await handleRegister(name, username, password);
                setMessage(result || 'Your account is ready. Please sign in to continue.');
                setPassword('');
                setFormState('login');
                setSearchParams({});
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLogin = formState === 'login';

    return (
        <main className="authPage">
            <section className="authStory" aria-label="About Konvo">
                <Link className="authBrand" to="/">Konvo<span>.</span></Link>
                <div className="authStoryContent">
                    <p className="authEyebrow">Made for meaningful moments</p>
                    <h1>Good conversations should feel <em>close.</em></h1>
                    <p className="authStoryCopy">A warm, simple space to catch up with the people who matter—wherever they are.</p>
                </div>
                <div className="authCallout">
                    <span className="authCalloutMark">“</span>
                    <p>Distance disappears when the conversation feels real.</p>
                    <span className="authCalloutLine" />
                </div>
                <span className="authOrb authOrbOne" />
                <span className="authOrb authOrbTwo" />
                <span className="authGridPattern" />
            </section>

            <section className="authPanel">
                <div className="authFormWrap">
                    <Link className="authMobileBrand" to="/">Konvo<span>.</span></Link>
                    <p className="authKicker">{isLogin ? 'Welcome back' : 'Start connecting'}</p>
                    <h2>{isLogin ? 'Come on in.' : 'Create your space.'}</h2>
                    <p className="authIntro">{isLogin ? 'Sign in to start your next conversation.' : 'A few details and you’ll be ready to meet.'}</p>

                    <div className="authTabs" role="tablist" aria-label="Authentication options">
                        <button type="button" className={isLogin ? 'active' : ''} onClick={() => switchMode('login')} role="tab" aria-selected={isLogin}>Sign in</button>
                        <button type="button" className={!isLogin ? 'active' : ''} onClick={() => switchMode('register')} role="tab" aria-selected={!isLogin}>Create account</button>
                    </div>

                    <form className="authForm" onSubmit={handleAuth}>
                        {!isLogin && <label>
                            <span>Full name</span>
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required autoFocus />
                        </label>}
                        <label>
                            <span>Username</span>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" autoComplete="username" required autoFocus={isLogin} />
                        </label>
                        <label>
                            <span>Password</span>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} required />
                        </label>

                        {error && <p className="authFeedback authError" role="alert">{error}</p>}
                        {message && <p className="authFeedback authSuccess" role="status">{message}</p>}

                        <button className="authSubmit" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Just a moment…' : isLogin ? 'Sign in to Konvo' : 'Create account'}
                            {!isSubmitting && <span aria-hidden="true">→</span>}
                        </button>
                    </form>

                    <p className="authSwitch">{isLogin ? 'New to Konvo?' : 'Already have an account?'} <button type="button" onClick={() => switchMode(isLogin ? 'register' : 'login')}>{isLogin ? 'Create one' : 'Sign in'}</button></p>
                </div>
            </section>
        </main>
    );
}
