import React from 'react'
import LoadingGift from '../images/loader.gif';

const Loader = () => {
  return (
    <div className='loader'>
        <div className='loader_image'>
            <img src={LoadingGift} alt="" />
        </div>
    </div>
  )
}

export default Loader