"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Box, Typography } from "@mui/material";
import { useEffect, Suspense } from "react";

const SignInContent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        backgroundColor: "#f0f0f0",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <Button
        variant="outlined"
        onClick={() => signIn("google", { callbackUrl })}
        sx={{
          mt: 2,
          textTransform: "none",
          color: "rgba(0, 0, 0, 0.54)",
          backgroundColor: "#fff",
          borderColor: "#ccc",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            borderColor: "#bbb",
          },
          width: "100%",
          maxWidth: 360,
          fontSize: 16,
          fontWeight: 500,
          padding: "10px 0",
        }}
      >
        {/* Include your Google logo if desired */}
        Sign in with Google
      </Button>
    </Box>
  );
};

const SignInPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
