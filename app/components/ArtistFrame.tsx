import Image from "next/image";
import { CldImage } from 'next-cloudinary';
import Link from "next/link";
import { Saira_Stencil_One } from "next/font/google";

const sairaStencilOne = Saira_Stencil_One({ subsets: ['latin'], weight: '400' });

interface Artist {
  name: string;
  image: string;
  link: string;
}

interface ArtistFrameProps {
  artist?: Artist;
  isEmpty?: boolean;
}

const ArtistFrame = ({ artist, isEmpty = false }: ArtistFrameProps) => {
  if (isEmpty) {
    return (
      <div className="relative aspect-3/5 w-full h-auto mx-auto block">
        {/* Frame background */}
        <div className="relative flex justify-center">
          <Image
            src="/images/assets/frm_photoFrame.webp"
            alt="Empty Frame"
            width={500}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Empty Nameplate */}
        <div className="relative w-full h-12 md:h-16 lg:h-20 flex justify-center items-center">
          <Image
            src="/images/components/nameplate.webp"
            alt="Nameplate"
            fill
            className="object-cover rounded-b-lg"
          />
        </div>
      </div>
    );
  }

  if (!artist) return null;

  return (
    <Link
      href={artist.link}
      className="relative aspect-3/5 w-full h-auto mx-auto block"
    >
      {/* Frame background */}
      <div className="relative flex justify-center">
        <Image
          src="/images/assets/frm_photoFrame.webp"
          alt="Artist Frame"
          width={500}
          height={800}
          className="w-full h-auto"
          priority
        />

        {/* Artist image container positioned within the frame window */}
        <div className="absolute inset-[12%_14%_11%_14%] z-10 rounded-sm overflow-hidden">
          <CldImage
            src={artist.image}
            alt={artist.name}
            fill
            crop="fill"
            gravity="face"
            className="object-cover"
            fetchPriority="auto"
          />
        </div>
      </div>

      {/* Artist name */}
      <div className="relative w-full h-12 md:h-16 lg:h-20 flex justify-center items-center">
        <Image
          src="/images/components/nameplate.webp"
          alt="Nameplate"
          fill
          className="object-cover rounded-b-lg"
        />
        <span
          className={`z-50 font-extrabold uppercase text-lg md:text-2xl lg:text-4xl drop-shadow-lg bg-[url('/images/assets/overlay.webp')] bg-cover bg-center bg-clip-text text-transparent ${sairaStencilOne.className}`}
        >
          {artist.name}
        </span>
      </div>
    </Link>
  );
};

export default ArtistFrame;
