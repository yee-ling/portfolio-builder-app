"use client";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { createUser } from "@/api/usersApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Box } from "@radix-ui/themes";

export default function Register() {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = await createUser(user);

    if (result.success) {
      toast.success(result.data.msg);
      router.push("/login");
    } else {
      toast.error(result.msg);
    }
  };

  return (
    <Box className="bg-white dark:bg-gray-700 shadow-md pb-8">
      <div className="flex items-center justify-center min-h-screen">
        <Box className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-gray-900 dark:text-white block text-2xl font-bold text-center mb-6 pr-4">
            Sign Up
          </h2>
          <Form.Root className="w-full max-w-sm" onSubmit={handleSubmit}>
            <Form.Field
              className="md:flex md:items-center mb-6"
              name="fullname"
            >
              <div className="md:w-1/3">
                <Form.Label className="text-gray-900 dark:text-white block font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Fullname
                </Form.Label>
              </div>
              <div className="md:w-2/3">
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match="valueMissing"
                >
                  Please enter your fullname
                </Form.Message>

                <Form.Control asChild>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    name="fullname"
                    value={user.fullname}
                    onChange={handleChange}
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field
              className="md:flex md:items-center mb-6"
              name="username"
            >
              <div className="md:w-1/3">
                <Form.Label className="text-gray-900 dark:text-white block font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Username
                </Form.Label>
              </div>
              <div className="md:w-2/3">
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match="valueMissing"
                >
                  Please enter your username
                </Form.Message>

                <Form.Control asChild>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field className="md:flex md:items-center mb-6" name="email">
              <div className="md:w-1/3">
                <Form.Label className="text-gray-900 dark:text-white block font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Email
                </Form.Label>
              </div>
              <div className="md:w-2/3">
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match="valueMissing"
                >
                  Please enter your email
                </Form.Message>

                <Form.Control asChild>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field
              className="md:flex md:items-center mb-6"
              name="password"
            >
              <div className="md:w-1/3">
                <Form.Label className="text-gray-900 dark:text-white block font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Password
                </Form.Label>
              </div>
              <div className="md:w-2/3">
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match="valueMissing"
                >
                  Please enter your password
                </Form.Message>

                <Form.Control asChild>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field
              className="md:flex md:items-center mb-6"
              name="password2"
            >
              <div className="md:w-1/3">
                <Form.Label className="text-gray-900 dark:text-white block font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Confirm Password
                </Form.Label>
              </div>
              <div className="md:w-2/3">
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match="valueMissing"
                >
                  Please enter your password
                </Form.Message>
                <Form.Message
                  className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
                  match={(value) => value !== user.password}
                >
                  Password and Confirm Password should match
                </Form.Message>

                <Form.Control asChild>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="password"
                    name="password2"
                    value={user.password2}
                    onChange={handleChange}
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <div className="md:flex md:items-center">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3">
                <Form.Submit asChild>
                  <button className="shadow bg-indigo-500 hover:bg-indigo-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                    Register an account
                  </button>
                </Form.Submit>
              </div>
            </div>
          </Form.Root>
        </Box>
      </div>
    </Box>
  );
}
