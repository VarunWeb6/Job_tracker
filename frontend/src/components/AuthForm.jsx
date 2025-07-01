import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'; // Named import
import { Alert, AlertDescription } from './ui/Alert'; // Named import
import Input from './ui/Input';   // Default import
import Button from './ui/Button'; // Default import

const AuthForm = () => {
    // ... component logic remains the same
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = isLogin
            ? await login(formData.email, formData.password)
            : await register(formData.name, formData.email, formData.password);
        if (!result.success) {
            setError(result.error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Target className="h-6 w-6 text-blue-600" />
                        {isLogin ? 'Welcome Back' : 'Join JobTracker AI'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input type="text" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={loading}/>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading}/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={loading}/>
                        </div>
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline" disabled={loading}>
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default AuthForm;