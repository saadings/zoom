"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useToast } from "./ui/use-toast";

export enum MeetingStatus {
  IS_SCHEDULED = "IS_SCHEDULED",
  IS_JOINING = "IS_JOINING",
  IS_INSTANT = "IS_INSTANT",
}

const MeetingTypesList = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [meetingState, setMeetingState] = useState<MeetingStatus | undefined>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }

      const id = crypto.randomUUID();

      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) router.push(`/meeting/${call.id}`);

      toast({
        title: "Meeting created",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        img="/icons/add-meeting.svg"
        className="bg-orange-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_INSTANT)}
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting"
        img="/icons/schedule.svg"
        className="bg-blue-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_SCHEDULED)}
      />
      <HomeCard
        title="View Recordings"
        description="Check out your recordings"
        img="/icons/recordings.svg"
        className="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        title="Join Meeting"
        description="Via invitation link"
        img="/icons/join-meeting.svg"
        className="bg-yellow-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_JOINING)}
      />

      <MeetingModal
        isOpen={meetingState === MeetingStatus.IS_INSTANT}
        onClose={() => setMeetingState(undefined)}
        title={"Start Instant Meeting"}
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypesList;
