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
import OpenAI from 'openai';

export default function CreateMail() {
  const [html, setHtml] = useState('<p>Type your HTML here</p>');
  const [selection, setSelection] = useState('template1.html');
  const [loading, setLoading] = useState(false);
  const [isCustomTemplate, setIsCustomTemplate] = useState(true);
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function handleSubmit() {
    const token = localStorage.getItem('usrToken');
    console.log('mailing');
    setLoading(true);

    let data = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/mail`,
      {
        list: localStorage.getItem('list'),
        subject: 'a special certificate of awesomeness for buildspace',
        mailTemplate: html,
        directoryName: localStorage.getItem('directoryName'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (data.data.error != undefined) {
      router.push('/actions/Error/QuotaExceeded');
      return;
    } else {
      router.push('FinalPage');
    }

    setLoading(false);
  }

  async function onPrompt() {
    if (isCustomTemplate) {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Create an HTML emailing template according to the instructions, return the html code only no other text 
						Here is the example :- 
						<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>certificate distribution</title>
</head>

<body>
<div style="font-family: 'arial', sans-serif; background-color: #ffd700; color: white;">

    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000; border-radius: 20px; color : white">

        <h2 style="color: #ffffff;">certificate distribution</h2>

        <p>hello \${name},</p>

        <p>we are pleased to inform you that your certificate is now ready for download.</p>

        <p>you can download your certificate by clicking on the link below:</p>

				<a href=\${link} target="_blank"
            style="display: inline-block; padding: 10px 20px; background-color: #ffffff; color: #000000; text-decoration: none; border-radius: 5px; margin-top: 15px;">download
            certificate</a>

        <p>if you have any questions or encounter any issues with downloading your certificate, please feel free to contact us.</p>

        <p>thank you for your participation!</p>

        <p style="color: #ffffff;">best regards,<br>the certificate distribution team</p>

    </div>

</div>
</body>

</html>

Here is the description, follow the description as artistically as possible, there needs to be a download link, as all the mails are for certificate distribution : ${prompt}
`,
            },
          ],
          model: 'gpt-3.5-turbo-1106',
        });
        console.log(completion.choices[0].message.content);
        setHtml(completion.choices[0].message.content);
      } catch (error) {
        console.error('Error generating HTML:', error);
      }
    }
  }

  function handleSelection(e) {
    const selectedValue = e.target.attributes['data-value'].value;
    console.log(selectedValue);
    setSelection(selectedValue);

    if (selectedValue === 'custom') {
      setIsCustomTemplate(true);
    } else {
      setIsCustomTemplate(false);
      fetch(`/mail-templates/${selectedValue}`) // Adjust the path if necessary
        .then(response => response.text())
        .then(data => setHtml(data))
        .catch(error => console.error('Error fetching HTML:', error));
    }
  }

  return (
    <div className="w-full h-fit flex flex-col items-center gap-5 pb-10">
      <Numberline className="w-2/5 mt-10" value={100} />
      <h1 className="text-2xl font-bold mt-4">Make an Email template with AI !</h1>
      <div className="w-full h-[60vh] flex flex-row items-center justify-center gap-8 px-9">
        {!isCustomTemplate && (
          <div className="w-1/3 h-full flex flex-col gap-2 border-2 border-black rounded-xl p-9 overflow-scroll">
            <div
              className="h-12 border-2 border-transparent rounded-xl py-2 cursor-pointer text-center text-white font-semibold flex justify-center items-center bg-sky-400 hover:bg-white hover:border-sky-400 hover:text-black transition-all"
              data-value="custom"
              onClick={handleSelection}
            >
              Custom Template with AI !
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="template1.html"
              onClick={handleSelection}
            >
              Template 1
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="template2.html"
              onClick={handleSelection}
            >
              Template 2
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="template3.html"
              onClick={handleSelection}
            >
              Template 3
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="template4.html"
              onClick={handleSelection}
            >
              Template 4
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="template5.html"
              onClick={handleSelection}
            >
              Template 5
            </div>
            <div
              className="h-12 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
              data-value="buildspace.html"
              onClick={handleSelection}
            >
              buildspace
            </div>
          </div>
        )}
        <div
          className={`w-${isCustomTemplate ? 'full' : '3/4'} h-full flex flex-col items-center justify-between`}
        >
          {isCustomTemplate && (
            <div className="w-full flex gap-2">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2"
                placeholder="Type your prompt here"
              />
              <Button
                className="bg-sky-400 rounded-xl px-4 text-white text-xl"
                onClick={onPrompt}
              >
                Prompt
              </Button>
            </div>
          )}
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
            onPress={handleSubmit}
          >
            Send Mail
          </Button>
        </div>
        {loading && (
          <div className="absolute bg-white h-40 w-[30vw] right-0 bottom-2 border-4 border-blue-400 rounded-xl flex justify-center items-center">
            <h1>
              Your mails are being sent, you can close this window or wait for
              final page
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
