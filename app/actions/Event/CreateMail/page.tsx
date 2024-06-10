'use client';
import Numberline from '@/components/Numberline';
import {useState} from 'react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';
import axios from 'axios';
import {useRouter} from 'next/navigation';

export default function CreateMail() {
  const [html, setHtml] = useState('<p>Type your HTML here</p>');
  const [selection, setSelection] = useState('template1.html');
  const router = useRouter();
  const handleChange = event => {
    setHtml(event.target.value);
  };

  async function handleSubmit(e) {
    const token = localStorage.getItem('usrToken');
    console.log('mailing');
    await axios.post(
      'http://127.0.0.1:8080/api/user/mail',
      {
        list: localStorage.getItem('list'),
        subject: 'a special certificate of awesomeness for buildspace',
        mailTemplate: selection.split('.')[0],
        directoryName: localStorage.getItem('directoryName'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    router.push('FinalPage');
  }

  function handleSelection(e) {
    console.log(e.target.attributes.value.value);
    setSelection(e.target.attributes.value.value);
    fetch(`/mail-templates/${e.target.attributes.value.value}`) // Adjust the path if necessary
      .then(response => response.text())
      .then(data => setHtml(data))
      .catch(error => console.error('Error fetching HTML:', error));
  }

  return (
    <>
      <Numberline className="w-2/5" value={100} />
      <h1 className="text-3xl font-bold mt-4">Choose a mailing template</h1>
      <div className="w-full h-[60vh] flex flex-row items-center justify-center gap-8 px-9 mt-8">
        <div className="w-1/3 h-full flex flex-col gap-2 border-2 border-black rounded-xl p-9">
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="template1.html"
            onClick={handleSelection}
          >
            Template 1
          </div>
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="template2.html"
            onClick={handleSelection}
          >
            Template 2
          </div>
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="template3.html"
            onClick={handleSelection}
          >
            Template 3
          </div>
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="template4.html"
            onClick={handleSelection}
          >
            Template 4
          </div>
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="template5.html"
            onClick={handleSelection}
          >
            Template 5
          </div>
          <div
            className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
            value="buildspace.html"
            onClick={handleSelection}
          >
            buildspace
          </div>
        </div>
        <div className="w-3/4 h-full flex flex-col items-center justify-between">
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              overflow: 'auto',
            }}
            dangerouslySetInnerHTML={{__html: html}}
            className="w-full h-full p-4"
          />
          <Button
            className="bg-sky-400 rounded-full font-bold text-white text-xl w-full py-3 mt-4 hover:bg-sky-500 transition-colors duration-300"
            onClick={handleSubmit}
          >
            Send Mail
          </Button>
        </div>
      </div>
    </>
  );
}
