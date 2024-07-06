'use client';
import Numberline from '@/components/Numberline';
import Image from 'next/image';

export default function CreateMail() {

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Numberline className="w-2/5" value={100} />
      <h1 className="text-3xl font-bold mt-6">All mails have been sent</h1>
      <div className="w-full flex flex-col items-center justify-center gap-8 p-10">
        <div className="rounded-full border-4 border-sky-500 p-10">
          <Image src="/tickMark.png" width={150} height={150} alt="tick-mark"/>
        </div>
      </div>
    </div>
  );
}
