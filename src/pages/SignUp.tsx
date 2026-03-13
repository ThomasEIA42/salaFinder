
import { useState, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import Button from "../componentes/Button";
import { Link } from "react-router-dom";

export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    function onSubmit(e: any) {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !confirmPass.trim()) {
            setError("Email and Password are required fields");
            return;
        }
        if (password !== confirmPass) {
            setError("Passwords do not match");
            return;
        }
        setSubmitted(true);
        setError(null)
    }
    useEffect(() => {
        if (submitted)
            window.location.href = "/"
    }, [submitted]);
    return (
        <main className="mx-auto max-w-md px-6 py-10">
            <section className=" bg-brand-200 shadow rounded-card px-4">
                <div className="flex items-center text-text text-xl space-between rounded-t-card py-2">
                    <FiUserPlus />
                    <h1 className="font-semibold pl-1">Sign Up</h1>
                </div>

                <p className="font-raleway font-bold text-sm text-surface">
                    We hope you enjoy this page, welcome
                </p>
                {!submitted &&
                    <form
                        className="mt-4 flex flex-col gap-3"
                        onSubmit={onSubmit}>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-muted "> Email
                            </span>
                            <input
                                className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
                                type="email"
                                placeholder="aaaa@domain.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-muted "> Password
                            </span>
                            <input
                                className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-xs text-muted "> Confirm Password
                            </span>
                            <input
                                className="rounded-input border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-300"
                                type="password"
                                placeholder="******"
                                value={confirmPass}
                                onChange={(event) => setConfirmPass(event.target.value)}
                                required
                            />
                        </label>
                        {error && <p>{error}</p>}
                        <Button type="submit" variant="primary">
                            Submit
                        </Button>
                        <p className="m-0 text-sm text-muted">
                            Already have an account?{" "} 
                            <Link className="text-brand-600 hove:underline hover:font-semibold" to="/login"> Log In</Link>
                        </p>
                    </form>
                }
            </section>
        </main>
    );
}
