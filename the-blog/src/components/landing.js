import React from 'react';

const LandingPage = () => {
  return (
    <div className="container mx-auto mt-10 p-6 bg-pink-100 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-purple-600 mb-6">Welcome to My Photography Blog</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">About Me</h2>
        <p className="text-gray-600 mt-2">
          Hi! I'm a professional photographer with a passion for capturing special moments. 
          On this blog, I share my photography experiences and tips with the community.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Visitor Guidelines</h2>
        <p className="text-gray-600 mt-2">
          Our blog is a space for sharing and inspiration. Bullying or negative comments will not be tolerated.
          Please respect the opinions of others and enjoy the content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">How to Contribute</h2>
        <p className="text-gray-600 mt-2">
          Want to share your own photography experiences or tips? You can contribute by adding a new post! 
          Click on the 'Add New Post' link in the navigation to get started.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
