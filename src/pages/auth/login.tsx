import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { signInUser } from "@/services/authService";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Layout title='Sign In - shrlink'>
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-md mx-auto'>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}