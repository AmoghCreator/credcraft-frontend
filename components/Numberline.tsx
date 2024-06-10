'use client';
import {ProgressBar, Label} from 'react-aria-components';

export default function Numberline(props) {
  return (
    <div className={`relative ${props.className}`}>
  <ProgressBar value={props.value}>
    {({ percentage, valueText }) => (
      <div className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 bg-sky-500 h-full transition-all ease-in"
          style={{ width: `${percentage}%` }}
        />
      </div>
    )}
  </ProgressBar>
  <div className="flex justify-between w-full absolute top-0 -mt-7 text-3xl" id="balls">
    <div className={`rounded-full h-16 w-16 flex justify-center items-center transition-all ${props.value >= 0 ? 'bg-sky-500 text-white' : 'bg-gray-300 text-white'}`}>
      <h1>1</h1>
    </div>
    <div className={`rounded-full h-16 w-16 flex justify-center items-center transition-all ${props.value >= 50 ? 'bg-sky-500 text-white' : 'bg-gray-300 text-white'}`}>
      <h1>2</h1>
    </div>
    <div className={`rounded-full h-16 w-16 flex justify-center items-center transition-all ${props.value === 100 ? 'bg-sky-500 text-white' : 'bg-gray-300 text-white'}`}>
      <h1>3</h1>
    </div>
  </div>
</div>
  );
}
