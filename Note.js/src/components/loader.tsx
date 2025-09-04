
import styled from 'styled-components';
import {motion} from "framer-motion"



const Loader = () => {
  return (
     <motion.div 
     animate={{opacity:1}}
     exit={{opacity:0}}
     transition={{ease:"linear"}}
     className='h-screen top-0  w-full fixed flex items-center bg-zinc-900 justify-center '>

    <StyledWrapper className='scale-75'>
      <svg viewBox="25 25 50 50" color='white'>
        <circle r={20} cy={50} cx={50} />
      </svg>
      Loading
    </StyledWrapper>
     </motion.div>
  );
}

const StyledWrapper = styled.div`
  svg {
   width: 3.25em;
   transform-origin: center;
   animation: rotate4 2s linear infinite;
  }

  circle {
   fill: none;
   stroke: hsl(214, 97%, 59%);
   stroke-width: 5;
   stroke-dasharray: 1, 200;
   stroke-dashoffset: 0;
   stroke-linecap: round;
   animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
   100% {
    transform: rotate(360deg);
   }
  }

  @keyframes dash4 {
   0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
   }

   50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
   }

   100% {
    stroke-dashoffset: -125px;
   }
  }`;

export default Loader;
