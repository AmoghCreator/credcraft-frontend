'use client';
import React, {useState, useEffect} from 'react';
import {PDFDocument, rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Button,
  FileTrigger,
  Modal,
  DialogTrigger,
  Dialog,
} from 'react-aria-components';
import axios from 'axios';
import Numberline from '@/components/Numberline';
import {useRouter} from 'next/navigation';

const PdfCreator = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [formData, setFormData] = useState({
    Name: 'default',
    xPos: 0,
    yPos: 0,
    Roll: '',
    directory: 'public/certs',
  });
  const [pageProps, setPageProps] = useState({});
  const [file, setFile] = useState(null);
  const [retrievedFileURL, setRetrievedFileURL] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    const token = localStorage.getItem('usrToken');
    const FormDataSend = new FormData();
    FormDataSend.append('templateFile', file);
    FormDataSend.set('directoryName', localStorage.getItem('directoryName'));
    FormDataSend.append('certTemplate', file.name.split('.pdf')[0]);
    FormDataSend.append('font', 'Pacifico-Regular');
    FormDataSend.append('list', localStorage.getItem('list'));
    FormDataSend.append('xPos', formData.xPos);
    FormDataSend.append('yPos', formData.yPos);
    await axios.post('http://127.0.0.1:8080/api/user/genAndUp', FormDataSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('cert created');
    console.log(JSON.parse(localStorage.getItem('list')));
    router.push('/actions/Event/CreateMail');
  }

  function handleInputChange(e) {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleXaxis(slideValue) {
    setFormData(prevData => ({
      ...prevData,
      xPos: slideValue,
    }));
  }

  function handleYaxis(slideValue) {
    setFormData(prevData => ({
      ...prevData,
      yPos: slideValue,
    }));
  }

  const createPdf = async base64String => {
    if (!base64String) {
      console.log('No PDF uploaded');
      return;
    }

    const existingPdfBytes = Uint8Array.from(atob(base64String), c =>
      c.charCodeAt(0),
    ).buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch('/fonts/Poppins-Medium.ttf').then(res =>
      res.arrayBuffer(),
    );
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const {width, height} = firstPage.getSize();
    setPageProps({width, height});

    const fontSize = 24;
    const {Name, xPos, yPos} = formData;

    console.log({xPos, yPos});

    firstPage.drawText(String(Name), {
      x: width / 2 - (Name.length * fontSize) / 3.5 - xPos,
      y: height - height / 2 - yPos,
      size: fontSize,
      font: customFont,
      color: rgb(0, 0, 0),
      weight: 700,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], {type: 'application/pdf'});
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfUrl(pdfUrl);
  };

  useEffect(() => {
    const base64String = localStorage.getItem('uploadedPdf');
    if (base64String) {
      createPdf(base64String);
    }
  }, [formData]);

  async function handleFileSelect(e) {
    const file = e[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      await localStorage.setItem('uploadedPdf', base64String);
      console.log('PDF saved successfully');
      createPdf(base64String); // Ensure PDF is created after file is saved
    };
    reader.readAsDataURL(file);
    setFile(file);
  }

  return (
    <>
      <div className="w-full h-[89vh] flex flex-row items-center justify-center gap-8 p-8 bg-gray-100">
        <div className="w-1/4 bg-white shadow-lg rounded-lg px-6 py-8 flex flex-col items-center gap-6 h-full">
          <Numberline className="w-full" value={50} />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl py-4 font-bold">
              Choose a certificate template
            </h1>
            <div className="w-full h-full flex flex-col justify-center items-center gap-6">
              <DialogTrigger className="h-svh w-svw">
                <Button className="w-full py-3 bg-sky-500 text-white text-xl font-bold rounded-lg transition duration-300 ease-in-out hover:bg-sky-600">
                  Select a PDF Template
                </Button>
                <Modal
                  isDismissable
                  className="absolute h-2/3 w-2/3 z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex justify-center items-center bg-white"
                >
                  <Dialog className="w-full h-full">
                    {({close}) => (
                      <div className="w-full h-full flex flex-row justify-center flex-wrap gap-2 border-2 border-black rounded-xl p-9 overflow-scroll">
                        <FileTrigger onSelect={handleFileSelect}>
                          <Button className="w-1/5 h-1/2 py-3 bg-sky-500 text-white text-l font-bold rounded-lg transition duration-300 ease-in-out hover:bg-sky-600">
														Upload your own
                          </Button>
                        </FileTrigger>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="template1.html"
                        >
                          Template 1
                        </div>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="template2.html"
                        >
                          Template 2
                        </div>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="template3.html"
                        >
                          Template 3
                        </div>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="template4.html"
                        >
                          Template 4
                        </div>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="template5.html"
                        >
                          Template 5
                        </div>
                        <div
                          className="w-1/5 h-1/2 border-2 border-black rounded-xl py-2 cursor-pointer text-center flex justify-center items-center hover:bg-gray-100"
                          value="buildspace.html"
                        >
                          buildspace
                        </div>
                      </div>
                    )}
                  </Dialog>
                </Modal>
              </DialogTrigger>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center">
                  <h1 className="w-1/6">X Axis</h1>
                  <Slider
                    key={0}
                    minValue={
                      -(pageProps.width / 2 - (formData.Name.length * 24) / 3.5)
                    }
                    maxValue={
                      pageProps.width / 2 - (formData.Name.length * 24) / 3.5
                    }
                    defaultValue={0}
                    className="w-full"
                    onChange={handleXaxis}
                  >
                    <SliderOutput />
                    <SliderTrack className="p-1 bg-gray-300 rounded-lg">
                      <SliderThumb className="p-3 bg-sky-500 rounded-full shadow-md" />
                    </SliderTrack>
                  </Slider>
                </div>
                <div className="flex items-center">
                  <h1 className="w-1/6">Y Axis</h1>
                  <Slider
                    key={1}
                    minValue={-pageProps.height / 2}
                    maxValue={pageProps.height / 2}
                    defaultValue={0}
                    className="w-full"
                    onChange={handleYaxis}
                  >
                    <SliderOutput />
                    <SliderTrack className="p-1 bg-gray-300 rounded-lg">
                      <SliderThumb className="p-3 bg-sky-500 rounded-full shadow-md" />
                    </SliderTrack>
                  </Slider>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 mt-6">
                <Button className="w-full py-3 bg-gray-300 text-gray-700 text-xl font-bold rounded-lg">
                  <a href={pdfUrl} download="generated.pdf">
                    Download Sample
                  </a>
                </Button>
                <Button
                  className="w-full py-3 bg-sky-500 text-white text-xl font-bold rounded-lg transition duration-300 ease-in-out hover:bg-sky-600"
                  onClick={handleSubmit}
                >
                  Choose an email template
                </Button>
              </div>
            </div>
          </div>
        </div>

        {pdfUrl && (
          <div className="w-3/5 h-full bg-white shadow-lg rounded-lg overflow-hidden">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full"
            ></iframe>
          </div>
        )}
      </div>
    </>
  );
};

export default PdfCreator;
