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
import Link from 'next/link';
import axios from 'axios';
import {useRouter} from 'next/navigation';

export default function Auth({}) {
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  function handleAuth(e: any) {
    e.target.attributes['data-value'].value === 'true'
      ? setAuth(false)
      : setAuth(true);
  }

  async function handleLogin(e: any) {
    e.preventDefault();
    const username = e.target[0].attributes.value.value;
    const password = e.target[1].attributes.value.value;
    setLoading(true);
    let data = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/login`,
      {
        name: username,
        password: password,
      },
    );
    setLoading(false);
    //console.log(password);
    //console.log(data);
    if (data.data.login == true) {
      localStorage.setItem('usrToken', data.data.usrToken);
      router.push(`/actions/CreateEvent`);
    }
  }

  async function handleSignUp(e: any) {
    e.preventDefault();
    const username = e.target[0].attributes.value.value;
    const email = e.target[1].attributes.value.value;
    const password = e.target[2].attributes.value.value;
    setLoading(true);
    let data = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/signup`,
      {
        name: username,
        password: password,
      },
    );
    setLoading(false);
    //console.log(data.data.signup);
    if (data.data.signup == true) {
      setAuth(false);
    }
  }

  return (
    <div className="md:w-2/5 w-full mt-10 px-10 md:px-0">
      <div className="flex flex-row justify-between md:px-20 w-full">
        <h1
          className={
            auth
              ? `text-2xl text-gray-400 cursor-pointer`
              : `text-2xl text-[#09B5FF] cursor-pointer`
          }
          data-value={true}
          onClick={handleAuth}
        >
          Login
        </h1>
        <h1 className="text-2xl text-gray-400">|</h1>
        <h1
          className={
            auth
              ? `text-2xl text-[#09B5FF] cursor-pointer`
              : `text-2xl text-gray-400 cursor-pointer`
          }
          data-value={false}
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
              className={`w-full flex justify-center text-white py-3 ${
                loading ? 'bg-gray-200' : 'bg-sky-500'
              }`}
            >
              {(loading && <div className="spinner w-8 h-8" />) || (
                <h1>Login !</h1>
              )}
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
              className={`w-full flex justify-center text-white py-3 ${
                loading ? 'bg-gray-200' : 'bg-sky-500'
              }`}
            >
              {(loading && <div className="spinner w-8 h-8" />) || (
                <h1>Sign Up !</h1>
              )}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
