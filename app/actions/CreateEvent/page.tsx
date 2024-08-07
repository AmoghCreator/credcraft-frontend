'use client';
import {TextField, Input, Form, Button} from 'react-aria-components';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useRouter, redirect} from 'next/navigation';

interface dirListInterface {
  directoryName: string;
  createdAt: string;
}

export default function CreateEvent() {
  const [dirList, setDir] = useState<dirListInterface[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('usrToken');
    axios
      .get(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/get_dir`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(data => {
        if (data.data === 'User not verified') {
          router.push('/actions/Error/UserNotVerified');
        } else {
          setDir(data.data);
        }
      });

    //console.log(token);
  }, []);

  async function handleDirCreate(e: any) {
    e.preventDefault();
    let token = localStorage.getItem('usrToken');
    const dirName = e.target[0].attributes.value.value;
    setLoading(true);
    let data = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/create_dir`,
      {
        directoryName: dirName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    //console.log(data);
    if (data.data.error != undefined) {
      router.push('/actions/Error/QuotaExceeded');
      return;
    }
    localStorage.setItem('directoryName', dirName);
    router.push('/actions/Event/UploadData');
    setLoading(false);
  }

  async function handleDirGet() {
    let token = localStorage.getItem('usrToken');
    let data = await axios.get(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/get_dir`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  return (
    <>
      {/*<div style={{paddingTop:"4vh"}}>*/}
      <h1
        className="text-2xl md:text-4xl px-10 text-center md:text-left"
        onClick={handleDirGet}
      >
        What are we calling your Big Event ?
      </h1>
      <Form onSubmit={handleDirCreate} className="md:w-3/5 px-10">
        <TextField isRequired autoFocus>
          <Input
            name="directoryName"
            className="border-b-2 md:border-b-4 border-sky-400 text-2xl md:text-5xl w-full font-semibold text-center mb-2 cursor-text focus:outline-none"
          />
        </TextField>
        <Button
          type="submit"
          className={`w-full p-1 flex justify-center text-white font-bold text-xl rounded-full ${
            loading ? 'bg-gray-200' : 'bg-sky-500'
          }`}
        >
          {(loading && <div className="spinner w-8 h-8" />) || <h1>Create</h1>}
        </Button>
      </Form>
      <div className="flex flex-row justify-between px-5 py-2 font-bold w-2/5">
        <h1>Name</h1>
        <h1>Created At</h1>
      </div>
      <div className="overflow-scroll w-2/5 h-1/2">
        {dirList?.map((elm: any, num: any) => (
          <div
            className={
              num % 2 == 0
                ? 'flex flex-row justify-between p-1 px-5'
                : 'flex flex-row justify-between p-1 bg-sky-100 px-5'
            }
            key={num}
          >
            <h1>{elm.directoryName}</h1>
            <h1>
              {new Date(elm.createdAt).getDate()}-
              {new Date(elm.createdAt).getMonth()}-
              {new Date(elm.createdAt).getFullYear()}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
}
