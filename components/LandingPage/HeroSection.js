import Link from "next/link";

const HeroSection = () => {
  return (
    <>
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <div
            className="relative flex min-h-[500px] flex-col items-center justify-center gap-8 rounded-xl bg-cover bg-center p-8 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCReRP3g8fEjCDN8TrbahdMFGraFVHGby8JDKKmLg543EL110AmbxOKgiYmjs985XjXx_mcBlYZO7Auzk8ADF1WplMSYCtc3ay-9GlhaaI-DMVkoYbN-_wbcLQju9VVLoQDdjW7MjNz-GK_dTv8QUY7uuLsM2uMSGWv4qr-a5EX4tclt0QldkgI8yhpNtHgfB7YyrUel4gCaN95K2_0de9gwHjgZi5vY1uQjyo0qyky9VVL6VyC5cshw4XtJzO9bXK1_o0vBKDztUc")`,
            }}
          >
            <div className="flex flex-col gap-4 max-w-3xl">
              <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tighter">
                Discover Your Next Great Read
              </h1>
              <p className="text-white/80 text-base md:text-lg">
                Dive into a world of stories tailored just for you. Our
                recommendation system helps you find books you'll love, based on
                your interests and reading history.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={"/login"}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
              >
                <span className="truncate">Explore Books</span>
              </Link>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors text-base font-bold leading-normal tracking-wide">
                <span className="truncate">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-background-light dark:bg-background-dark border-t border-primary/20">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-6">
            <a
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Contact
            </a>
            <a
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} BookWise. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HeroSection;
