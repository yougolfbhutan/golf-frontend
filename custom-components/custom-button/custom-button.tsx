// Option 1: Client-side approach (recommended)
"use client";

import { APIURL } from "@/api/api";
import { Button } from "@/components/ui/button";

interface CustomButtonComponentAttributes {
  name?: string;
  className?: string;
  buttonstyle?: string;
}

const CustomButtonComponent: React.FC<CustomButtonComponentAttributes> = ({
  name,
  buttonstyle,
  className,
}) => {
  const handleGoogleSignIn =  () => {
    console.log("Sign in Google")
    try {
     window.location.href = `${APIURL.googlelogin}`;
    } catch (error) {
      
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className={`${className}`}>
      <Button 
        onClick={handleGoogleSignIn}
        className={buttonstyle}
        type="button"
      >
        {name}
      </Button>
    </div>
  );
};

export default CustomButtonComponent;