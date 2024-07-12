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
  TextField,
  Input,
  Label,
  Popover,
  ListBox,
  ListBoxItem,
  ComboBox,
  Select,
  SelectValue,
} from 'react-aria-components';
import axios from 'axios';
import Numberline from '@/components/Numberline';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

const PdfCreator = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [formData, setFormData] = useState({
    Name: 'User Name',
    xPos: 0,
    yPos: 0,
    Roll: '',
    directory: 'public/certs',
  });
  const [pageProps, setPageProps] = useState({});
  const [file, setFile] = useState();
  const [retrievedFileURL, setRetrievedFileURL] = useState('');
  const [textFields, setTextFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    const token = localStorage.getItem('usrToken');
    const FormDataSend = new FormData();
    FormDataSend.append('templateFile', file);
    FormDataSend.set('directoryName', localStorage.getItem('directoryName'));
    FormDataSend.append('certTemplate', file.name.split('.pdf')[0]);
    FormDataSend.append('font', 'Poppins-Medium.ttf');
    FormDataSend.append('list', localStorage.getItem('list'));
    FormDataSend.append('xPos', formData.xPos);
    FormDataSend.append('yPos', formData.yPos);
    FormDataSend.append('textFields', JSON.stringify(textFields));
    setLoading(true);
    let data = await axios.post(
      `${process.env.NEXT_PUBLIC_ENDPOINT}/api/user/genAndUp`,
      FormDataSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (data.data.error != undefined) {
      router.push('/actions/Error/QuotaExceeded');
      return;
    } else {
      //console.log('cert created');
      //console.log(JSON.parse(localStorage.getItem('list')));
      router.push('/actions/Event/CreateMail');
      setLoading(false);
    }
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

  function handleXaxisTextField(index, slideValue) {
    setTextFields(prevTextFields => {
      // Ensure the index is within bounds
      if (index >= 0 && index < prevTextFields.length) {
        // Create a shallow copy of the array
        const updatedTextFields = [...prevTextFields];

        // Create a copy of the specific field object
        const updatedField = {...updatedTextFields[index], xPos: slideValue};

        // Update the array with the modified field
        updatedTextFields[index] = updatedField;

        //console.log(index);
        //console.log(updatedTextFields);

        // Return the updated array to set the state
        return updatedTextFields;
      }

      // If the index is out of bounds, return the previous state unchanged
      return prevTextFields;
    });
  }

  function handleYaxisTextField(index, slideValue) {
    setTextFields(prevTextFields => {
      // Ensure the index is within bounds
      if (index >= 0 && index < prevTextFields.length) {
        // Create a shallow copy of the array
        const updatedTextFields = [...prevTextFields];

        // Create a copy of the specific field object
        const updatedField = {...updatedTextFields[index], yPos: slideValue};

        // Update the array with the modified field
        updatedTextFields[index] = updatedField;

        //console.log(index);
        //console.log(updatedTextFields);

        // Return the updated array to set the state
        return updatedTextFields;
      }

      // If the index is out of bounds, return the previous state unchanged
      return prevTextFields;
    });
  }

  function handleTextFieldInput(index, e) {
    setTextFields(prevTextFields => {
      const updatedTextField = [...prevTextFields];
      const updatedField = {...updatedTextField[index], text: e.target.value};
      updatedTextField[index] = updatedField;
      return updatedTextField;
    });
  }

  function handleFontSizeInput(index, e) {
    if (e.target.value >= 1) {
      setTextFields(prevTextFields => {
        const updatedTextField = [...prevTextFields];
        const updatedField = {
          ...updatedTextField[index],
          fontSize: parseInt(e.target.value),
        };
        updatedTextField[index] = updatedField;
        return updatedTextField;
      });
    }
  }

  function handleFontSelection(index, e) {
    setTextFields(prevTextFields => {
      const updatedTextField = [...prevTextFields];
      const updatedField = {
        ...updatedTextField[index],
        font: e,
      };
      updatedTextField[index] = updatedField;
      return updatedTextField;
    });
    //console.log(e);
  }

  function addTextField() {
    const sampleTextField = {
      text: 'sample field',
      xPos: 0,
      yPos: 0,
      fontSize: 24,
      font: 'Poppins-Medium.ttf',
    };
    setTextFields([...textFields, sampleTextField]);
  }

  const createPdf = async base64String => {
    if (!base64String) {
      //console.log('No PDF uploaded');
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

    //console.log({xPos, yPos});

    firstPage.drawText(String(Name), {
      x: width / 2 - (Name.length * fontSize) / 3.5 - xPos,
      y: height - height / 2 - yPos,
      size: fontSize,
      font: customFont,
      color: rgb(0, 0, 0),
      weight: 700,
    });

    textFields.forEach(elm => {
      firstPage.drawText(String(elm.text), {
        x: width / 2 - (elm.text.length * elm.fontSize) / 3.5 - elm.xPos,
        y: height - height / 2 - elm.yPos,
        size: elm.fontSize,
        font: elm.Font,
        color: rgb(0, 0, 0),
        weight: 700,
      });
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
  }, [formData, textFields]);

  async function handleFileSelect(e) {
    const file = e[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      await localStorage.setItem('uploadedPdf', base64String);
      //console.log('PDF saved successfully');
      createPdf(base64String); // Ensure PDF is created after file is saved
    };
    reader.readAsDataURL(file);
    setFile(file);
  }

  return (
    <>
      <div className="w-full h-[85vh] flex flex-row items-center justify-center gap-8 p-8 bg-white">
        <div className="w-1/4 bg-white shadow-lg rounded-lg px-6 py-8 flex flex-col items-center gap-6 h-full overflow-scroll">
          <Numberline className="w-full" value={50} />
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl py-4 font-bold">
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
                          <Button className="w-1/5 h-1/2 py-3 bg-sky-500 text-white text-l font-bold rounded-xl transition duration-300 ease-in-out hover:bg-sky-600">
                            Upload your own
                          </Button>
                        </FileTrigger>
                        <a
                          href="https://www.canva.com/templates/?query=certificate"
                          className="flex flex-col items-center justify-center w-1/5 h-1/2 py-3 border-2 border-black bg-white text-xl font-bold rounded-xl transition-all duration-300 ease-in-out hover:bg-white border-purple-600 bg-cyan-100 hover:border-black text-purple-700 hover:text-black"
                        >
                          <Button>
                            Go to
                            <span className="text-3xl block italic">
                              <Image
                                src="/Canva_Logo.svg.png"
                                width={150}
                                height={100}
                                alt="logo"
                              />
                            </span>
                          </Button>
                        </a>
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
              <div className="w-full overflow-scroll">
                <div className="w-full flex flex-col gap-4">
                  <h1 className="font-bold">Name</h1>
                  <div className="flex items-center">
                    <h1 className="w-1/6">X Axis</h1>
                    <Slider
                      key={0}
                      minValue={
                        -(
                          pageProps.width / 2 -
                          (formData.Name.length * 24) / 3.5
                        )
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
                {textFields.map((elm, index) => (
                  <div className="w-full flex flex-col gap-4 mt-4" key={index}>
                    <h1 className="font-bold">
                      {'Static Field ' + (index + 1)}
                    </h1>{' '}
                    <TextField className="">
                      <Label>text</Label>
                      <Input
                        className="ml-4 border-2 border-transparent border-b-blue-300 w-5/6"
                        onChange={e => handleTextFieldInput(index, e)}
                      />
                    </TextField>
                    <div className="w-full flex gap-2">
                      <TextField className="w-fit flex gap-2">
                        <Label>font size</Label>
                        <Input
                          className="border-2 border-black border-b-blue-300 w-8"
                          onChange={e => handleFontSizeInput(index, e)}
                        />
                        <Label>px</Label>
                      </TextField>{' '}
                    </div>
                    <div className="flex items-center">
                      <h1 className="w-1/6">X Axis</h1>

                      <Slider
                        key={0}
                        minValue={
                          -(
                            pageProps.width / 2 -
                            (formData.Name.length * 24) / 3.5
                          )
                        }
                        maxValue={
                          pageProps.width / 2 -
                          (formData.Name.length * 24) / 3.5
                        }
                        defaultValue={0}
                        className="w-full"
                        onFocus={() => handleFocus(index)}
                        onChange={value => handleXaxisTextField(index, value)}
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
                        onFocus={() => handleFocus(index)}
                        onChange={value => handleYaxisTextField(index, value)}
                      >
                        <SliderOutput />
                        <SliderTrack className="p-1 bg-gray-300 rounded-lg">
                          <SliderThumb className="p-3 bg-sky-500 rounded-full shadow-md" />
                        </SliderTrack>
                      </Slider>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col gap-4 mt-6 items-center">
                <Button
                  className="w-1/3 py-3 bg-sky-500 text-white text-xl font-bold rounded-lg transition duration-300 ease-in-out hover:bg-sky-600"
                  onClick={addTextField}
                >
                  +
                </Button>
                <Button className="w-full py-3 bg-gray-300 text-gray-700 text-xl font-bold rounded-lg">
                  <a href={pdfUrl} download="generated.pdf">
                    Download Sample
                  </a>
                </Button>
                {(file == undefined && (
                  <Button className="w-full py-3 bg-gray-200 text-gray-400 text-xl font-bold rounded-lg transition duration-300 ease-in-out cursor-not-allowed">
                    Choose an email template
                  </Button>
                )) || (
                  <Button
                    className="w-full py-3 bg-sky-500 text-white text-xl font-bold rounded-lg transition duration-300 ease-in-out hover:bg-sky-600 cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Choose an email template
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {pdfUrl && (
          <div className="w-3/5 h-full bg-white shadow-lg rounded-lg overflow-hidden">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full"
              style={{
                border: 'none',
                width: '100%',
                height: '100%',
                display: 'block',
              }}
              allowFullScreen
            ></iframe>
          </div>
        )}

        {loading && (
          <div className="absolute bg-white h-40 w-[30vw] right-0 bottom-2 border-4 border-blue-400 rounded-xl flex justify-center items-center">
            <h1> Loading, Please be calm</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default PdfCreator;
