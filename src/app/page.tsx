"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"
import { useRouter } from "next/navigation"
import { useAuth, SignInButton } from "@clerk/nextjs"
import MainLayout from "@/components/layouts/MainLayout"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"

// Image data for the floating elements
const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1727341554370-80e0fe9ad082?q=80&w=2276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Branislav Rodman",
    link: "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-brushing-her-teeth-r1SjnJL5tf0",
    title: "A Black and White Photo of a Woman Brushing Her Teeth",
  },
  {
    url: "https://images.unsplash.com/photo-1640680608781-2e4199dd1579?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-painting-of-a-palm-leaf-on-a-multicolored-background-AaNPwrSNOFE",
    title: "Neon Palm",
    author: "Tim Mossholder",
  },
  {
    url: "https://images.unsplash.com/photo-1726083085160-feeb4e1e5b00?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-blurry-photo-of-a-crowd-of-people-UgbxzloNGsc",
    author: "ANDRII SOLOK",
    title: "A blurry photo of a crowd of people",
  },
  {
    url: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=2838&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/rippling-crystal-blue-water-9-OCsKoyQlk",
    author: "Wesley Tingey",
    title: "Rippling Crystal Blue Water",
  },
  {
    url: "https://images.unsplash.com/photo-1624344965199-ed40391d20f2?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/de/fotos/mann-im-schwarzen-hemd-unter-blauem-himmel-m8RDNiuEXro",
    author: "Serhii Tyaglovsky",
    title: "Mann im schwarzen Hemd unter blauem Himmel",
  },
  {
    url: "https://images.unsplash.com/photo-1689553079282-45df1b35741b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "https://unsplash.com/photos/a-woman-with-a-flower-crown-on-her-head-0S3muIttbsY",
    author: "Vladimir Yelizarov",
    title: "A women with a flower crown on her head",
  },
  {
    url: "https://images.unsplash.com/photo-1721968317938-cf8c60fccd1a?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "A blurry photo of white flowers in a field",
    author: "Eugene Golovesov",
    link: "https://unsplash.com/photos/a-blurry-photo-of-white-flowers-in-a-field-6qbx0lzGPyc",
  },
  {
    url: "https://images.unsplash.com/photo-1677338354108-223e807fb1bd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Mathilde Langevin",
    link: "https://unsplash.com/photos/a-table-topped-with-two-wine-glasses-and-plates-Ig0gRAHspV0",
    title: "A table topped with two wine glasses and plates",
  },
]

// Home component with the floating effect
export default function Home() {
  const [scope, animate] = useAnimate()
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [animate])

  const handleExploreClick = () => {
    if (isSignedIn) {
      // If user is signed in, navigate to explore page
      router.push('/home/explore')
    }
    // If not signed in, the SignInButton will handle showing the modal
  }

  return (
    <MainLayout showHeader={true} showFooter={true} fullHeight={true}>
      <div 
        className="flex w-full h-screen justify-center items-center bg-photo-primary overflow-hidden relative"
        ref={scope}
      >
        {/* Central content */}
        <motion.div
          className="z-50 text-center space-y-5 items-center flex flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, delay: 1.5 }}
        >
          <p className="text-5xl md:text-7xl z-50 text-photo-secondary font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-photo-blue to-photo-pink">
            Memoria
          </p>
          <div className="flex flex-col items-center gap-2">
            <p className="text-photo-secondary/80 text-sm md:text-base max-w-md text-center">
              Capture your memories in stunning detail with our professional photo gallery
            </p>
            
            {isLoaded && isSignedIn ? (
              // Logged in users - direct navigation button
              <button 
                onClick={handleExploreClick}
                className="text-sm hover:scale-105 transition-transform bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-full py-2 px-6 cursor-pointer mt-2"
              >
                Explore Now
              </button>
            ) : (
              // Non-logged in users - show sign in modal
              <SignInButton mode="modal">
                <button className="text-sm hover:scale-105 transition-transform bg-gradient-to-r from-photo-indigo to-photo-violet text-photo-secondary rounded-full py-2 px-6 cursor-pointer mt-2">
                  Explore Now
                </button>
              </SignInButton>
            )}
          </div>
        </motion.div>

        {/* Floating images with parallax effect */}
        <Floating sensitivity={-1} className="overflow-hidden">
          <FloatingElement depth={0.5} className="top-[15%] left-[11%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[0].url}
              alt={exampleImages[0].title}
              className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
          <FloatingElement depth={1} className="top-[18%] left-[32%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[1].url}
              alt={exampleImages[1].title}
              className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
          <FloatingElement depth={2} className="top-[8%] left-[53%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[2].url}
              alt={exampleImages[2].title}
              className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
          <FloatingElement depth={1} className="top-[10%] left-[83%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[3].url}
              alt={exampleImages[3].title}
              className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>

          <FloatingElement depth={1} className="top-[45%] left-[2%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[4].url}
              alt={exampleImages[4].title}
              className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
          <FloatingElement depth={2} className="top-[70%] left-[77%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[7].url}
              alt={exampleImages[7].title}
              className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>

          <FloatingElement depth={4} className="top-[73%] left-[15%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[5].url}
              alt={exampleImages[5].title}
              className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
          <FloatingElement depth={1} className="top-[80%] left-[50%]">
            <motion.img
              initial={{ opacity: 0 }}
              src={exampleImages[6].url}
              alt={exampleImages[6].title}
              className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-md"
            />
          </FloatingElement>
        </Floating>
      </div>
    </MainLayout>
  )
}