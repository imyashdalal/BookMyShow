import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useLoggedInUser, useSignup } from "../../hooks/auth.hooks";

const SignupPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: signupAsync, isPending } = useSignup();
  const { data: loggedInUser } = useLoggedInUser();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (loggedInUser) navigate("/dashboard");
  }, [loggedInUser, navigate]);

  const isConfirmPasswordMatch = useMemo(
    () => password === confirmPassword || confirmPassword === "",
    [confirmPassword, password]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmPasswordMatch) return;

    try {
      await signupAsync({ firstname, lastname, email, password });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold">Join CineBook!</h1>
          <p className="py-6">
            Create your account to start booking movie tickets, writing reviews, and discovering your next favorite film.
          </p>
        </div>
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="input input-bordered"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm password"
                className={`input input-bordered ${!isConfirmPasswordMatch ? 'input-error' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {!isConfirmPasswordMatch && (
                <label className="label">
                  <span className="label-text-alt text-error">Passwords do not match</span>
                </label>
              )}
            </div>
            
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isConfirmPasswordMatch || isPending}>
                {isPending ? "Creating Account..." : "Sign Up"}
              </button>
            </div>

            <div className="divider">OR</div>

            <div className="form-control">
              <button type="button" className="btn btn-outline">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{' '}
                <a onClick={() => navigate('/sign-in')} className="link link-primary cursor-pointer">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
