
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { sendPasswordReset } from "@/services/authService";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      
      // Handle Firebase auth errors
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else {
        setError("An error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password - shrlink">
      <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Password reset email sent! Check your inbox for further instructions.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Back to Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
