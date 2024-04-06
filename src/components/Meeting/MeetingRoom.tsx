import { cn } from "@/lib/utils";
import {
  Call,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useState } from "react";

export enum RoomLayout {
  GRID = "GRID",
  SPEAKER_LEFT = "SPEAKER_LEFT",
  SPEAKER_RIGHT = "SPEAKER_RIGHT",
}

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
  const [layout, setLayout] = useState<RoomLayout>(RoomLayout.SPEAKER_LEFT);
  const [showParticipants, setShowParticipants] = useState(false);

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

      <div></div>
    </section>
  );
};

export default MeetingRoom;
