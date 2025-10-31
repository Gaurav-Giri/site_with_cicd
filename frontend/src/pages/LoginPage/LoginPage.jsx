import React, { useState } from "react";
import EmailForm from "../../elements/login/Emailform/EmailForm.jsx";
import OTPVerification from "../../elements/login/OTPForm/OTPForm.jsx";
import UserDetailsForm from "../../elements/login/UserDetailsForm/UserDetailsForm.jsx";
import { useAuth } from "../../AuthContext.jsx";
import { useThemeTrigger } from "../../ThemeTrigger.jsx"; // Import the theme hook
import styles from "./LoginPage.module.css"; // Specific CSS Module

function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const { darkMode } = useThemeTrigger(); // Get theme state

  const handleEmailSent = (userEmail) => {
    setEmail(userEmail);
    setStep("otp");
  };

  const handleOtpVerified = (requiresDetails) => {
    if (requiresDetails) {
      setStep("details");
    } else {
      window.location.href = "/";
    }
  };

  const handleDetailsSaved = (token, userData) => {
    login(token, userData);
    window.location.href = "/";
  };

  return (
    <div className={styles.loginPageContainer}>
      <h1>Login with OTP</h1>

      {step === "email" && <EmailForm onSuccess={handleEmailSent} />}
      {step === "otp" && (
        <OTPVerification email={email} onSuccess={handleOtpVerified} />
      )}
      {step === "details" && (
        <UserDetailsForm email={email} onSuccess={handleDetailsSaved} />
      )}
    </div>
  );
}

export default LoginPage;