
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/NavBar";
import { userApi } from "@/services/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegisterFormValues | null>(null);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Send registration data to API and request OTP
      await userApi.requestOTP(values.email);
      toast.success("OTP sent to your email address");
      
      // Store registration data for later and show OTP form
      setRegistrationData(values);
      setShowOTPForm(true);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const onOTPSubmit = async (values: OTPFormValues) => {
    try {
      if (!registrationData) {
        toast.error("Registration data missing. Please try again.");
        return;
      }

      // Verify OTP and complete registration
      await userApi.verifyOTPAndRegister({
        ...registrationData,
        otp: values.otp,
      });
      
      toast.success("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">
              {showOTPForm 
                ? "Enter the OTP sent to your email" 
                : "Sign up to join BookExchange"}
            </p>
          </div>

          {!showOTPForm ? (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerForm.formState.isSubmitting}
                >
                  {registerForm.formState.isSubmitting 
                    ? "Processing..." 
                    : "Register"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={otpForm.formState.isSubmitting}
                >
                  {otpForm.formState.isSubmitting 
                    ? "Verifying..." 
                    : "Verify OTP"}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
