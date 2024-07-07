'use client';
import Numberline from '@/components/Numberline';
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
  DropZone,
  Text,
  Form,
} from 'react-aria-components';
import {FileTrigger} from 'react-aria-components';
import type {FileDropItem} from 'react-aria';
import React from 'react';
import axios from 'axios';
import path from 'path';
import {useRouter} from 'next/navigation';

export default function UploadData() {
  const [files, setFiles] = React.useState<any>(null);
  const [entries, setEntries] = React.useState<any>([]);
  const [keys, setKeys] = React.useState(['Name', 'Roll', 'Email']);
  const [loading, setLoading] = React.useState<boolean>(false);
  let router = useRouter();

  function handleEntry(e: any) {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.currentTarget));
    setEntries([...entries, data]);
    localStorage.setItem('list', JSON.stringify([...entries, data]));
    console.log(entries);
  }

  async function uploadFile(e: any) {
    const token = localStorage.getItem('usrToken');
    e.preventDefault();
    const formData = new FormData();
    formData.append('csvFile', e.target[1].files[0]);
    console.log(e.target[1].files[0]);
    setLoading(true);
    let resp = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/csvToJson`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    setKeys(Object.keys(resp.data.data[0]));
    setEntries([...entries, ...resp.data.data]);
    localStorage.setItem('list', JSON.stringify(resp.data.data));
    setLoading(false);
    console.log(Object.keys(resp.data.data[0]));
    console.log(localStorage.getItem('list'));
  }

  function handleRouting() {
    router.push('/actions/Event/CreateTemplate');
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 bg-gray-100 h-[80vh] w-screen">
        <div className="w-full flex flex-col items-center gap-6">
          <Numberline value={0} className="w-2/5" />
          <h1 className="text-3xl font-bold">Provide the recipients data</h1>
          <DialogTrigger>
            {!files ? (
              <Button
                className={`w-2/6 ${
                  loading ? 'bg-gray-200' : 'bg-sky-400'
                } py-3 flex justify-center text-white text-3xl font-bold rounded-full`}
              >
                {(loading && <div className="spinner w-8 h-8" />) || (
                  <h1>Click to Upload CSV</h1>
                )}
              </Button>
            ) : (
              <Button className="w-2/6 py-3 bg-sky-400 text-white text-3xl font-bold rounded-full">
                {files} selected
              </Button>
            )}
            <Modal
              className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex justify-center items-center"
              isDismissable
            >
              <Dialog>
                {({close}) => (
                  <DropZone
                    onDrop={e => {
                      let files = e.items.filter(
                        file => file.kind === 'file',
                      ) as FileDropItem[];
                      let filenames = files.map(file => file.name);
                      setFiles(filenames.join(', '));
                    }}
                    className="bg-white p-36 rounded-2xl border-dashed border-4 border-blue-400"
                  >
                    <Form
                      onSubmit={uploadFile}
                      className="flex flex-col w-full"
                    >
                      <FileTrigger
                        onSelect={(e: any) => {
                          let files = Array.from(e);
                          let filenames = files.map((file: any) => file.name);
                          setFiles(filenames.join(', '));
                        }}
                      >
                        {/*name="csvFile"*/}
                        <Button className="bg-gray-200 border-solid border-black border-2 px-3 py-2">
                          Browse
                        </Button>
                      </FileTrigger>
                      <Text
                        slot="label"
                        style={{display: 'block'}}
                        className="text-sm text-blue-800"
                      >
                        {files || 'Drop files here'}
                      </Text>
                      {files != null && (
                        <Button
                          type="submit"
                          className="bg-blue-400 border-2 border-blue-800 mt-2 text-white"
                        >
                          Submit
                        </Button>
                      )}
                    </Form>
                  </DropZone>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
          <div className="flex flex-row items-center gap-4">
            <div className="h-px w-64 bg-black"></div>
            <h1 className="text-xl font-bold">or</h1>
            <div className="h-px w-64 bg-black"></div>
          </div>
          <h1 className="text-2xl font-bold">Enter Manually</h1>

          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-3 text-center px-5 font-bold w-1/2">
              <h1>Name</h1>
              <h1>UID</h1>
              <h1>Email</h1>
            </div>
            <Form
              className="grid grid-cols-3 text-center py-2 font-bold w-1/2"
              onSubmit={handleEntry}
            >
              <TextField name="Name">
                <Input className="w-4/5" />
              </TextField>
              <TextField name="Roll">
                <Input className="w-4/5" />
              </TextField>
              <TextField name="Email">
                <Input className="w-4/5" />
              </TextField>
              <Button
                type="submit"
                className="absolute right-80 w-10 bg-sky-400"
              >
                {' '}
                +{' '}
              </Button>
            </Form>
            <div className="overflow-scroll h-32 w-1/2">
              {entries.map((elm: any, num: number) => (
                <div
                  className={`grid grid-cols-3 text-center p-1 px-5 ${
                    num % 2 == 0 ? 'bg-white' : 'bg-sky-100'
                  }`}
                  key={num}
                >
                  <h1>{elm[keys[0]]}</h1>
                  <h1>{elm[keys[1]]}</h1>
                  <h1>{elm[keys[2]]}</h1>
                </div>
              ))}
            </div>
          </div>
          <Button
            onPress={handleRouting}
            className={`w-2/6 py-3 ${
              entries.length == 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-sky-400 cursor-pointer'
            } text-white text-3xl font-bold rounded-full flex justify-center`}
          >
            {(entries.length == 0 && <h1>Please upload recipients data</h1>) || (
              <h1>Choose a certificate template!</h1>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
