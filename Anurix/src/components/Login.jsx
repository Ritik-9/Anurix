import React, { useState } from 'react'
import { useMusic } from '../context/MusicContext'

const Login = ({ switchToSignup }) => {
    const { loginUser, setCurrentView } = useMusic()
    const [identifier, setIdentifier] = useState('') 
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            
            const isEmail = identifier.includes('@')
            const payload = {
                password,
                [isEmail ? 'email' : 'userName']: identifier
            }

            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to log in')
            }

            loginUser(data.user, data.token)
            setCurrentView('home')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-full w-full p-6">
            <div className="w-full max-w-md bg-[#161922] border border-gray-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-xs text-gray-400 mt-1">Sign in to continue your session on Anurix</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Username or Email</label>
                        <input 
                            type="text" 
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Enter your username or email"
                            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2fe] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2fe] transition-colors"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-[#00f2fe]/10 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-6">
                    Don't have an account?{' '}
                    <button 
                        onClick={switchToSignup} 
                        className="text-[#00f2fe] font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login