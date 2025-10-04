import React, { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { signIn } from "next-auth/react"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Manual authentication logic here (if applicable)
    // For example, using an API to authenticate the user
    // If successful, redirect to the main page
    try {
      // Example of manual login (replace with your own logic)
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/") // Redirect to the main page after successful login
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    }
  }

  const handleGoogleLogin = () => {
    signIn("google") // Trigger Google authentication
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="mt-4 text-center">or</div>
        <Button onClick={handleGoogleLogin} className="w-full mt-2">
          Login with Google
        </Button>
      </Card>
    </main>
  )
}

export default LoginPage