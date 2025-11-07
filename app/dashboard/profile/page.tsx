export default function ProfilePage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Purple glow from top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-light text-white/90 tracking-tight mb-4">
          Profile
        </h1>
        <p className="text-white/40 text-sm">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
