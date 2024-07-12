import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[70vh] py-4 md:h-[58vh] md:flex md:justify-center bg-white">
        <Image
          src="/certImage.png"
          alt="certificate example"
          height={500}
          width={500}
          className="md:block shadow-black/35 shadow-lg hover:scale-105 transition-all ease-in-out duration-500"
        />
        <div className="px-4 py-4 flex flex-col md:gap-6 md:w-full md:justify-center">
          <h1 className="text-[#09B5FF] text-2xl md:text-4xl md font-semibold">
            Simplify Your Events
          </h1>
          <p className="text-2xl md:text-3xl font-[350]">
            Easy Certificate Creation and Distribution in 3 Simple Steps.
          </p>
          <div className="flex flex-col gap-5 w-full justify-self-end mt-4 md:mt-0">
            <h2 className="text-center text-xl md:text-2xl text-sky-500 font-semibold border-2 border-sky-500 rounded-full px-6 py-2 hover:bg-sky-500 hover:text-white transition-colors duration-300 md:w-2/3">
              <Link href="/auth">Organizing A Event ?</Link>
            </h2>
            <h2 className="text-center text-xl md:text-2xl font-bold text-white border-2 border-sky-500 rounded-full px-6 py-2 bg-sky-500 hover:text-white transition-colors duration-300 md:w-2/3 md:self-end">
              <Link href="/auth">Try it out NOW !</Link>
            </h2>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex gap-4 items-center justify-center bg-sky-500 md:px-10 py-10">
        <div className="text-black md:w-1/2 bg-white md:py-5 py-3 rounded-xl border-black border-2 mx-6">
          <div>
            <h1 className="underline font-bold text-3xl md:text-4xl text-center text-sky-400">
              Step 1
            </h1>
            <p className="px-8 mt-4 text-xl md:text-2xl font-semibold ">
              Upload your recipient Names and Emails.
              <span className="font-extrabold underline">
                Your user data is NEVER stored on our servers.
              </span>
              Thus, with CredCraft your users feel safe.
            </p>
          </div>
        </div>
        <Image
          src="/step1.png"
          alt="certificate example"
          height={500}
          width={500}
          className="hidden md:block shadow-black/35 shadow-xl hover:scale-105 transition-all ease-in-out duration-500 rounded-lg"
        />
      </div>
      <div className="w-full h-fit flex gap-4 items-center justify-center bg-white md:px-10 py-10">
        <Image
          src="/step2.png"
          alt="certificate example"
          height={500}
          width={500}
          className="hidden md:block shadow-black/35 shadow-xl hover:scale-105 transition-all ease-in-out duration-500 rounded-lg"
        />
        <div className="text-black md:w-1/2 bg-white md:py-8 py-3 rounded-xl border-sky-500 md:border-dashed border-2 mx-6">
          <h1 className="underline font-bold text-3xl md:text-4xl text-sky-500 text-center">
            Step 2
          </h1>
          <p className="px-8 mt-4 text-xl md:text-2xl font-semibold">
            Customize certificate templates according to your needs or upload
            your own, add extra text fields as needed !
          </p>
        </div>
      </div>
      <div className="w-full h-fit flex gap-4 items-center justify-center bg-sky-500 md:px-10 py-10">
        <div className="text-black md:w-1/2 bg-white md:py-6 py-3 rounded-xl border-black border-2 mx-6">
          <h1 className="underline font-bold text-3xl md:text-4xl text-sky-500 text-center">
            Step 3
          </h1>
          <p className="px-8 mt-4 text-xl md:text-2xl font-semibold">
            Choose an email template or make your own HTML template using our{' '}
            <span className="underline font-extrabold">AI tool</span>, and send
            mails with press of a button !
          </p>
        </div>
        <Image
          src="/step3.png"
          alt="certificate example"
          height={500}
          width={500}
          className="hidden md:block shadow-black/35 shadow-xl hover:scale-105 transition-all ease-in-out duration-500 rounded-lg"
        />
      </div>
      <div className="w-full h-fit flex flex-col items-center justify-center bg-white text-center px-8 py-10">
        <h1 className="font-semibold text-2xl text-black text-center">
          And it’s <span className="text-green-500">done</span> ! It’s really
          that simple with{' '}
          <span className="text-sky-500 font-bold">CredCraft</span>.
        </h1>
        <Image
          src="/CredCraftLogo.png"
          alt="CredCraft Logo"
          width={200}
          height={200}
          className="my-4"
        />
        <div className="border-2 w-full border-b-gray-300 my-4" />
        <div className="flex justify-between w-full my-4">
          <div className="w-1/2">
            <h1 className="font-bold">Contact Us</h1>
            <p>support@credcraft.app</p>
            <p>sponsorship@credcraft.app</p>
          </div>
          <div>
            <h1 className="font-bold">Socials</h1>
            <p>X.com</p>
            <p>Medial</p>
          </div>
        </div>
      </div>
    </div>
  );
}
