/* eslint-disable react/prop-types */
export const EmptyCard = ({ isSearch }) => {
  if (!isSearch) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white text-center p-6'>
        <div className='w-full max-w-md p-6 bg-white shadow-md rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>
            Looks like your note space is a blank canvas
          </h2>
          <p className='text-gray-700 mb-6'>
            Waiting for your thoughts to paint a masterpiece. Whether it&#39;s a
            fleeting idea or a grand plan, every great journey begins with a
            single note.
          </p>
          <div className='text-gray-500 text-sm'>— Your Thoughts Await</div>
        </div>
      </div>
    );
  }

  if (isSearch) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white text-center p-6'>
        <div className='w-full max-w-md p-6 bg-white shadow-md rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>
            It looks like your search didn&#39;t turn up any notes.
          </h2>
          <p className='text-gray-700 mb-6'>
            But don&#39;t worry, every empty space is a chance to start
            something new. Maybe now&#39;s the perfect time to jot down that
            brilliant idea or dream that&#39;s been brewing in your mind.
          </p>
          <div className='text-gray-500 text-sm'>
            — Your next great note is just a click away!
          </div>
        </div>
      </div>
    );
  }
};
