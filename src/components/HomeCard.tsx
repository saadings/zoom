import { cn } from "@/lib/utils";
import Image from "next/image";

const HomeCard = ({
  img,
  title,
  description,
  className,
  handleClick,
}: IHomeCardProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[260px] w-full cursor-pointer flex-col justify-between rounded-[14px] px-4 py-6 xl:max-w-[270px]",
        className,
      )}
      onClick={handleClick}
    >
      <div className="glassmorphism flex size-12 items-center justify-center rounded-[10px]">
        <Image src={img} alt="meting" width={27} height={27} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
