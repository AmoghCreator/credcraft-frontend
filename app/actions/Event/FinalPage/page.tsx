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
import Image from 'next/image';

export default function CreateMail() {
  const [html, setHtml] = useState('<p>Type your HTML here</p>');
  const [selection, setSelection] = useState('template1.html');

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
        subject: 'mail api test',
        mailTemplate: selection.split('.')[0],
        directoryName: localStorage.getItem('directoryName'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('mailed');
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
    <div className="w-full h-full flex flex-col items-center">
      <Numberline className="w-2/5" value={100} />
      <h1 className="text-3xl font-bold mt-6">All mails have been sent</h1>
      <div className="w-full flex flex-col items-center justify-center gap-8 p-10">
        <div className="rounded-full border-4 border-sky-500 p-10">
          <Image src="/tickMark.png" width={150} height={150} />
        </div>
      </div>
    </div>
  );
}
