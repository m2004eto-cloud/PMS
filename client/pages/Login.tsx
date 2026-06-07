import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = [
    { email: "admin@pms.com", password: "admin123", role: "admin" as UserRole },
    { email: "supervisor@pms.com", password: "supervisor123", role: "supervisor" as UserRole },
    { email: "qa@pms.com", password: "qa123", role: "qa_manager" as UserRole },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const account = demoAccounts.find(
        (acc) =>
          acc.email === credentials.email && acc.password === credentials.password
      );

      if (account) {
        // Use AuthContext login to update both React state and localStorage
        login({
          email: account.email,
          role: account.role,
          loginTime: new Date().toISOString(),
        });
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">PMS</h1>
          <p className="text-text-secondary">Production Management System</p>
        </div>

        {/* Login Card */}
        <div className="card-ninja mb-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Sign In</h2>

          {error && (
            <div className="bg-critical bg-opacity-10 border border-critical border-opacity-30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-critical flex-shrink-0 mt-0.5" />
              <p className="text-sm text-critical">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="user@pms.com"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-secondary bg-opacity-50 border border-border text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-secondary bg-opacity-50 border border-border text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-2.5"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Demo Accounts
          </h3>
          <div className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setCredentials({
                    email: account.email,
                    password: account.password,
                  });
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-border hover:bg-secondary hover:bg-opacity-50 transition-colors text-sm"
              >
                <p className="font-mono text-primary text-xs mb-1">
                  {account.email}
                </p>
                <p className="text-foreground capitalize">
                  Role: {account.role.replace(/_/g, " ")}
                </p>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-4 pt-4 border-t border-border">
            Click any account to auto-fill credentials, then click "Sign In"
          </p>
        </div>
      </div>
    </div>
  );
}
