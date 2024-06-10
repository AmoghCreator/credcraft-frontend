'use client';
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from 'react-aria-components';
import {useState} from 'react';
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function Auth({}) {
  const [auth, setAuth] = useState(false);
	const router = useRouter();

  function handleAuth(e) {
    e.target.attributes.value.value === 'true' ? setAuth(false) : setAuth(true);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const username = e.target[0].attributes.value.value;
    const password = e.target[1].attributes.value.value;
    let data = await axios.post(`${process.env.ENDPOINT}/api/user/login`, {
      name: username,
      password: password,
    });
		console.log(password)
		console.log(data)
		if(data.data.login == true) {
			localStorage.setItem("usrToken",data.data.usrToken)
			router.push(`/actions/CreateEvent`)
		}
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const username = e.target[0].attributes.value.value;
    const email = e.target[1].attributes.value.value;
    const password = e.target[2].attributes.value.value;
    let data = await axios.post(`${process.env.ENDPOINT}/api/user/signup`, {
      name: username,
      password: password,
    });
		console.log(data.data.signup)
		if(data.data.signup == true) {
			setAuth(false)
		}
  }

  return (
    <div className="w-2/5 mt-10">
      <div className="flex flex-row justify-between px-20">
        <h1
          className={
            auth ? `text-2xl text-gray-400 cursor-pointer` : `text-2xl text-[#09B5FF] cursor-pointer`
          }
          value={true}
          onClick={handleAuth}
        >
          Login
        </h1>
        <h1 className="text-2xl text-gray-400">|</h1>
        <h1
          className={
            auth ? `text-2xl text-[#09B5FF] cursor-pointer` : `text-2xl text-gray-400 cursor-pointer`
          }
          value={false}
          onClick={handleAuth}
        >
          SignUp
        </h1>
      </div>
      <div>
        {/* Login Form */}
        {!auth && (
          <Form className="py-10 flex flex-col gap-7" onSubmit={handleLogin}>
            <TextField
              name="username"
              type="name"
              isRequired
              className="flex flex-col"
            >
              <Label className="text-sky-500 text-xl">User Name</Label>
              <Input className="border-b border-sky-400 text-xl" />
              <FieldError className="text-red-400" />
            </TextField>
            <TextField
              name="email"
              type="password"
              isRequired
              className="flex flex-col"
            >
              <Label className="text-sky-500 text-xl">Password</Label>
              <Input className="border-b border-sky-400 text-xl" />
              <FieldError className="text-red-400" />
            </TextField>
            <Button
              type="submit"
              className="w-full text-center text-white py-3 bg-sky-500"
            >
              Submit
            </Button>
          </Form>
        )}
        {/* Registration Form */}
        {auth && (
          <Form className="py-10 flex flex-col gap-4" onSubmit={handleSignUp}>
            <TextField
              name="username"
              type="name"
              isRequired
              className="flex flex-col"
            >
              <Label className="text-sky-500 text-xl">User Name</Label>
              <Input className="border-b border-sky-400 text-xl" />
              <FieldError className="text-red-400" />
            </TextField>
            <TextField
              name="email"
              type="email"
              isRequired
              className="flex flex-col"
            >
              <Label className="text-sky-500 text-xl">Email</Label>
              <Input className="border-b border-sky-400 text-xl" />
              <FieldError className="text-red-400" />
            </TextField>
            <TextField
              name="email"
              type="password"
              isRequired
              className="flex flex-col"
            >
              <Label className="text-sky-500 text-xl">Password</Label>
              <Input className="border-b border-sky-400 text-xl" />
              <FieldError className="text-red-400" />
            </TextField>
            <Button
              type="submit"
              className="w-full text-center text-white py-3 bg-sky-500"
            >
              Submit
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
