'use client';
import {TextField, Input, Form, Button} from 'react-aria-components';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function CreateEvent() {
  const [dirList, setDir] = useState([{directoryName: 'Bingo'}]);
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
        setDir(data.data);
      });

    console.log(token);
  }, []);

  async function handleDirCreate(e) {
    e.preventDefault();
    let token = localStorage.getItem('usrToken');
    const dirName = e.target[0].attributes.value.value;
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
    localStorage.setItem('directoryName', dirName);
    router.push('/actions/Event/UploadData');
  }

  async function handleDirGet(e) {
    let token = localStorage.getItem('usrToken');
    let data = await axios
      .get(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/get_dir`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(data => console.log(data.data));
  }
  return (
    <>
      {/*<div style={{paddingTop:"4vh"}}>*/}
        <h1 className="text-4xl " onClick={handleDirGet}>
          What is the name of your event / group ?
        </h1>
        <Form onSubmit={handleDirCreate} className="w-2/5">
          <TextField isRequired autoFocus>
            <Input
              name="directoryName"
              className="border-b-4 border-sky-400 text-5xl w-full font-semibold text-center mb-2 cursor-text focus:outline-none"
            />
          </TextField>
          <Button
            type="submit"
            className="w-full p-1 bg-sky-400 text-white font-bold text-xl rounded-full"
          >
            Create
          </Button>
        </Form>
      <div className="flex flex-row justify-between px-5 py-2 font-bold w-2/5">
        <h1>Name</h1>
        <h1>Created At</h1>
      </div>
      <div className="overflow-scroll w-2/5">
        {dirList.map((elm, num) => (
          <div
            className={
              num % 2 == 0
                ? 'flex flex-row justify-between p-1 px-5'
                : 'flex flex-row justify-between p-1 bg-sky-100 px-5'
            }
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
