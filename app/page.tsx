"use client";

import { BouncingBalls } from "@/components/bouncing-balls";
import { ShinyButton } from "@/components/shiny-button";

export default function Home() {
  const handleLogin = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Bouncing Balls Background */}
      <div className="absolute inset-0 z-0">
        <BouncingBalls
          numBalls={150}
          backgroundColor="#000000"
          colors={[
            "rgba(88, 101, 242, 0.4)",   // Discord Blurple
            "rgba(114, 137, 218, 0.4)",  // Discord Blue
            "rgba(153, 170, 181, 0.4)",  // Discord Grey
            "rgba(255, 255, 255, 0.2)",  // White
          ]}
          minRadius={0.5}
          maxRadius={2}
          speed={0.3}
          interactive={true}
          interactionRadius={100}
          interactionScale={2}
        />
      </div>

      {/* Login Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Staff Dashboard
            </h1>
          </div>

          {/* Discord Login Button */}
          <ShinyButton onClick={handleLogin}>
            Login with Discord
          </ShinyButton>

          <p className="text-sm text-gray-400">
            Authorize your Discord account to access the staff dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
