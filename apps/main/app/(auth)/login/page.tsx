"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@ui/components/button"
import { Input } from "@ui/components/input"
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaGoogle } from "react-icons/fa"
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'

export default function DataPullAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/home')
      }
    }
    checkUser()
  }, [searchParams, router, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (isLogin) {
      if (!showPasswordField) {
        setShowPasswordField(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          console.error('Error logging in:', error)
          setError(error.message)
        } else {
          router.push('/home')
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          data: { full_name: fullName } 
        } 
      })
      if (error) {
        console.error('Error signing up:', error)
        setError(error.message)
      } else if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ id: data.user.id, email: data.user.email, name: fullName, credits: 100 })
        if (insertError) {
          console.error('Error creating user record:', insertError)
          setError('Error creating user record. Please try again.')
        } else {
          router.push('/home')
        }
      }
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'profile'
      },
    })
    if (error) {
      console.error('Error with Google login:', error)
      setError(error.message)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setShowPasswordField(false)
    setEmail("")
    setPassword("")
    setFullName("")
  }

  return (
    <div className="flex min-h-screen bg-[#FFF9E5]">
      <div className="m-auto w-full max-w-md space-y-8 px-4">
        <div className="space-y-6">
          <Image src="/placeholder.svg?height=40&width=100" height={40} width={100} alt="DataPull logo" className="mx-auto" />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isLogin ? "Welcome back!" : "Welcome to DataPull!"}
            </h1>
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Use DataPull to build your personalized outreach campaigns in minutes"
                : "Sign up to start building personalized outreach campaigns in minutes"}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button variant="outline" className="w-full justify-center space-x-2 bg-white" onClick={handleGoogleLogin}>
            <FaGoogle className="h-5 w-5" />
            <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#FFF9E5] px-2 text-gray-500">OR</span>
            </div>
          </div>
          {!isLogin && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white pl-10"
                required
              />
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          )}
          <div className="relative">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white pl-10"
              required
            />
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {isLogin && showPasswordField && (
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white pl-10 pr-10"
                required
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          )}
          {isLogin && showPasswordField && (
            <Link href="#" className="block text-sm text-green-600 hover:underline">
              Forgot password?
            </Link>
          )}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleAuthMode} className="font-semibold text-green-600 hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
        <div className="text-center text-xs text-gray-500">
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}
