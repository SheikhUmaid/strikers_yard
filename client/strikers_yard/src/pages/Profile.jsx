import { useEffect, useState } from "react";
import { updateUserDetails } from "../services/api";
import { LogOut, User, Mail, Phone } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(updated);
      setName(updated?.name || "");
      setEmail(updated?.email || "");
    };

    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name & Email cannot be empty");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await updateUserDetails({ name, email });

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setMessage("Profile updated successfully!");
      window.dispatchEvent(new Event("authChanged"));
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen pt-40 pb-16 px-4 sm:px-6">


      {/* BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 filter blur-[2px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1744565473172-a3c64b1e1bbb?q=80&w=1051&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* DIM OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      {/* MAIN CARD */}
      <div
        className="
          max-w-xl mx-auto w-full p-6 sm:p-8
          rounded-3xl backdrop-blur-3xl bg-gray-950/20
          border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]
        "
      >

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.pinimg.com/736x/3e/77/89/3e7789b164213f91358aaa4a47bd8d95.jpg"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-emerald-400 shadow-xl object-cover"
            alt="Profile Avatar"
          />

          <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-emerald-200 drop-shadow-lg text-center">
            {user?.name || "Unnamed User"}
          </h1>

          <p className="text-emerald-100/70 text-sm mt-1 text-center break-all">
            {user?.email || "No Email Added"}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-200/80">
              Name
            </label>
            <div className="
              flex items-center gap-3 px-4 py-3 
              border rounded-xl bg-white/5 border-white/10
            ">
              <User className="text-emerald-300 w-5 h-5" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-emerald-100 text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-200/80">
              Email
            </label>
            <div className="
              flex items-center gap-3 px-4 py-3 
              border rounded-xl bg-white/5 border-white/10
            ">
              <Mail className="text-emerald-300 w-5 h-5" />
              <input
                type="email"
                className="flex-1 bg-transparent outline-none text-emerald-100 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* PHONE (read-only) */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-200/80">
              Phone Number
            </label>
            <div className="
              flex items-center gap-3 px-4 py-3 
              border rounded-xl bg-gray-900/30 border-white/10
            ">
              <Phone className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-gray-400 text-sm sm:text-base"
                value={user?.phone_number || ""}
                disabled
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              w-full py-3 sm:py-4 rounded-xl font-semibold
              bg-gradient-to-r from-emerald-400 to-lime-300 text-emerald-900
              shadow-xl hover:scale-[1.02] transition
              disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed
            "
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="
              w-full flex justify-center items-center gap-2 py-3 mt-1
              bg-red-500 text-white rounded-xl text-sm sm:text-base
              hover:bg-red-600 transition shadow-lg
            "
          >
            <LogOut size={18} /> Logout
          </button>

          {/* MESSAGE */}
          {message && (
            <p
              className={`text-center mt-3 font-medium ${
                message.includes("success")
                  ? "text-emerald-300"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
