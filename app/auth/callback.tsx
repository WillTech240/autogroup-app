import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/components/AuthProvider"

const CallbackPage = () => {
  const router = useRouter()
  const { handleAuthCallback } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = router.query

      if (error) {
        // Handle error case
        console.error("Authentication error:", error)
        return
      }

      // Process the authentication callback
      await handleAuthCallback()
      // Redirect to the main page after successful authentication
      router.push("/")
    }

    handleCallback()
  }, [router, handleAuthCallback])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl">Processing authentication...</h1>
    </div>
  )
}

export default CallbackPage