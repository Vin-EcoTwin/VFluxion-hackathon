"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"EV" | "CPO">("EV");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "EV") {
      router.push("/ev-owner/dashboard");
    } else {
      router.push("/cpo/live-map");
    }
  };

  return (
    <div className="light bg-background min-h-screen flex text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <div className="flex-1 flex flex-col md:flex-row w-full">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-[45%] flex flex-col justify-center px-container-padding py-xl bg-surface-container-lowest z-10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative">
          <div className="max-w-md w-full mx-auto space-y-xl">
            {/* Branding */}
            <div className="text-left space-y-sm">
              <img alt="V-fluxion Logo" className="h-10 w-auto mb-lg" src="/images/vfluxion-logo-frontend.png" />
              <h1 className="font-h1 text-[40px] font-bold text-primary tracking-tight">Welcome Back</h1>
              <p className="font-body-lg text-[18px] text-on-surface-variant">Sign in to manage your energy network or charging sessions.</p>
            </div>
            
            {/* Role Selection Toggle */}
            <div className="bg-surface-container-low p-sm rounded-lg flex space-x-unit w-full" role="tablist">
              <button 
                onClick={() => setRole("EV")}
                aria-selected={role === "EV"} 
                className={`flex-1 py-md px-sm rounded-DEFAULT font-label-md text-label-md flex items-center justify-center gap-xs transition-colors ${role === "EV" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-variant/50"}`}
                role="tab"
              >
                <span className="material-symbols-outlined text-xl">electric_car</span>
                I am an EV Driver
              </button>
              <button 
                onClick={() => setRole("CPO")}
                aria-selected={role === "CPO"} 
                className={`flex-1 py-md px-sm rounded-DEFAULT font-label-md text-label-md flex items-center justify-center gap-xs transition-colors ${role === "CPO" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:bg-surface-variant/50"}`}
                role="tab"
              >
                <span className="material-symbols-outlined text-xl">hub</span>
                I am a CPO
              </button>
            </div>
            
            {/* Form */}
            <form className="space-y-lg" onSubmit={handleLogin}>
              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface block" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="email" placeholder="name@company.com" type="email" />
                </div>
              </div>
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface block" htmlFor="password">Password</label>
                  <a className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-md text-body-md" id="password" placeholder="••••••••" type="password" />
                </div>
              </div>
              <button className="w-full bg-primary text-white py-md rounded-lg font-label-md text-label-md flex justify-center items-center gap-sm hover:brightness-95 transition-all shadow-sm hover:shadow-md mt-xl" type="submit">
                Login
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
            
            {/* Footer Text */}
            <div className="text-center mt-xl">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account? <a className="text-primary font-label-md text-label-md hover:underline" href="#">Request Access</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side: Image/Visual */}
        <div className="hidden md:block md:w-[55%] relative overflow-hidden bg-surface-container">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest/20 to-primary-container/10 mix-blend-multiply z-10 pointer-events-none"></div>
          <img alt="Sustainable City Energy Grid" className="absolute inset-0 w-full h-full object-cover object-center" src="/images/login-background.png" />
        </div>
      </div>
    </div>
  );
}
