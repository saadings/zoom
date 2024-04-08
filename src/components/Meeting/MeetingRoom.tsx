import { useState } from "react";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "../EndCallButton";
import Loader from "../Loader";
import { RoomLayout } from "@/enums/room";

const CallLayout = ({ layout }: { layout: RoomLayout }) => {
  switch (layout) {
    case RoomLayout.GRID:
      return <PaginatedGridLayout />;

    case RoomLayout.SPEAKER_LEFT:
      return <SpeakerLayout participantsBarPosition={"left"} />;

    default:
      return <SpeakerLayout participantsBarPosition={"right"} />;
  }
};

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<RoomLayout>(RoomLayout.SPEAKER_LEFT);
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout layout={layout} />
        </div>
        <div
          className={cn("h-[calc(100vh - 86px)] ml-2 hidden", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-5">
        <CallControls onLeave={() => router.push("/")} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#19232D] p-2 hover:bg-[#4C535B]">
              <LayoutList className="text-white" size={20} />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {Object.values(RoomLayout).map((layout, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setLayout(layout.toLowerCase() as RoomLayout)}
                >
                  {layout}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-2 border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-full bg-[#19232D] p-2 hover:bg-[#4C535B]">
            <Users className="text-white" size={20} />
          </div>
        </button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
