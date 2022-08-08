import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const SignUp: NextPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
        <div className="w-96">
          <form
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e)}
          >
            <label
              htmlFor="large-input"
              className="block mb-2 text-lg font-medium text-gray-90"
            >
              Name
            </label>
            <input
              type="text"
              id="large-input"
              required
              name="name"
              autoComplete="off"
              placeholder="e.g. jun"
              className={`block w-full p-4 bg-gray-50 border text-gray-900 border-gray-300 placeholder-gray-700`}
            />
            <label
              htmlFor="large-input"
              className="block mb-2 text-lg font-medium text-gray-90"
            >
              Email
            </label>
            <input
              type="email"
              id="large-input"
              required
              name="name"
              autoComplete="off"
              placeholder="e.g. email@mail.com"
              className={`block w-full p-4 bg-gray-50 border text-gray-900 border-gray-300 placeholder-gray-700`}
            />
            <label
              htmlFor="large-input"
              className="block mb-2 text-lg font-medium text-gray-90"
            >
              Password
            </label>
            <input
              type="password"
              id="large-input"
              required
              name="name"
              autoComplete="off"
              placeholder="Password"
              className={`block w-full p-4 bg-gray-50 border text-gray-900 border-gray-300 placeholder-gray-700`}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;